import fs from 'fs';
import axios from 'axios';
import config from '../../config.cjs';

let gptStatus = false; // Flag to check GPT status

const handleGreeting = async (m, gss) => {
  try {
    const textLower = m.body.toLowerCase();

    // Check for GPT on/off commands
    if (textLower === 'gpt on') {
      gptStatus = true;
      await gss.sendMessage(m.from, { text: 'GPT has been turned ON.' });
      return;
    } else if (textLower === 'gpt off') {
      gptStatus = false;
      await gss.sendMessage(m.from, { text: 'GPT has been turned OFF.' });
      return;
    }

    // When GPT is on, use the GPT API for all messages
    if (gptStatus) {
      const gptResponse = await axios.get(`https://api.giftedtech.my.id/api/ai/gpt4?apikey=gifted&q=${encodeURIComponent(m.body)}`);
      await gss.sendMessage(m.from, {
        text: gptResponse.data.answer,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      });
      return;
    }

    // Check for quoted messages with media (image or video)
    if (m.message && m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo) {
      const quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;

      if (quotedMessage) {
        // Check if it's an image
        if (quotedMessage.imageMessage) {
          const imageCaption = quotedMessage.imageMessage.caption;
          const imageUrl = await gss.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
          await gss.sendMessage(m.from, {
            image: { url: imageUrl },
            caption: imageCaption,
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9999,
              isForwarded: true,
            },
          });
        }

        // Check if it's a video
        if (quotedMessage.videoMessage) {
          const videoCaption = quotedMessage.videoMessage.caption;
          const videoUrl = await gss.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
          await gss.sendMessage(m.from, {
            video: { url: videoUrl },
            caption: videoCaption,
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9999,
              isForwarded: true,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default handleGreeting;
