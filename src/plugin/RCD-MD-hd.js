import config from '../../config.cjs';
import { writeFile } from 'fs/promises';

const saveidCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, '94753574803@s.whatsapp.net'].includes(m.sender); // Your owner number
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'saveid') {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    // Check if the message is from a group
    if (!m.isGroup) return m.reply("This command can only be used in a group chat.");

    try {
      // Get group metadata including members
      const groupMetadata = await Matrix.groupMetadata(m.from);
      const members = groupMetadata.participants;

      // Generate VCF content using pushname for each member
      const vcfContent = await Promise.all(
        members.map(async member => {
          const jid = member.id;
          const contact = await Matrix.fetchContact(jid); // Fetching contact to get the pushname
          const name = contact.pushname || jid.split('@')[0]; // Use pushname, fallback to JID if not available
          return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL:${jid}\nEND:VCARD\n`;
        })
      );

      // Create a VCF file
      const vcfFilePath = './contacts.vcf';
      await writeFile(vcfFilePath, vcfContent.join(''));
      
      // Send the VCF file back to the group
      await Matrix.sendMessage(m.from, { document: { url: vcfFilePath }, mimetype: 'text/vcard', fileName: 'contacts.vcf' }, { quoted: m });

      // Optionally, send a confirmation message
      m.reply("VCF file containing group members has been created and sent.");
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default saveidCommand;
