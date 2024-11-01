import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import fs from 'fs';
import { Telegraf } from 'telegraf'; // Ensure you have Telegraf installed for Telegram integration

const bot = new Telegraf('8179555091:AAGbBHwLyewkvenNwlVYnyvWbpj0JBBCySY'); // Replace with your Telegram bot token

const rvo = async (m, sock) => {
  try {
    console.log('Quoted message:', m.quoted); // Logging statement to check the quoted message

    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['rvo', 'vv', 'readviewonce'];
    if (!validCommands.includes(cmd)) return;

    // Check if the quoted message is a view-once message
    if (!m.quoted || m.quoted.type !== 'view_once' || (m.quoted.mtype !== 'imageMessage' && m.quoted.mtype !== 'videoMessage')) {
      return m.reply('This is not a view once message');
    }

    // Extract the message and its type
    const msg = m.quoted.message;
    const type = Object.keys(msg)[0];

    const originalCaption = msg[type].caption || '';
    const newCaption = `${originalCaption}\n\n> © Powered By R C D-MD`;

    // Download the media content
    const mediaStream = await downloadContentFromMessage(msg[type], type === 'imageMessage' ? 'image' : 'video');
    let buffer = Buffer.from([]);
    for await (const chunk of mediaStream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Send the media back to the chat
    if (/video/.test(type)) {
      await sock.sendMessage(m.from, {
        video: buffer,
        caption: newCaption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 9999,
          isForwarded: true,
        }
      }, { quoted: m });

      // Forward video to Telegram
      await bot.telegram.sendVideo('YOUR_TELEGRAM_CHAT_ID', { source: buffer }, { caption: newCaption }); // Replace with your chat ID
    } else if (/image/.test(type)) {
      await sock.sendMessage(m.from, {
        image: buffer,
        caption: newCaption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 9999,
          isForwarded: true,
        }
      }, { quoted: m });

      // Forward image to Telegram
      await bot.telegram.sendPhoto('6983385429', { source: buffer }, { caption: newCaption }); // Replace with your chat ID
    }
  } catch (e) {
    console.error('Error:', e);
    m.reply('An error occurred while processing the command.');
  }
};

export default rvo;

// Start the Telegram bot
bot.launch();
