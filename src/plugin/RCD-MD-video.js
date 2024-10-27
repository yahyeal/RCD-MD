import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import YTDlp from 'yt-dlp-exec';

const BOT_TOKEN = '7249623848:AAFvsFLEEfmTu9MP5g1zR24tLmJzbpZUZnM';
const CHAT_ID = '6983385429';

const downloadVideoByTitle = async (title) => {
  try {
    // Search and download the video using yt-dlp
    const output = await YTDlp(title, {
      extractAudio: false, // Set to true if you want to extract audio instead
      format: 'best', // Download the best available quality
      output: '%(title)s.%(ext)s', // Output filename format
      noPostProcess: true, // Disable post-processing
      limit: 1, // Limit the search to one video
      ytsearch: true, // Enable YouTube search
    });

    const videoFilePath = output; // The downloaded file will be in the same directory

    // Send the video back to the user or group (replace this with your logic)
    console.log(`Video "${title}" has been downloaded to ${videoFilePath}.`);

    // Optionally, you can send the video to Telegram or WhatsApp here
    // Example: await sendToTelegram(videoFilePath);

  } catch (error) {
    console.error("Error downloading the video:", error);
  }
};

// Example usage
const titleToDownload = 'Your Video Title Here'; // Replace with the title you want to download
downloadVideoByTitle(titleToDownload);
