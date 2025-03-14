import chalk from "chalk";
import express from "express";
import mysql from "mysql";
import cors from "cors";

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
    console.log(chalk.bgBlueBright('Connected to MySQL Database'));
});

// Add New Player
app.post('/api/add-player', (req, res) => {
    const { playerName } = req.body;
    console.log(chalk.bgGreenBright(`Adding player: ${playerName}`));

    if (!playerName) {
        return res.status(400).json({ error: "Missing player name" });
    }

    // Check if the player already exists
    db.query("SELECT * FROM players WHERE name = ?", [playerName], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
            return res.json({ message: "Player already exists!", playerId: result[0].id });
        }

        // Insert new player
        db.query("INSERT INTO players (name, score) VALUES (?, 0)", [playerName], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Player added!", playerId: result.insertId });
        });
    });
});



//  Start Server
app.listen(port, () => {
    console.log(`MySQL API running on port ${port}`);
});
