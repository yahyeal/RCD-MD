import config from '../../config.cjs';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const autorecordingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'autorecording') {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    // Create interactive message with single-select buttons
    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: "*Auto-Recording Options*\nChoose an option to enable or disable Auto-Recording."
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "© RCD-MD Bot"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "Auto-Recording Options",
                    sections: [
                      {
                        title: "Select an option",
                        rows: [
                          {
                            title: "Enable Auto-Recording",
                            description: "Turn on auto-recording",
                            id: "autorecording_on"
                          },
                          {
                            title: "Disable Auto-Recording",
                            description: "Turn off auto-recording",
                            id: "autorecording_off"
                          }
                        ]
                      }
                    ]
                  })
                }
              ]
            }),
          })
        }
      }
    }, {});

    await Matrix.relayMessage(m.from, msg.message, {
      messageId: msg.key.id
    });
  }

  // Handling button responses
  const interactiveResponseMessage = m?.message?.interactiveResponseMessage;
  if (interactiveResponseMessage) {
    const paramsJson = interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;

    if (paramsJson) {
      const params = JSON.parse(paramsJson);
      const selectedId = params.id; // Get the selected button ID
      let responseMessage;

      if (selectedId === "autorecording_on") {
        config.AUTO_RECORDING = true;
        responseMessage = "Auto-Recording has been enabled.";
      } else if (selectedId === "autorecording_off") {
        config.AUTO_RECORDING = false;
        responseMessage = "Auto-Recording has been disabled.";
      }

      try {
        await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
      } catch (error) {
        console.error("Error processing your request:", error);
        await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
      }
    }
  }
};

export default autorecordingCommand;
