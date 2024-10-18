// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('Welcome to ListSync API!');
});

// User Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// List Routes
const listRoutes = require('./routes/listRoutes');
app.use('/api/lists', listRoutes);

// Item Routes
const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});