const express = require('express');
const cors = require('cors');
const sqlite = require('better-sqlite3');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Create database connection
const db = new sqlite('./guestbook.db');
db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT
    )
`).run();

// API POST route to accept message input
app.post('/api/messages', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    const stmt = db.prepare('INSERT INTO messages (message) VALUES (?)');
    const result = stmt.run(message);
    res.status(201).json({ id: result.lastInsertRowid, message });
});

// API GET route to retrieve all messages
app.get('/api/messages', (req, res) => {
    const messages = db.prepare('SELECT * FROM messages').all();
    res.json(messages);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
