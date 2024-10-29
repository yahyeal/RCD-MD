import moment from 'moment-timezone';
import pkg from '@whiskeysockets/baileys';
import axios from 'axios';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const VIDEO_API_URL = 'https://api.giftedtech.my.id/api/download/mp4?apikey=gifted&url=';

// Function to fetch video details from the API
async function fetchVideoDetails(url, quality = '720') {
  try {
    const response = await axios.get(`${VIDEO_API_URL}${encodeURIComponent(url)}&quality=${quality}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
}

const videoCommand = async (m, Matrix) => {
  // Extract command arguments
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.trim().split(' ').slice(1); // Get the command arguments
  const videoUrl = args[0]; // The first argument should be the video URL

  // Check if the command is "video" and if a URL is provided
  if (cmd === 'video') {
    if (!videoUrl) {
      return m.reply("Please provide a YouTube video URL to download.");
    }

    // Fetch video details
    const videoDetails = await fetchVideoDetails(videoUrl);
    if (!videoDetails) return m.reply("Failed to retrieve video details.");

    // Display video options with title and thumbnail
    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `*${videoDetails.title}*\nChoose a quality to download.`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "© RCD-MD Bot"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "Download Options",
                    sections: [
                      {
                        title: "Select Quality",
                        rows: [
                          {
                            title: "720p",
                            description: "High Quality (720p)",
                            id: "download_720"
                          },
                          {
                            title: "480p",
                            description: "Medium Quality (480p)",
                            id: "download_480"
                          },
                          {
                            title: "320p",
                            description: "Low Quality (320p)",
                            id: "download_320"
                          }
                        ]
                      }
                    ]
                  })
                }
              ]
            }),
          })
        }
      }
    }, {});

    await Matrix.relayMessage(m.from, msg.message, {
      messageId: msg.key.id
    });
  }

  // Handle quality selection for download
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;
  if (selectedButtonId) {
    let quality;
    if (selectedButtonId === "download_720") quality = '720';
    else if (selectedButtonId === "download_480") quality = '480';
    else if (selectedButtonId === "download_320") quality = '320';

    if (quality) {
      const videoDetails = await fetchVideoDetails(videoUrl, quality);
      if (videoDetails && videoDetails.download_url) {
        await Matrix.sendMessage(m.from, {
          image: { url: videoDetails.thumbnail },
          caption: `*Title:* ${videoDetails.title}\n*Quality:* ${videoDetails.quality}\n\n[Download Video](${videoDetails.download_url})`
        });
      } else {
        await m.reply("Failed to retrieve the download link. Please try again.");
      }
    }
  }
};

export default videoCommand;
