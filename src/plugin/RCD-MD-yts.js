import moment from 'moment-timezone';
import pkg from '@whiskeysockets/baileys';
import axios from 'axios';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const API_KEY = 'gifted'; // Your API key
const API_URL = 'https://api.giftedtech.my.id/api/search/yts';

// Function to fetch video/audio search results
async function fetchSearchResults(query) {
  try {
    const response = await axios.get(API_URL, {
      params: { apikey: API_KEY, query }
    });
    return response.data; // Adjust according to the actual response structure
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

const playCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.trim().split(' ').slice(1);
  const query = args.join(' '); // Join arguments as a query string

  // Check if the command is "play" and a query is provided
  if (cmd === 'play') {
    if (!query) {
      return m.reply("Please provide a search query.");
    }

    const results = await fetchSearchResults(query);

    if (!results || results.length === 0) {
      return m.reply("No results found.");
    }

    // Separate video and audio results
    const videoButtons = [];
    const audioButtons = [];

    results.forEach((result, index) => {
      if (result.type === 'video') {
        videoButtons.push({
          title: result.title, // Video title
          description: result.description || "No description available", // Optional description
          id: `video_${index}` // Unique ID for each video button
        });
      } else if (result.type === 'audio') {
        audioButtons.push({
          title: result.title, // Audio title
          description: result.description || "No description available", // Optional description
          id: `audio_${index}` // Unique ID for each audio button
        });
      }
    });

    // Prepare the messages for video and audio sections
    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `*Search Results for: ${query}*`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Select a video or audio to play."
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "Video Options",
                    sections: [
                      {
                        title: "Select a video",
                        rows: videoButtons // Video buttons
                      }
                    ]
                  })
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "Audio Options",
                    sections: [
                      {
                        title: "Select an audio",
                        rows: audioButtons // Audio buttons
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

  // Handle selected play option for videos and audios
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;

  if (selectedButtonId) {
    const [type, index] = selectedButtonId.split('_'); // Extract type and index from ID
    const results = await fetchSearchResults(args.join(' ')); // Fetch results again to get selected item
    const selectedResult = results[index]; // Get the selected result based on the index

    if (selectedResult) {
      return m.reply(`You selected: ${selectedResult.title}\nDescription: ${selectedResult.description}\nLink: ${selectedResult.url}`);
    }
  }
};

export default playCommand;
