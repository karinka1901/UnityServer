const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '', 
    database: 'ponggame'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Fetch Player Data
app.get('/api/player/:id', (req, res) => {
    const playerId = req.params.id;
    db.query("SELECT * FROM players WHERE id = ?", [playerId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "Player not found" });
        res.json(result[0]);
    });
});

// Update Player Score
app.post('/api/update-score', (req, res) => {
    const { id, score } = req.body;
    if (!id || score === undefined) {
        return res.status(400).json({ error: "Missing player ID or score" });
    }
    
    db.query("UPDATE players SET score = ? WHERE id = ?", [score, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ Score updated!", playerId: id, newScore: score });
    });
});

// 🏅 **Fetch Leaderboard (Top 5 Players)**
app.get('/api/leaderboard', (req, res) => {
    db.query("SELECT * FROM players ORDER BY score DESC LIMIT 5", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 🚀 Start Server
app.listen(port, () => {
    console.log(`📊 MySQL API running on port ${port}`);
});
