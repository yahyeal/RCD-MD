import axios from 'axios';

const handleXvidCommand = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const [cmd, ...args] = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ') : ['', ''];

  if (cmd !== 'xvid') return;

  const query = args.join(' ');
  if (!query) {
    return gss.sendMessage(m.from, { text: 'Usage: /xvid <search_query>' }, { quoted: m });
  }

  try {
    const apiUrl = `https://api.giftedtech.my.id/api/search/xvideossearch?apikey=gifted&query=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.results && response.data.results.length > 0) {
      const results = response.data.results.slice(0, 10);  // Limit to 10 results

      for (let i = 0; i < results.length; i++) {
        const item = results[i];
        
        // Format the message content
        const messageText = 
          `*${i + 1}. ${item.title || "No Title"}*\n` +
          `Duration: ${item.duration || "N/A"}\n` +
          `Quality: ${item.quality || "N/A"}\n` +
          `URL: ${item.url || "N/A"}`;

        // Send message with thumbnail if available
        if (item.thumb) {
          await gss.sendMessage(m.from, 
            { 
              image: { url: item.thumb },
              caption: messageText 
            }, 
            { quoted: m }
          );
        } else {
          await gss.sendMessage(m.from, { text: messageText }, { quoted: m });
        }
      }
    } else {
      await gss.sendMessage(m.from, { text: 'No results found.' }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await gss.sendMessage(m.from, { text: 'An error occurred while fetching search results.' }, { quoted: m });
  }
};

export default handleXvidCommand;
