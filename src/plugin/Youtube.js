import fs from 'fs/promises';
import config from '../../config.cjs';
import ytSearch from 'yt-search'; // For searching YouTube videos
import { apiDylux } from 'api-dylux'; // For downloading videos and audio

const mediaCommand = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const [cmd, ...args] = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ') : ['', ''];

  if (cmd === 'play') {
    const title = args.join(' ');
    if (!title) {
      await m.reply('Usage: /play <YouTube video title>');
      return;
    }

    try {
      // Search for the video
      const { videos } = await ytSearch(title);
      const video = videos[0];

      if (!video) {
        await m.reply('No video found with that title.');
        return;
      }

      const videoUrl = video.url;

      // Download audio using api-dylux
      const audioFilePath = `./${video.title}.mp3`;
      const audioBuffer = await apiDylux.audio(videoUrl);

      await fs.writeFile(audioFilePath, audioBuffer);
      await gss.sendAudio(m.from, audioFilePath, { quoted: m });

    } catch (error) {
      console.error('Error fetching search results or downloading audio:', error);
      await m.reply('Failed to retrieve video information or download audio.');
    }
    return;
  }

  if (cmd === 'video') {
    const title = args.join(' ');
    if (!title) {
      await m.reply('Usage: /video <YouTube video title>');
      return;
    }

    try {
      // Search for the video
      const { videos } = await ytSearch(title);
      const video = videos[0];

      if (!video) {
        await m.reply('No video found with that title.');
        return;
      }

      const videoUrl = video.url;

      // Download video using api-dylux
      const videoFilePath = `./${video.title}.mp4`;
      const videoBuffer = await apiDylux.video(videoUrl);

      await fs.writeFile(videoFilePath, videoBuffer);
      await gss.sendVideo(m.from, videoFilePath, { quoted: m });

    } catch (error) {
      console.error('Error fetching search results or downloading video:', error);
      await m.reply('Failed to retrieve video information or download video.');
    }
    return;
  }

  await m.reply(`Unknown command: ${cmd}. Use /play or /video.`);
};

export default mediaCommand;
