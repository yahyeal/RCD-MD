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
    if (['alive', 'uptime', 'runtime'].includes(cmd)) {

  const uptimeMessage = `*RCD MD IS ACTIVE*

╭─────═━┈┈━═──━┈⊷
┇ *${days} Day*
┇ *${hours} Hour*
┇ *${minutes} Minute*
┇ *${seconds} Second*
╰─────═━┈┈━═──━┈⊷
`;

  const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "PING TEST ‼️",
          id: `${prefix}ping`
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "GET BOT REPO ❔",
          id: `${prefix}repo`
        })
      },
      {
        "name": "single_select",
        "buttonParamsJson": `{"title":"ᴛᴀᴘ ʜᴇʀᴇ",
         "sections":
           [{
            "title":"ʀ ᴄ ᴅ-ᴍᴅ ᴍᴇɴᴜ",
            "highlight_label":"ᴀʟʟ ᴍᴇɴᴜ",
            "rows":[
              {
               "header":"",
               "title":"ᴀʟʟ ᴍᴇɴᴜ",
               "description":"ʀ ᴄ ᴅ-ᴍᴅ",
               "id":"View All Menu"
              },
              {
                "header":"💓",
                "title":"ʀᴄᴅ ᴍᴅ ʙᴇꜱᴛ ᴄᴏᴍᴍᴀɴᴅ 💀",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Rcd Menu"
              },
              {
                "header":"",
                "title":"ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Downloader Menu"
              },
              {
                "header":"",
                "title":"ɢʀᴏᴜᴘ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Group Menu"
              },
              {
                "header":"",
                "title":"ᴛᴏᴏʟ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Tool Menu"
              },
              {
                "header":"",
                "title":"ᴍᴀɪɴ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Main Menu"
              },
             {
                "header":"",
                "title":"ᴛᴇᴀᴍ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Owner Menu"
              },
              {
                "header":"",
                "title":"ᴀɪ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Ai Menu"
              },
              {
                "header":"",
                "title":"ꜱᴇᴀʀᴄʜ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Search Menu"
              },
              {
                "header":"",
                "title":"ꜱᴛᴀʟᴋ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Stalk Menu"
              },
              {
                "header":"",
                "title":"ᴄᴏɴᴠᴇʀᴛᴇʀ ᴍᴇɴᴜ",
                "description":"ʀ ᴄ ᴅ-ᴍᴅ",
                "id":"Converter Menu"
              }
            ]}
          ]}`
      }
    ]; // Corrected: Added a comma here

    const imageUrl = 'https://files.catbox.moe/4z3e57.jpg';
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');

      // Prepare message media with the image buffer
      const media = await prepareWAMessageMedia({ image: imageBuffer }, { upload: Matrix.waUploadToServer });

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
                text: "© ᴘᴏᴡᴇʀᴅ ʙʏ ʀᴄᴅ-ᴍᴅ"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                ...media.imageMessage,
                title: ``,
                gifPlayback: false,
                subtitle: "",
                hasMediaAttachment: true
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              }),
              contextInfo: {
                quotedMessage: m.message,
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363286758767913@newsletter',
                  newsletterName: "RCD-MD WHATSAPP CHANNEL",
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
