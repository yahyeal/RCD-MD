import fs from 'fs';
import axios from 'axios';
import makeWASocket from '@whiskeysockets/baileys';

const xvdl = async (m) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'xvdl') return;

    const url = m.body.split(' ')[1];
    if (!url) {
      return await m.reply('Please provide a valid URL for the video you want to download.');
    }

    await m.reply('Fetching video information, please wait...');

    try {
      const response = await axios.get(`https://dark-yasiya-api-new.vercel.app/download/xvideo?url=${url}`);
      
      if (response.data && response.data.status) {
        const { title, views, like, image, dl_link } = response.data.result;

        // Attempt to download video thumbnail image
        let imagePath;
        try {
          const imageResponse = await axios.get(image, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              'Referer': 'https://www.xvideos.com'
            },
            maxRedirects: 5
          });
          imagePath = `./${Date.now()}-thumbnail.jpg`;
          fs.writeFileSync(imagePath, imageResponse.data);

          await m.reply({ image: { url: imagePath }, caption: `📹 *Title*: ${title}\n\n📊 *Views*: ${views}\n❤️ *Likes*: ${like}\n🔗 *Download Link*: [Click Here](${dl_link})` });

          fs.unlinkSync(imagePath); // Clean up thumbnail file
        } catch (error) {
          console.error('Thumbnail download error:', error); // Log the error
          await m.reply('Failed to download the video thumbnail. Proceeding with video download only.');
        }

        // Download the video file
        try {
          const videoResponse = await axios.get(dl_link, { responseType: 'arraybuffer', maxRedirects: 5 });
          const videoPath = `./${Date.now()}.mp4`;
          fs.writeFileSync(videoPath, videoResponse.data);

          await m.reply({ video: { url: videoPath }, caption: `📹 *Title*: ${title}\n\n📊 *Views*: ${views}\n❤️ *Likes*: ${like}` });

          fs.unlinkSync(videoPath); // Clean up video file
        } catch (error) {
          console.error('Video download error:', error); // Log the error
          await m.reply('Failed to download the video. Please check the download link.');
        }

      } else {
        await m.reply('Failed to fetch video data. The video might not exist or the URL is invalid. Please check and try again.');
      }
    } catch (error) {
      console.error('API fetch error:', error); // Log the error
      await m.reply('An error occurred while fetching video data. Please check the API endpoint or your internet connection.');
    }
  } catch (error) {
    console.error('Command processing error:', error); // Log the error
    await m.reply('An error occurred while processing the command. Please try again.');
  }
};

// Start the bot
const startBot = async () => {
  const sock = makeWASocket();

  sock.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0];
    if (!message.key.fromMe && message.message) {
      await xvdl(message);
    }
  });

  // More event handlers and socket configurations...
};

startBot();
