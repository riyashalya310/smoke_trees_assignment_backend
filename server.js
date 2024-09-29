const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Route to add user and address
app.post('/register', (req, res) => {
  const { name, address } = req.body;

  // Insert into User table
  const userQuery = 'INSERT INTO User (name) VALUES (?)';
  db.query(userQuery, [name], (err, userResult) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add user' });
    }
    
    // Insert into Address table
    const addressQuery = 'INSERT INTO Address (user_id, address) VALUES (?, ?)';
    db.query(addressQuery, [userResult.insertId, address], (err, addressResult) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add address' });
      }
      res.status(200).json({ message: 'User and address added successfully!' });
    });
  });
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
