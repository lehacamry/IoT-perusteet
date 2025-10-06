google.charts.load('current', { packages: ['corechart'], language: 'fi' });
google.charts.setOnLoadCallback(loadAndDraw);

let RANGE_DAYS = 1;
let LAST_MEASUREMENT_TEXT = '';

function toggleRange() {
    RANGE_DAYS = (RANGE_DAYS === 1) ? 30 : 1;
    updateToolbarText();
    loadAndDraw();
}

function updateToolbarText() {
    const title1 = document.getElementById('chart_title_text');
    const link1 = document.getElementById('range_toggle');
    if (title1) {
        title1.textContent = (RANGE_DAYS === 1)
            ? 'Lämpötila ja kosteusdata viimeisen vuorokauden ajalta'
            : 'Lämpötila ja kosteusdata viimeisen 30 päivän ajalta';
    }
    if (link1) {
        link1.textContent = (RANGE_DAYS === 1)
            ? 'Katso tiedot 30pv ajalta →'
            : 'Katso tiedot 24h ajalta →';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('send_discord');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        const input = document.getElementById('webhook_url');
        const statusSent = document.getElementById('send_status');
        if (!input || !statusSent) return;

        const webhookUrl = (input.value || '').trim();
        if (!webhookUrl) {
            statusSent.textContent = 'Anna webhook-osoite.';
            return;
        }
        if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
            statusSent.textContent = 'Virheellinen Discord webhook -osoite.';
            return;
        }
        if (!LAST_MEASUREMENT_TEXT) {
            statusSent.textContent = 'Ei mittaustietoja lähetettäväksi.';
            return;
        }

        statusSent.textContent = 'Lähetetään...';
        try {
            const resp = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: LAST_MEASUREMENT_TEXT })
            });
            if (!resp.ok) {
                const t = await resp.text().catch(() => '');
                statusEl.textContent = `Discord virhe: ${resp.status}. ${t.slice(0, 120)}`;
            } else {
                statusEl.textContent = 'OK: Viesti lähetetty Discordiin.';
            }
        } catch (e) {
            statusEl.textContent = 'Verkkovirhe (voi olla CORS).';
            console.error(e);
        }
    });
});

function loadAndDraw() {
    updateToolbarText();

    const RESULT = (RANGE_DAYS > 1) ? 5000 : 150;
    const URL = `https://api.thingspeak.com/channels/3084084/feeds.json?api_key=UXLQYQVQJYDYCPZL&results=${RESULT}`;

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            const feeds = data.feeds;
            const temperatures = feeds.map(feed => ({
                time: feed.created_at,
                temperature: parseFloat(feed.field1),
                humidity: parseFloat(feed.field2)
            }));

            const now = new Date();
            const from = new Date(now.getTime() - RANGE_DAYS * 24 * 60 * 60 * 1000);

            let latestMeasurement = null;
            let latestTime = null;

            const dataTable = new google.visualization.DataTable();
            dataTable.addColumn('datetime', 'Kellonaika');
            dataTable.addColumn('number', 'Lämpötila');
            dataTable.addColumn('number', 'Kosteus');

            temperatures.forEach(item => {
                const date = new Date(item.time);
                if (
                    !isNaN(date.getTime()) &&
                    !isNaN(item.temperature) &&
                    !isNaN(item.humidity) &&
                    date >= from && date <= now
                ) {
                    dataTable.addRow([date, item.temperature, item.humidity]);
                    if (!latestTime || date > latestTime) {
                        latestTime = date;
                        latestMeasurement = { date, temperature: item.temperature, humidity: item.humidity };
                    }
                }
            });

            if (latestMeasurement) {
                const hh = String(latestMeasurement.date.getHours()).padStart(2, '0');
                const mm = String(latestMeasurement.date.getMinutes()).padStart(2, '0');
                const textLine =
                    `Lämpötila tällä hetkellä: ${Math.round(latestMeasurement.temperature)} °C, ` +
                    `Kosteus: ${Math.round(latestMeasurement.humidity)} % (klo ${hh}:${mm})`;
                const box = document.getElementById('temp_and_hum_now');
                if (box) box.textContent = textLine;
                LAST_MEASUREMENT_TEXT = textLine;
            } else {
                LAST_MEASUREMENT_TEXT = '';
            }

            const ticks = (RANGE_DAYS === 1)
                ? buildHourlyTicks(from, now)
                : buildDailyTicks(from, now);

            const options = {
                fontName: 'Poppins',
                width: 1500,
                height: 800,
                legend: {
                    position: 'bottom',
                    textStyle: { fontName: 'Poppins', fontSize: 16, bold: true, color: '#0f172a' }
                },
                hAxis: {
                    title: 'Kellonaika',
                    format: (RANGE_DAYS === 1) ? 'HH:mm' : 'dd.MM.',
                    ticks: ticks,
                    titleTextStyle: { fontName: 'Poppins', fontSize: 12, bold: true }
                },
                vAxis: {
                    titleTextStyle: { fontName: 'Poppins', fontSize: 12, bold: true }
                },
                chartArea: {
                    left: 50,
                    top: 10,
                    width: '85%',
                    height: '75%'
                }
            };

            const tempformat = new google.visualization.NumberFormat({ suffix: ' °C', fractionDigits: 0 });
            const humformat  = new google.visualization.NumberFormat({ suffix: ' %', fractionDigits: 0 });
            tempformat.format(dataTable, 1);
            humformat.format(dataTable, 2);

            const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(dataTable, options);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const output = document.getElementById('output');
            if (output) output.textContent = 'Error loading data';
        });
}

function buildHourlyTicks(minDate, maxDate) {
    const ticks = [];
    const d = new Date(minDate);
    d.setMinutes(0, 0, 0);
    if (d < minDate) d.setHours(d.getHours() + 1);
    while (d <= maxDate) {
        ticks.push(new Date(d));
        d.setHours(d.getHours() + 1);
    }
    return ticks;
}

function buildDailyTicks(minDate, maxDate) {
    const ticks = [];
    const d = new Date(minDate);
    d.setHours(0, 0, 0, 0);
    if (d < minDate) d.setDate(d.getDate() + 1);
    while (d <= maxDate) {
        ticks.push(new Date(d));
        d.setDate(d.getDate() + 1);
    }
    return ticks;
}
