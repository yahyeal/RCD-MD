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

        // Download video thumbnail image
        try {
          const imageResponse = await axios.get(image, { responseType: 'arraybuffer' });
          const imagePath = `./${Date.now()}-thumbnail.jpg`;
          fs.writeFileSync(imagePath, imageResponse.data);
        } catch (error) {
          console.error('Error downloading thumbnail:', error.message);
          return m.reply('Failed to download the video thumbnail. Please check the image URL.');
        }

        // Download the video file
        try {
          const videoResponse = await axios.get(dl_link, { responseType: 'arraybuffer' });
          const videoPath = `./${Date.now()}.mp4`;
          fs.writeFileSync(videoPath, videoResponse.data);
        } catch (error) {
          console.error('Error downloading video:', error.message);
          return m.reply('Failed to download the video. Please check the download link.');
        }

        // Construct the caption with views, likes, and download link
        const caption = `📹 *Title*: ${title}\n\n📊 *Views*: ${views}\n❤️ *Likes*: ${like}\n🔗 *Download Link*: [Click Here](${dl_link})`;

        // Send the video thumbnail with caption
        await m.reply({ image: { path: imagePath }, caption });

        // Clean up temporary files
        fs.unlinkSync(imagePath);
        fs.unlinkSync(videoPath);
      } else {
        m.reply('Failed to fetch video data. The video might not exist or the URL is invalid. Please check and try again.');
      }
    } catch (error) {
      console.error('API fetch error:', error.message);
      m.reply('An error occurred while fetching video data. Please check the API endpoint or your internet connection.');
    }
  } catch (error) {
    console.error('Command processing error:', error.message);
    m.reply('An error occurred while processing the command. Please try again.');
  }
};

export default xvdl;
