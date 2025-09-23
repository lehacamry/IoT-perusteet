const express = require('express');
const app = express();
const port = 3000;

const FEED = "https://api.thingspeak.com/channels/";
const CHANNEL = "xxxx"; // Replace with your ThingSpeak channel ID
const API_KEY = "xxxxxx";   // Replace with your ThingSpeak read API key
const NUMBER_OF_ENTRIES = 1;

app.get('/', async (req, res) => {
  try {
    const url = `${FEED}${CHANNEL}/feeds.json?api_key=${API_KEY}&results=${NUMBER_OF_ENTRIES}`;

    // встроенный fetch
    const response = await fetch(url);
    const data = await response.json();

    const feed = data.feeds?.[0];
    if (!feed) {
      return res.status(502).send('No data from ThingSpeak');
    }

    const date = new Date(feed.created_at);
    const localTime = date.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' });

    const text = `Current temperature is ${feed.field1}°C and humidity is ${feed.field2}%. Last measurement was at ${localTime}.`;
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to retrieve data from ThingSpeak');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});