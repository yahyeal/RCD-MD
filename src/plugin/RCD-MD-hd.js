import fs from 'fs';
import axios from 'axios';
import makeWASocket from '@whiskeysockets/baileys';

// Function to handle the xvdl command
const xvdl = async (m) => {
  try {
    // Define command prefix
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    // Check if the command is xvdl
    if (cmd !== 'xvdl') return;

    // Extract the URL from the message
    const url = m.body.split(' ')[1];
    if (!url) {
      return await m.reply('Please provide a valid URL for the video you want to download.');
    }

    await m.reply('Fetching video information, please wait...');

    try {
      // Fetch video data from the API
      const response = await axios.get(`https://dark-yasiya-api-new.vercel.app/download/xvideo?url=${url}`);
      
      // Check the response status and extract data
      if (response.data && response.data.status) {
        const { title, views, like, image, dl_link } = response.data.result;

        // Download the video thumbnail image
        let imagePath;
        try {
          const imageResponse = await axios.get(image, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              'Referer': 'https://www.xvideos.com',
            },
            maxRedirects: 5,
          });
          imagePath = `./${Date.now()}-thumbnail.jpg`;
          fs.writeFileSync(imagePath, imageResponse.data);
        } catch (error) {
          console.error('Thumbnail download error:', error);
          await m.reply('Failed to download the video thumbnail. Proceeding with video download only.');
        }

        // Download the video file
        try {
          const videoResponse = await axios.get(dl_link, { responseType: 'arraybuffer', maxRedirects: 5 });
          const videoPath = `./${Date.now()}.mp4`;
          fs.writeFileSync(videoPath, videoResponse.data);

          // Prepare the message caption
          const caption = `📹 *Title*: ${title}\n📊 *Views*: ${views}\n❤️ *Likes*: ${like}`;
          
          // Send the thumbnail if it was downloaded
          if (imagePath) {
            await m.reply({ image: { url: imagePath }, caption });
          }

          // Send the video
          await m.reply({ video: { url: videoPath }, caption });

          // Clean up temporary files
          fs.unlinkSync(videoPath); // Remove video file
          if (imagePath) fs.unlinkSync(imagePath); // Remove thumbnail if it exists
        } catch (error) {
          console.error('Video download error:', error);
          await m.reply('Failed to download the video. Please check the download link.');
        }
      } else {
        await m.reply('Failed to fetch video data. The video might not exist or the URL is invalid. Please check and try again.');
      }
    } catch (error) {
      console.error('API fetch error:', error);
      await m.reply('An error occurred while fetching video data. Please check the API endpoint or your internet connection.');
    }
  } catch (error) {
    console.error('Command processing error:', error);
    await m.reply('An error occurred while processing the command. Please try again.');
  }
};

// Start the bot and listen for messages
const startBot = async () => {
  const sock = makeWASocket();

  // Event listener for incoming messages
  sock.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0];
    if (!message.key.fromMe && message.message) {
      await xvdl(message);
    }
  });

  // More event handlers and socket configurations can be added here...
};

startBot();
