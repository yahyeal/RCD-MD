import { readFile } from 'fs/promises';

const contactPushCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, '94753574803@s.whatsapp.net'].includes(m.sender); // Your owner number
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'contact-push') {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    // Ensure the command is used as a reply to a VCF file
    if (!m.quoted || !m.quoted.mimetype.includes('vcard')) {
      return m.reply("Please reply to a VCF file with this command.");
    }

    try {
      // Download and read the VCF file content
      const vcfFilePath = await Matrix.downloadMediaMessage(m.quoted);
      const vcfContent = await readFile(vcfFilePath, 'utf-8');

      // Extract phone numbers from the VCF content
      const phoneNumbers = [];
      const vcfLines = vcfContent.split('\n');
      for (const line of vcfLines) {
        if (line.startsWith('TEL')) {
          const number = line.split(':')[1].trim();
          if (number) phoneNumbers.push(number.replace(/[^0-9]/g, '')); // Clean the number
        }
      }

      // Send "hi" message to each extracted phone number
      for (const number of phoneNumbers) {
        const jid = `${number}@s.whatsapp.net`;
        await Matrix.sendMessage(jid, { text: 'hi' });
      }

      m.reply(`"Hi" message sent to ${phoneNumbers.length} contacts from the VCF file.`);

    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default contactPushCommand;
