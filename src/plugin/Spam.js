import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
import axios from 'axios'; // Ensure you have axios installed
const { generateWAMessageFromContent, proto } = pkg;

// Define the GitHub raw URLs for the messages
const githubUrls = [
  'https://github.com/rcd-git-hub-official/BACKE/raw/refs/heads/main/id.txt', // Replace with your actual GitHub raw URL for message 1
  'https://raw.githubusercontent.com/user/repo/main/message2.txt', // Replace with your actual GitHub raw URL for message 2
  'https://raw.githubusercontent.com/user/repo/main/message3.txt', // Replace with your actual GitHub raw URL for message 3
  'https://raw.githubusercontent.com/user/repo/main/message4.txt', // Replace with your actual GitHub raw URL for message 4
  'https://raw.githubusercontent.com/user/repo/main/message5.txt', // Replace with your actual GitHub raw URL for message 5
];

const alive = async (m, Matrix) => {
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

  // Handle the spam command
  const spamMatch = cmd.match(/^spam_5(\d+)$/); // Match spam_5<number>
  if (spamMatch) {
    const number = spamMatch[1]; // Extract the number after spam_5

    // Ensure the number is valid and format it correctly
    const formattedNumber = number.startsWith("+") ? number : `+${number}`;

    // Loop to send messages from the GitHub raw URLs
    try {
      for (let i = 0; i < githubUrls.length; i++) {
        // Fetch the message content from the current GitHub raw URL
        const response = await axios.get(githubUrls[i]);
        const messageToSend = response.data; // Get the text content

        // Create the message
        const msg = generateWAMessageFromContent(formattedNumber, {
          text: messageToSend, // Use the fetched message
        });

        // Send the message
        await Matrix.relayMessage(formattedNumber, msg.message, {
          messageId: msg.key.id
        });

        // Add a delay between messages (optional)
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }

      // Optionally, send a confirmation message to the sender
      await Matrix.sendMessage(m.from, {
        text: `Sent 5 messages to ${formattedNumber}.`,
      });
    } catch (error) {
      console.error('Error fetching GitHub raw URL:', error);
      await Matrix.sendMessage(m.from, {
        text: 'Failed to fetch message from GitHub. Please check the URL.',
      });
    }
  }
};

export default alive;
