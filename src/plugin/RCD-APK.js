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

  const validCommands = ['apk', 'dexter-modz', 'owner'];

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
              ...(await prepareWAMessageMedia({ video: fs.readFileSync('./src/RCD-APK.mp4') }, { upload: Matrix.waUploadToServer })),
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
                        highlight_label: "ᴀʟʟ ᴍᴇɴᴜ",
                        rows: [
                          {
                            header: "𝗗𝗘𝗫𝗧𝗘𝗥 𝗜𝗗 🔎",
                            title: "ᴡʜᴀᴛꜱᴀᴘᴘ ʟɪɴᴋ ᴅᴇᴠɪᴄᴇ ꜱᴘᴀᴍ ᴀᴘᴋ",
                            description: "ᴅᴏᴡɴʟᴏᴀᴅ ᴀɴᴅ ꜱᴇɴᴅ ɴᴏᴛɪғɪᴄᴀᴛɪᴏɴ ᴀʟᴇʀᴛ",
                            id: "Apk 1"
                          },
                          {
                            header: "𝗗𝗘𝗫𝗧𝗘𝗥 𝗜𝗗 🔎",
                            title: "𝐒𝐀𝐕𝐄 𝐈𝐃",
                            description: "ᴡʜᴀᴛꜱᴀᴘᴘ ɴᴜᴍʙᴇʀ ᴀᴜᴛᴏ ꜱᴀᴠᴇ ᴀᴘᴋ",
                            id: "Apk 2"
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

  if (selectedId === "Apk 1") {
    const imageUrl = 'https://files.catbox.moe/yqn6hf.jpg'; // Add your image URL here
    const fileBuffer = fs.readFileSync('./src/spam.apk'); // Path to the file to send (e.g., PDF)
    
    const caption = `*Hey ${m.pushName}* 
        
*𝗗𝗘𝗫𝗧𝗘𝗥 ┃ MODZ LINK DEVICE SPAM APK* ♨

[Download APK](https://rb.gy/v1yd7v) - *Enjoy!*

[Watch Tutorial](https://youtu.be/uswlmvJkv9A?si=aFJVpKApQB5wx4Lp) 📽️

*DEXTER MODZ ANDROID APK*
`.trim();

    await Matrix.sendMessage(m.from, { image: { url: imageUrl }, caption: caption });
    await Matrix.sendMessage(m.from, { document: fileBuffer, mimetype: 'application/apk', fileName: 'Dexter-Modz-Spam.Apk' });
  }

  if (selectedId === "Apk 2") {
    const imageUrl = 'https://files.catbox.moe/grrtxl.jpg'; // Add your image URL here
    const fileBuffer = fs.readFileSync('./src/saver.apk'); // Path to the file to send (e.g., PDF)

    const caption = `*Hey ${m.pushName}* 
        
*𝗗𝗘𝗫𝗧𝗘𝗥 ┃ WHATSAPP NUMBER AUTO SAVE APK* ♨

[Download APK](https://rb.gy/h0vixu) - *Enjoy!*

[Watch Tutorial](https://youtu.be/uswlmvJkv9A?si=aFJVpKApQB5wx4Lp) 📽️

*DEXTER MODZ ANDROID APK*
`.trim();

    await Matrix.sendMessage(m.from, { image: { url: imageUrl }, caption: caption });
    await Matrix.sendMessage(m.from, { document: fileBuffer, mimetype: 'application/apk', fileName: 'Dexter-Modz-AutoSave.apk' });
  }
};

export default test;
