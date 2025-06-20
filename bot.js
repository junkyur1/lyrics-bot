const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
require('dotenv').config();

// Initialize Twitter client with your secrets
const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function tweetRandomLyric() {
  try {
    // Read and split lyrics file by lines
    const lyrics = fs.readFileSync('lyrics.txt', 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length <= 280); // Max tweet length

    // Pick one random line
    const randomLyric = lyrics[Math.floor(Math.random() * lyrics.length)];
    console.log('Tweeting:', randomLyric);

    // Post it to Twitter
    await client.v2.tweet(randomLyric);
    console.log('✅ Tweet posted!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

tweetRandomLyric();