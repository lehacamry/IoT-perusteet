const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const port = 3000;

app.use(express.json());

// DB_HOST = 'localhost';
// DB_USER = 'user';
// DB_PASSWORD = 'password';
const DB_NAME = 'Oma_DB.db';

const db = new sqlite3.Database(DB_NAME, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users
    (id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
    )`);


// Get endpoint
app.get('/api/sensor', (req, res) => {
    res.json({
        temperature: 22.5,
        humidity: 55,
        status: "OK"
    });
});

app.get('/api/users', (req, res) => {
    console.log("In get endpoint");
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    })
});


app.post('/api/users', (req, res) => {
    console.log("In post endpoint");
    const { name, email } = req.body;
    db.run('INSERT INTO users(name, email) VALUES(?, ?)', [name, email], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, email });
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});