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
      console.log(response.data); // Log the API response for debugging

      // Check if the response has necessary data
      if (response.data && response.data.status) {
        const { title, views, like, image, dl_link } = response.data.result;

        // Download video thumbnail image
        const imageResponse = await axios.get(image, { responseType: 'arraybuffer' });
        const imagePath = `./${Date.now()}-thumbnail.jpg`;
        fs.writeFileSync(imagePath, imageResponse.data);

        // Construct the caption with views, likes, and download link
        const caption = `📹 *Title*: ${title}\n\n📊 *Views*: ${views}\n❤️ *Likes*: ${like}\n🔗 *Download Link*: [Click Here](${dl_link})`;

        // Send the video thumbnail with caption
        await m.reply({ image: { path: imagePath }, caption });

        // Optionally, send the actual video link
        m.reply(`You can also download the video directly using this link: ${dl_link}`);

        // Clean up temporary files
        fs.unlinkSync(imagePath);
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
