const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function tweetRandomLyric() {
  try {
    // Read lyrics and filter clean lines
    const lyrics = fs.readFileSync('lyrics.txt', 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length <= 280); // Must fit in a tweet

    // Choose one random line
    const randomLyric = lyrics[Math.floor(Math.random() * lyrics.length)];
    console.log('🎵 Tweeting:', randomLyric);

    // Post the tweet
    await client.v2.tweet(randomLyric);
    console.log('✅ Tweet posted!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

tweetRandomLyric();
