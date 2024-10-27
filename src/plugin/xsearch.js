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
      const results = response.data.results.map((item, index) => 
        `*${index + 1}. ${item.title || "No Title"}*\n` +
        `Duration: ${item.duration || "N/A"}\n` +
        `Quality: ${item.quality || "N/A"}\n` +
        `Thumbnail: ${item.thumb || "N/A"}\n` +
        `URL: ${item.url || "N/A"}\n`
      ).join('\n\n');
      
      await gss.sendMessage(m.from, { text: `Search results for "${query}":\n\n${results}` }, { quoted: m });
    } else {
      await gss.sendMessage(m.from, { text: 'No results found.' }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await gss.sendMessage(m.from, { text: 'An error occurred while fetching search results.' }, { quoted: m });
  }
};

export default handleXvidCommand;
