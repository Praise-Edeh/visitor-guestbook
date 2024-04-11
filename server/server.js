const express = require('express');
const sqlite3 = require('better-sqlite3');

const app = express();
const port = 3000;

const db = sqlite3('guestbook.db');

// Create table if not exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY,
        text TEXT
    )
`).run();

// Middleware to parse JSON request bodies
app.use(express.json());

// API route to get all messages
app.get('/api/messages', (req, res) => {
    const messages = db.prepare('SELECT * FROM messages').all();
    res.json(messages);
});

// API route to add a new message
app.post('/api/messages', (req, res) => {
    const { text } = req.body;
    if (text) {
        const insert = db.prepare('INSERT INTO messages (text) VALUES (?)');
        insert.run(text);
        res.sendStatus(201);
    } else {
        res.status(400).send('Invalid message');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
