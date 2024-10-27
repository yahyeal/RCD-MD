import axios from 'axios';

const searchResultsCache = {}; // Temporary storage for search results

const handleXvidCommand = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const [cmd, ...args] = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ') : ['', ''];

  // Handle the /xvid command for search
  if (cmd === 'xvid') {
    const query = args.join(' ');
    if (!query) {
      return gss.sendMessage(m.from, { text: 'Usage: /xvid <search_query>' }, { quoted: m });
    }

    try {
      const apiUrl = `https://api.giftedtech.my.id/api/search/xvideossearch?apikey=gifted&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.results && response.data.results.length > 0) {
        const results = response.data.results.slice(0, 10);

        searchResultsCache[m.from] = results.map(item => item.url); // Cache URLs for download reference

        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          const messageText = 
            `*${i + 1}. ${item.title || "No Title"}*\n` +
            `Duration: ${item.duration || "N/A"}\n` +
            `Quality: ${item.quality || "N/A"}\n` +
            `URL: ${item.url || "N/A"}\n\n` +
            `Reply "download" to download this video.`;

          // Send the message with thumbnail if available
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
  }

  // Handle "download" reply
  else if (m.body.toLowerCase() === 'download' && m.quoted) {
    const quotedIndexMatch = m.quoted.text.match(/^\*(\d+)\./); // Extract index from quoted message
    if (quotedIndexMatch) {
      const index = parseInt(quotedIndexMatch[1], 10) - 1;
      const url = searchResultsCache[m.from] && searchResultsCache[m.from][index];

      if (url) {
        try {
          // Use the provided API to get the download link
          const downloadApiUrl = `https://api.giftedtech.my.id/api/download/xvideosdl?apikey=gifted&url=${encodeURIComponent(url)}`;
          const downloadResponse = await axios.get(downloadApiUrl);

          if (downloadResponse.data && downloadResponse.data.url_dl) {
            const videoUrl = downloadResponse.data.url_dl;
            
            // Send the video using the download link
            await gss.sendMessage(m.from, 
              { 
                video: { url: videoUrl },
                caption: "Here is your downloaded video." 
              }, 
              { quoted: m }
            );
          } else {
            await gss.sendMessage(m.from, { text: 'Failed to retrieve the download link.' }, { quoted: m });
          }
        } catch (error) {
          console.error(error);
          await gss.sendMessage(m.from, { text: 'Failed to download the video.' }, { quoted: m });
        }
      } else {
        await gss.sendMessage(m.from, { text: 'Could not find the video URL.' }, { quoted: m });
      }
    } else {
      await gss.sendMessage(m.from, { text: 'Please reply to a specific search result to download it.' }, { quoted: m });
    }
  }
};

export default handleXvidCommand;
