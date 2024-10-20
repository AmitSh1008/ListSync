// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // Needed for WebSocket handling
const db = require('./config/db');
const { handleUpgrade } = require('./websocketHandler'); // Import WebSocket handler

const app = express();
const server = http.createServer(app); // Create HTTP server

// Bind the HTTP server to a specific IP and port
const IP_ADDRESS = 'http://shilmanamit1008.ddns.net'; // Your specific IP address
const PORT = process.env.PORT || 5000; // Set the port from environment variable or default to 5000

// Middleware
app.use(express.json());
// handling CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Authorization,, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Private-Network: true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE,OPTIONS"); // Add OPTIONS method
  next();
});

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

// Partners Routes
const partnersRoutes = require('./routes/partnerRoutes');
app.use('/api/partners', partnersRoutes);

// Upgrade server to handle WebSocket connections
handleUpgrade(server);

// Start Server
server.listen(PORT, () => {
  console.log(`Server is listening on ${IP_ADDRESS}:${PORT}`);
});