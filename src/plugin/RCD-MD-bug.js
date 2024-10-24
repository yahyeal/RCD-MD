import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';
  
  // Check if the command is 'bug' and includes a number
  const commandMatch = cmd.match(/^bug (\d+)$/);
  if (commandMatch) {
    const number = commandMatch[1]; // Extract the number after 'bug'
    
    const uptimeMessage = `hey ${m.pushName} ${pushwish}
╭─────────────━┈⊷
│🤖 ʙᴏᴛ ɴᴀᴍᴇ: *RCD-MD*
│📍 ᴠᴇʀꜱɪᴏɴ: 3.0.2
│👨‍💻 ᴛᴇᴀᴍ : *RCD TEAM*      
│👤 ɴᴜᴍʙᴇʀ: ${number}  // Use the provided number
│💻 ᴅᴇᴠɪᴄᴇ: *${os.platform()}*
│💫 ᴘʀᴇғɪx: *[Multi-Prefix]*
╰─────────────━┈⊷
╭─────━┈⊷
│    *❗ BUG LIST ❗*
╰─────━┈⊷
1. 🐞 *ʀᴄᴅ ᴇᴍᴏᴊɪ ʙᴜɢ* 
2. 🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 1*
3. 🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 2*
4. 🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 3*
5. 🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 4*
╭─────────────━┈⊷
│         *Bug report*
╰─────────────━┈⊷
✨ *This is a bug report of 5 items.* ✨`;

    // Update the button ID to include the number dynamically
    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 1*",
          id: `${prefix}spam_1${number}`  // Include the number in the button command
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 2*",
          id: `${prefix}spam_2${number}`  // Include the number in the button command
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 3*",
          id: `${prefix}spam_3${number}`  // Include the number in the button command
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 4*",
          id: `${prefix}spam_4${number}`  // Include the number in the button command
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "🐞 *ʀᴄᴅ ᴍᴅ ʙᴜɢ 5*",
          id: `${prefix}spam_5${number}`
        })
      }
    ];

    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: uptimeMessage
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "RCD MD"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: "",
              gifPlayback: true,
              subtitle: "",
              hasMediaAttachment: false 
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons
            }),
            contextInfo: {
              mentionedJid: [m.sender], 
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '254710772666',
                newsletterName: "RCD MD",
                serverMessageId: 143
              }
            }
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
};

export default alive;
