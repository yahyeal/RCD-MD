import fs from 'fs';
import axios from 'axios';

const xvdl = async (m, gss) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'xvdl') return;

    const url = m.body.split(' ')[1];
    if (!url) {
      return m.reply('Please provide a valid URL for the video you want to download.');
    }

    m.reply('Fetching video information, please wait...');

    try {
      // Request video data from the API using the provided URL
      const response = await axios.get(`https://dark-yasiya-api-new.vercel.app/download/xvideo?url=${url}`);

      // Check if the response has the expected structure and data
      if (response.data && response.data.status) {
        const { title, views, like, image, dl_link } = response.data.result;

        // Reply with the video details
        await m.reply(`📹 *Title*: ${title}\n\n📊 *Views*: ${views}\n❤️ *Likes*: ${like}\n\nFetching the video and thumbnail, please wait...`);

        // Attempt to download video thumbnail image
        let imagePath;
        try {
          const imageResponse = await axios.get(image, { responseType: 'arraybuffer' });
          imagePath = `./${Date.now()}-thumbnail.jpg`;
          fs.writeFileSync(imagePath, imageResponse.data);

          // Send the thumbnail image with caption
          await m.reply({ image: { path: imagePath }, caption: `📹 *Title*: ${title}\n\n📊 *Views*: ${views}\n❤️ *Likes*: ${like}\n🔗 *Download Link*: [Click Here](${dl_link})` });

          // Clean up thumbnail file
          fs.unlinkSync(imagePath);
        } catch (error) {
          // Notify user if thumbnail download failed
          m.reply('Failed to download the video thumbnail. Proceeding with video download only.');
        }

        // Download the video file
        try {
          const videoResponse = await axios.get(dl_link, { responseType: 'arraybuffer' });
          const videoPath = `./${Date.now()}.mp4`;
          fs.writeFileSync(videoPath, videoResponse.data);

          // Clean up video file after use (uncomment below line if you want to delete the file after use)
          fs.unlinkSync(videoPath);
        } catch (error) {
          return m.reply('Failed to download the video. Please check the download link.');
        }

      } else {
        m.reply('Failed to fetch video data. The video might not exist or the URL is invalid. Please check and try again.');
      }
    } catch (error) {
      m.reply('An error occurred while fetching video data. Please check the API endpoint or your internet connection.');
    }
  } catch (error) {
    m.reply('An error occurred while processing the command. Please try again.');
  }
};

export default xvdl;
