import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;

  // Handle interactive message button presses
  if (m.message?.interactiveResponseMessage) {
    const selectedId = m.message.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson 
      ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id 
      : '';

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

  // If it's a text command
  if (m.body.startsWith(prefix) && m.body.slice(prefix.length).toLowerCase() === 'autoreact') {
    if (!isCreator) {
      return await Matrix.sendMessage(m.from, { text: "*📛 THIS IS AN OWNER COMMAND*" });
    }

    // Send single select interactive message
    const responseMessage = {
      interactiveMessage: {
        header: {
          title: "Auto-React Control",
          subtitle: "Choose an option to proceed:"
        },
        body: {
          text: "Select to enable or disable Auto-React:"
        },
        footer: {
          text: "Please choose an option below:"
        },
        sections: [
          {
            title: "Auto-React Options",
            rows: [
              {
                title: "Enable Auto-React",
                description: "Click to enable Auto-React",
                id: `${prefix}autoreact on` // Command ID
              },
              {
                title: "Disable Auto-React",
                description: "Click to disable Auto-React",
                id: `${prefix}autoreact off` // Command ID
              }
            ]
          }
        ]
      }
    };

    await Matrix.sendMessage(m.from, responseMessage);
  }
};

export default autoreadCommand;
