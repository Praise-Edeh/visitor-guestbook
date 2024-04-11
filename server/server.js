const express = require('express');
const cors = require('cors');
const sqlite = require('better-sqlite3');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite database setup
const db = new sqlite('guestbook.db');
db.exec('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, likes INTEGER DEFAULT 0)');

// Seed data
db.prepare('INSERT INTO messages (text) VALUES (?)').run('Welcome to the guestbook!');

// Routes
app.get('/api/messages', (req, res) => {
    const messages = db.prepare('SELECT * FROM messages').all();
    res.json(messages);
});

app.post('/api/messages', (req, res) => {
    const { text } = req.body;
    if (text) {
        const stmt = db.prepare('INSERT INTO messages (text) VALUES (?)');
        const result = stmt.run(text);
        res.status(201).send('Message added successfully');
    } else {
        res.status(400).send('Invalid message');
    }
});

app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    res.send('Message deleted successfully');
});

app.put('/api/messages/:id/like', (req, res) => {
    const { id } = req.params;
    const result = db.prepare('UPDATE messages SET likes = likes + 1 WHERE id = ?').run(id);
    res.send('Like added successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
