import moment from 'moment-timezone';
import fs from 'fs';
import os from 'os';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
const ownerNumber = '94753574803@s.whatsapp.net';
import config from '../../config.cjs';

// Other existing code...

const test = async (m, Matrix) => {
  let selectedListId;
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;
  const interactiveResponseMessage = m?.message?.interactiveResponseMessage;
  if (interactiveResponseMessage) {
    const paramsJson = interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;
    if (paramsJson) {
      const params = JSON.parse(paramsJson);
      selectedListId = params.id;
    }
  }
  const selectedId = selectedListId || selectedButtonId;

  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const mode = config.MODE === 'public' ? 'public' : 'private';
  const pref = config.PREFIX;

  const validCommands = ['setting', 'owner'];

  if (validCommands.includes(cmd)) {
    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `╭─────────────━┈⊷
│🤖 ʙᴏᴛ ɴᴀᴍᴇ: *ʀᴄᴅ-ᴍᴅ*
│📍 ᴠᴇʀꜱɪᴏɴ: 2.1.0
│👨‍💻 ᴏᴡɴᴇʀ : *ʀᴄᴅ ᴛᴇᴀᴍ*      
│👤 ɴᴜᴍʙᴇʀ: ${ownerNumber}
│📡 ᴘʟᴀᴛғᴏʀᴍ: *${os.platform()}*
│🛡 ᴍᴏᴅᴇ: *${mode}*
│💫 ᴘʀᴇғɪx: [${pref}]
╰─────────────━┈⊷ `
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴄᴅ-ᴍᴅ"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({ video: fs.readFileSync('./cloud/RCD-APK.mp4') }, { upload: Matrix.waUploadToServer })),
              title: '',
              gifPlayback: true,
              subtitle: "𝗗𝗘𝗫𝗧𝗘𝗥 𝗜𝗗 🔎",
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "ALIVE ?",
                    id: `${prefix}alive`
                  })
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "BOT INFO ❔",
                    id: `BOT INFO`
                  })
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "MENU LIST ❔",
                    id: `${prefix}menu`
                  })
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "ᴛᴀᴘ ʜᴇʀᴇ ᴅᴏᴡɴʟᴏᴀᴅ ᴀᴘᴋ",
                    sections: [
                      {
                        title: "ᴅᴇxᴛᴇʀ ᴍᴏᴅᴢ ᴀɴᴅ ᴀᴘᴋ ʟɪꜱᴛ",
                        highlight_label: "ᴘᴏᴡᴇʀ ꜰᴜʟʟ ᴀᴘᴋ 🌝",
                        rows: [
                          {
                            header: "ᴠɪᴘ ᴀᴘᴋ ✇",
                            title: "ᴡʜᴀᴛꜱᴀᴘᴘ ʟɪɴᴋ ᴅᴇᴠɪᴄᴇ ꜱᴘᴀᴍ ᴀᴘᴋ",
                            description: "ᴅᴏᴡɴʟᴏᴀᴅ ᴀɴᴅ ꜱᴇɴᴅ ɴᴏᴛɪғɪᴄᴀᴛɪᴏɴ ᴀʟᴇʀᴛ",
                            id: "`${prefix}autoreact on"
                          },
                          {
                            header: "ᴠɪᴘ ✇",
                            title: "ꜱᴀᴠᴇ ᴀᴘᴋ",
                            description: "ᴡʜᴀᴛꜱᴀᴘᴘ ɴᴜᴍʙᴇʀ ᴀᴜᴛᴏ ꜱᴀᴠᴇ ᴀᴘᴋ",
                            id: "`${prefix}autoreact off"
                          }
                        ]
                      }
                    ]
                  })
                }
              ]
            }),
            contextInfo: {
              mentionedJid: [ownerNumber],
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363286758767913@newsletter',
                newsletterName: "RCD-MD WHATSAPP CHANNEL",
                serverMessageId: 143
              }
            }
          })
        }
      }
    }, {});

    await Matrix.relayMessage(m.from, msg.message, {
      messageId: msg.key.id
    });
  }

  if (selectedId) {
      switch (selectedId) {
        case `${prefix}autoreact on`:
          if (!isCreator) {
            await Matrix.sendMessage(m.from, { text: "*📛 THIS IS AN OWNER COMMAND*" });
            return;
          }
          config.AUTO_REACT = true;
          await Matrix.sendMessage(m.from, { text: "AUTO_REACT has been enabled." });
          return;

        case `${prefix}autoreact off`:
          if (!isCreator) {
            await Matrix.sendMessage(m.from, { text: "*📛 THIS IS AN OWNER COMMAND*" });
            return;
          }
          config.AUTO_REACT = false;
          await Matrix.sendMessage(m.from, { text: "AUTO_REACT has been disabled." });
          return;

        default:
          await Matrix.sendMessage(m.from, { text: "Unknown command!" });
          return;
      }
    }
  }

export default test;
