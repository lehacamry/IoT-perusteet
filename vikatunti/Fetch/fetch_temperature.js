const URL = 'https://api.thingspeak.com/channels/3084084/feeds.json?api_key=UXLQYQVQJYDYCPZL&results=200';

fetch(URL)
    .then(response => response.json())
    .then(data => {
        const feeds = data.feeds;
        const temperatures = feeds.map(feed => ({
            time: feed.created_at,
            temperature: parseFloat(feed.field1),
            humidity: parseFloat(feed.field2)
        }));
        document.getElementById('output').textContent = JSON.stringify(temperatures);
    })
.catch(error => {
    console.error('Error fetching data:', error);
    document.getElementById('output').textContent = 'Error loading data';
});