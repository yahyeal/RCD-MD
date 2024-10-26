import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios';

const searchRepo = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['repo', 'sc', 'script'];

  if (validCommands.includes(cmd)) {
    const repoUrl = `https://github.com/RCD-GITHUB-REAL/GG-DEXTER`;
    
    await handleRepoCommand(m, Matrix, repoUrl);
  }
};

const handleRepoCommand = async (m, Matrix, repoUrl) => {
  try {
    const response = await axios.get(repoUrl);
    const repoData = response.data;

    const {
      full_name,
      name,
      forks_count,
      stargazers_count,
      created_at,
      updated_at,
      owner,
    } = repoData;

    const messageText = `*_Repository Information:_*\n
*_Name:_* *RCD MD*
*_Stars:_* ${stargazers_count}
*_Forks:_* ${forks_count}
*_Created At:_* ${new Date(created_at).toLocaleDateString()}
*_Last Updated:_* ${new Date(updated_at).toLocaleDateString()}
*_Owner:_* *RCD,TEAM*
    `;

    const repoMessage = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: messageText,
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴄᴅ-ᴍᴅ',
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({
                image: {
                  url: 'https://i.ibb.co/vwnzDBm/20241018-150421.jpg',
                },
              }, { upload: Matrix.waUploadToServer })),
              title: '',
              gifPlayback: true,
              subtitle: '',
              hasMediaAttachment: false,
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                 {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'CONTACT REAL DEXTER ❯',
                    url: 'https://wa.me/+94753574803?text=*ʜɪ+ʀᴄᴅ+ᴍᴅ+ᴛᴇᴀᴍ+ᴀᴅᴍɪɴ+ᴅᴇxᴛᴇʀ+❯*',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'CONTACT REAL RAVIYA ❯',
                    url: 'https://wa.me/+94757660788?text=*ʜɪ+ʀᴄᴅ+ᴍᴅ+ᴛᴇᴀᴍ+ᴀᴅᴍɪɴ+RAVI+❯*',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'CONTACT CYBER DEXTER ❯',
                    url: 'https://wa.me/+94785274495?text=*ʜɪ+ʀᴄᴅ+ᴍᴅ+ᴛᴇᴀᴍ+ᴀᴅᴍɪɴ+CYBER+ᴅᴇxᴛᴇʀ+❯*',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'CLICK HERE TO FORK RCD',
                    url: 'https://github.com/RCD-MD-MAIN/RCD-MD-V/fork',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'JOIN WHATSAPP CHANNEL',
                    url: 'https://whatsapp.com/channel/0029Vag1WQFJf05dF0pQeU3u',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'YOUTUBE WATCH TUTORIAL',
                    url: 'https://www.youtube.com/@Dextertoola999',
                  }),
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
                },
              ],
            }),
            contextInfo: {
                  mentionedJid: [m.sender], 
                  forwardingScore: 999,
                  isForwarded: false,
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

    await Matrix.relayMessage(repoMessage.key.remoteJid, repoMessage.message, {
      messageId: repoMessage.key.id,
    });
    await m.React('✅');
  } catch (error) {
    console.error('Error processing your request:', error);
    m.reply('*යම් කිසි දෙශයක් සිදු විය නැවත try කරන්න* 🙂.');
    await m.React('❌');
  }
};

export default searchRepo;
