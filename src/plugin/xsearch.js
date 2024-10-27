import axios from 'axios';

const handleXvidCommand = async (m) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const [cmd, ...args] = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ') : ['', ''];

  if (cmd !== 'xvid') return;

  const query = args.join(' ');
  if (!query) {
    return m.reply('Usage: /xvid <search_query>');
  }

  try {
    const apiUrl = `https://api.giftedtech.my.id/api/search/xvideossearch?apikey=gifted&query=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.results && response.data.results.length > 0) {
      const results = response.data.results.map((item, index) => `${index + 1}. ${item.title} - ${item.url}`).join('\n');
      m.reply(`Search results for "${query}":\n\n${results}`);
    } else {
      m.reply('No results found.');
    }
  } catch (error) {
    console.error(error);
    m.reply('An error occurred while fetching search results.');
  }
};

export default handleXvidCommand;
