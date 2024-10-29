import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
import Jimp from 'jimp';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const timeString = `${String(days).padStart(2, '0')}-${String(hours).padStart(2, '0')}-${String(minutes).padStart(2, '0')}-${String(seconds).padStart(2, '0')}`;
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (['alive', 'uptime', 'runtime'].includes(cmd)) {
    const width = 800;
    const height = 500;
    const image = new Jimp(width, height, 'white');

    // Load the font for the uptime text
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_RED);
    const textMetrics = Jimp.measureText(font, timeString);
    const textHeight = Jimp.measureTextHeight(font, timeString, width);
    const x = (width / 2) - (textMetrics / 2);
    const y = (height / 2) - (textHeight / 2);

    // Print the uptime text in the center
    image.print(font, x, y, timeString, width, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

    // Load a smaller font for the watermark
    const watermarkFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const watermarkText = "RCD MD";
    const watermarkWidth = Jimp.measureText(watermarkFont, watermarkText);
    const watermarkHeight = Jimp.measureTextHeight(watermarkFont, watermarkText, width);

    // Position the watermark at the bottom right with some padding
    const padding = 10;
    const watermarkX = width - watermarkWidth - padding;
    const watermarkY = height - watermarkHeight - padding;

    // Print the watermark on the image
    image.print(watermarkFont, watermarkX, watermarkY, watermarkText);

    // Convert the image to a buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

    const uptimeMessage = `*🤖 RCD-MD Status Overview*
_________________________________________

*📆 ${days} Day(s)*
*🕰️ ${hours} Hour(s)*
*⏳ ${minutes} Minute(s)*
*⏲️ ${seconds} Second(s)*
_________________________________________
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
              text: "© ᴘᴏᴡᴇʀᴅ ʙʏ ʀᴄᴅ-ᴍᴅ"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({ image: buffer }, { upload: Matrix.waUploadToServer })),
              title: ``,
              gifPlayback: false,
              subtitle: "",
              hasMediaAttachment: false
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
