import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent } = pkg;

const alive = async (m, Matrix, config, os) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

  if (['menu', 'list'].includes(cmd)) {
    const uptimeMessage = `*⧣₊˚﹒✦₊  ⧣₊˚  𓂃★    ⸝⸝ ⧣₊˚﹒✦₊  ⧣₊˚*
    */)    /)*
  *(｡•ㅅ•｡)* *₎₎ RCD MD SYSTEM ✦*
 *╭∪─∪────────── ✦*
 *┊ ⨳゛MODE :* *{ ${config.MODE} }*
 *┊ ◟ヾ PREFIX :* *[ ${config.prefix} ]*
 *┊﹒𐐪 PLATFORM :* *${os.platform()}*
 *┊ ◟﹫ VERSION :* *3.0.1*
 *┊ ◟⏳ UPTIME :* *${days}d ${hours}h ${minutes}m ${seconds}s*
 *╰─────────────  ✦*
*⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘*
*─────────୨ৎ─────────*
      *「 ✦ RCD MD MENU ✦ 」*
*─────────୨ৎ─────────*
𖤓 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ᴛʜᴇ ɴᴜᴍʙᴇʀ* 𖤓

➢ *1 DOWNLOAD MENU LIST*

➢ *2 OWNER MENU LIST* 

➢ *3 SEARCH MENU LIST*

➢ *4 NEWS MENU LIST* 

➢ *5 GROUP MENU LIST*

➢ *6 LOGO MENU LIST*

➢ *7 RCD MD ONLY MENU*

*╭────── · · ୨୧ · · ──────╮*
 *➽─────RCD-MD-V3───❥*
*╰────── · · ୨୧ · · ──────╯*`;

    const messageContent = {
      image: { url: 'https://i.ibb.co/LdrQkWp/IMG-20241108-WA0058.jpg' },
      caption: uptimeMessage,
    };

    const sentMessage = await Matrix.sendMessage(m.from, messageContent, { quoted: m });

    // Handle user replies
    Matrix.ev.on('messages.upsert', async ({ messages }) => {
      const replyMessage = messages[0];
      if (!replyMessage?.message?.conversation) return;

      const replyTo = replyMessage?.message?.extendedTextMessage?.contextInfo?.stanzaId;

      if (replyTo && replyTo === sentMessage.key.id) {
        const replyText = replyMessage.message.conversation.trim();
        let responseText;
        let imageUrl;

        if (replyText === '1') {
          responseText = `*Download Menu:*\n\n- ${prefix}xvideo\n- ${prefix}Facebook\n- ${prefix}Mediafire\n- ${prefix}Pinterestdl\n- ${prefix}Gitclone\n- ${prefix}Gdrive\n- ${prefix}Insta\n- ${prefix}Song\n- ${prefix}Tiktok`;
          imageUrl = 'https://telegra.ph/file/2d9a21c403a79096b88c1.jpg';
        } else if (replyText === '2') {
          responseText = `*Owner Menu:*\n\n- ${prefix}addowner\n- ${prefix}removeowner\n- ${prefix}listowners`;
          imageUrl = 'https://telegra.ph/file/2d9a21c403a79096b88c1.jpg';
        } else {
          return; // Invalid response, ignore
        }

        await Matrix.sendMessage(
          m.from,
          { image: { url: imageUrl }, caption: responseText },
          { quoted: replyMessage }
        );
      }
    });
  }
};

export default alive;
