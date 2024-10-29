import moment from 'moment-timezone';
import fs from 'fs';
import pkg from '@whiskeysockets/baileys';
import axios from 'axios';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const OWNER_NUMBERS_URL = 'https://github.com/rcd-git-hub-official/CLOUD-/raw/refs/heads/main/owner-number.json';

// Function to fetch owner numbers from GitHub
async function fetchOwnerNumbers() {
  try {
    const response = await axios.get(OWNER_NUMBERS_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching owner numbers:", error);
    return [];
  }
}

// Function to wait for a specified duration (in milliseconds)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const spamCommand = async (m, Matrix) => {
  const ownerNumbers = await fetchOwnerNumbers();
  const senderNumber = m.key.remoteJid.replace('@s.whatsapp.net', '');

  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.trim().split(' ').slice(1); // Get the command arguments
  const number = args[0]; // First argument should be the WhatsApp number

  // Check if the command is "spam"
  if (cmd === 'spam') {
    // Check if sender is in the owner numbers list
    if (!ownerNumbers.includes(senderNumber)) {
      return m.reply("You are not authorized to use this command.");
    }

    // Check if a number is provided
    if (!number) {
      return m.reply("Please provide a WhatsApp number to spam.");
    }

    // Prepare the spam options message
    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `*Spam Options*
Choose an option to spam the number ${number} with messages.`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "© RCD-MD Bot"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "Spam Options",
                    sections: [
                      {
                        title: "Select an option",
                        rows: [
                          {
                            title: "SPAM 1 (Send 'Hi' 10 times)",
                            description: "Send 'Hi' message 10 times",
                            id: "spam_1"
                          },
                          {
                            title: "SPAM 2 (Send 'Bye' 10 times)",
                            description: "Send 'Bye' message 10 times",
                            id: "spam_2"
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

    // Send the options message to the user
    await Matrix.relayMessage(m.from, msg.message, {
      messageId: msg.key.id
    });

    // Now listen for the user's selection
    const selectedListId = m?.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson;
    if (selectedListId) {
      const params = JSON.parse(selectedListId);
      const selectedId = params.id;

      // Log selectedId for debugging purposes
      console.log("Selected ID:", selectedId);

      // Automatically send the respective messages based on the selected option
      if (selectedId === "spam_1") {
        for (let i = 0; i < 10; i++) {
          await Matrix.sendMessage(`${number}@s.whatsapp.net`, { text: "Hi" });
          await delay(1000); // Wait for 1 second between messages
        }
        return m.reply(`Sent "Hi" 10 times to ${number}`);
      }

      if (selectedId === "spam_2") {
        for (let i = 0; i < 10; i++) {
          await Matrix.sendMessage(`${number}@s.whatsapp.net`, { text: "Bye" });
          await delay(1000); // Wait for 1 second between messages
        }
        return m.reply(`Sent "Bye" 10 times to ${number}`);
      }
    } else {
      return m.reply("Please select a spam option to proceed.");
    }
  }
};

export default spamCommand;
