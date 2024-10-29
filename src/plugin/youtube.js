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
  if (selectedButtonId === "download_720") {
    const video720 = await fetchVideoDetails(videoUrl, '720');
    await Matrix.sendMessage(m.from, {
      text: `Here's your download link for *${video720.title}* (720p): ${video720.download_url}`
    });
  } else if (selectedButtonId === "download_480") {
    const video480 = await fetchVideoDetails(videoUrl, '480');
    await Matrix.sendMessage(m.from, {
      text: `Here's your download link for *${video480.title}* (480p): ${video480.download_url}`
    });
  } else if (selectedButtonId === "download_320") {
    const video320 = await fetchVideoDetails(videoUrl, '320');
    await Matrix.sendMessage(m.from, {
      text: `Here's your download link for *${video320.title}* (320p): ${video320.download_url}`
    });
  }
};

export default videoCommand;
