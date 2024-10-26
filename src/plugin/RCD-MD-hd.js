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
      return m.reply('Please provide a URL for the video you want to download.');
    }

    m.reply('Fetching video information, please wait...');

    try {
      // Request video data from the API
      const response = await axios.get(`https://dark-yasiya-api-new.vercel.app/download/xvideo?url=${url}`);
      
      // Check if the response has necessary data
      if (response.data && response.data.result) {
        const { video: videoUrl, image: imageUrl, views, likes } = response.data.result;

        // Download video thumbnail image
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imagePath = `./${Date.now()}-thumbnail.jpg`;
        fs.writeFileSync(imagePath, imageResponse.data);

        // Download the video file
        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        const videoPath = `./${Date.now()}.mp4`;
        fs.writeFileSync(videoPath, videoResponse.data);

        // Construct the caption with views and likes
        const caption = `Video Details:\n\n📊 Views: ${views}\n❤️ Likes: ${likes}`;

        // Send the video thumbnail with caption
        await m.reply({ image: { path: imagePath }, caption });

        // Send the video file
        await m.reply('Here is your video:', { filePath: videoPath, mimetype: 'video/mp4' });

        // Clean up temporary files
        fs.unlinkSync(imagePath);
        fs.unlinkSync(videoPath);
      } else {
        m.reply('Could not retrieve the video. Please check the URL and try again.');
      }
    } catch (error) {
      console.error('Error fetching the video:', error);
      m.reply('An error occurred during video download.');
    }
  } catch (error) {
    console.error('Error:', error);
    m.reply('An Error Occurred While Processing The Command.');
  }
};

export default xvdl;
