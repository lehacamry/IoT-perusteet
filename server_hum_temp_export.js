const express = require('express');
const app = express();
const port = 3000;

const FEED = "https://api.thingspeak.com/channels/";
const CHANNEL = "3084084";
const API_KEY = "UXLQYQVQJYDYCPZL";
const NUMBER_OF_ENTRIES = 1;

app.get('/', async (req, res) => {
  try {
    const url = `${FEED}${CHANNEL}/feeds.json?api_key=${API_KEY}&results=${NUMBER_OF_ENTRIES}`;

    // встроенный fetch
    const response = await fetch(url);
    const data = await response.json();

    const feed = data.feeds?.[0];
    if (!feed) {
      return res.status(502).send('Нет данных от ThingSpeak');
    }

    const date = new Date(feed.created_at);
    const localTime = date.toLocaleString('ru-RU', { timeZone: 'Europe/Helsinki' });

    const text = `Текущая температура ${feed.field1}°C и влажность ${feed.field2}%. Последнее измерение было ${localTime}.`;
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send('Не удалось получить данные с ThingSpeak');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});