const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
require('dotenv').config();

console.log('Bot is running with API v2');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const rwClient = client.readWrite; // Required to send tweets

const order = 4; // length of each n-gram
let nGrams = {};

function pickRandomStart(lyrics) {
  const random = Math.floor(Math.random() * lyrics.length);
  return lyrics.substring(random, random + order);
}

function makeEngramModel(lyrics) {
  for (let i = 0; i < lyrics.length - order; i++) {
    const gram = lyrics.substring(i, i + order);

    if (!nGrams[gram]) {
      nGrams[gram] = [];
    }
    nGrams[gram].push(lyrics.charAt(i + order));
  }
}

function generateTweet(lyrics) {
  makeEngramModel(lyrics);
  let currentGram = pickRandomStart(lyrics);

  while (!currentGram.match(/^[0-9a-zA-Z]+$/)) {
    currentGram = pickRandomStart(lyrics);
  }

  let tweet = currentGram;

  for (
    let j = 0;
    (j < 150) || tweet.charAt(j).match(/^[0-9a-zA-Z]+$/);
    j++
  ) {
    const possibilities = nGrams[currentGram];
    const next = possibilities[Math.floor(Math.random() * possibilities.length)];
    tweet += next;
    const len = tweet.length;
    currentGram = tweet.substring(len - order, len);
  }

  return tweet;
}

async function postTweet() {
  try {
    const lyrics = fs.readFileSync('lyrics.txt', 'utf8');
    const tweet = generateTweet(lyrics);
    console.log('Generated tweet:\n', tweet);

    await rwClient.v2.tweet(tweet);
    console.log('✅ Tweet posted!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

postTweet();