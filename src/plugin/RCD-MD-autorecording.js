import { create, Client } from '@whiskeysockets/baileys';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const startBot = async () => {
    const client = create();

    client.on('ready', () => {
        console.log('Bot is ready!');
    });

    client.on('message-new', async (msg) => {
        const from = msg.key.remoteJid;
        const text = msg.message?.conversation;

        // Command to upload an image from a URL as a status
        if (text && text.startsWith('statusid')) {
            const args = text.split(' ').slice(1);
            const imageUrl = args[0]; // First argument should be the image URL

            if (!imageUrl) {
                return client.sendMessage(from, { text: 'Please provide an image URL.' });
            }

            try {
                // Fetch the image from the URL
                const response = await axios({
                    method: 'get',
                    url: imageUrl,
                    responseType: 'arraybuffer', // Ensure the response is treated as a buffer
                });

                // Create a temporary file to hold the image
                const imageBuffer = Buffer.from(response.data);
                const tempFilePath = path.join(__dirname, 'temp_image.jpg');
                fs.writeFileSync(tempFilePath, imageBuffer); // Write the image buffer to a file

                // Upload the image as status
                await client.sendMessage('status@broadcast', {
                    image: { url: tempFilePath }, // Use the temporary file for sending
                    caption: 'New Status Update!', // Optional caption
                });

                // Cleanup: Delete the temporary file
                fs.unlinkSync(tempFilePath);

                return client.sendMessage(from, { text: 'Status updated with the image!' });
            } catch (error) {
                console.error('Error uploading status:', error);
                return client.sendMessage(from, { text: 'Failed to update status. Please ensure the URL is valid.' });
            }
        }
    });

    await client.connect();
};

startBot();
