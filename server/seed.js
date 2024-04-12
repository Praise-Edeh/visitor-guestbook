import sqlite from 'better-sqlite3';

// SQLite database setup
const db = new sqlite('guestbook.db');
db.exec('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, likes INTEGER DEFAULT 0)');

// Seed data
db.prepare('INSERT INTO messages (text) VALUES (?)').run('Welcome to the guestbook!');
