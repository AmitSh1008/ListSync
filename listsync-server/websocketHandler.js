const WebSocket = require('ws');
const db = require('./config/db'); // Assuming you already have a database connection for querying partners

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// A map to track users and their WebSocket connections
const userConnections = new Map();

// This function will send a message to a specific user
const sendMessageToUser = (userEmail, message) => {
  const userSockets = userConnections.get(userEmail);
  if (userSockets) {
    userSockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
};

// This function will notify the owner and partners of the list
const notifyOwnerAndPartners = async (listId, changeType) => {
  try {
    // Get the owner and partners of the list from the database
    const ownerQuery = await db.query(
        `SELECT users.email AS owner_email 
         FROM lists 
         JOIN users ON lists.user_id = users.id 
         WHERE lists.id = $1`, 
         [listId]
      );
      const ownerEmail = ownerQuery.rows[0].owner_email;
      console.log(ownerEmail);

    const partnersQuery = await db.query('SELECT partner_email FROM list_partners WHERE list_id = $1', [listId]);
    const partnerEmails = partnersQuery.rows.map((partner) => partner.partner_email);
    console.log(partnerEmails);

    // Notify the owner
    sendMessageToUser(ownerEmail, { listId, changeType });

    // Notify the partners
    partnerEmails.forEach((partnerEmail) => {
      sendMessageToUser(partnerEmail, { listId, changeType });
    });
  } catch (error) {
    console.error('Error notifying users:', error);
  }
};

// Handle WebSocket upgrade
const handleUpgrade = (server) => {
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  // Listen for WebSocket connections
  wss.on('connection', (ws, request) => {
    const userEmail = request.url.split('?user=')[1]; // Extract userEmail from query params
    console.log(userEmail);

    if (!userConnections.has(userEmail)) {
      userConnections.set(userEmail, []);
    }
    userConnections.get(userEmail).push(ws);

    ws.on('close', () => {
      // Remove the closed socket from the user's connections
      const connections = userConnections.get(userEmail);
      if (connections) {
        userConnections.set(userEmail, connections.filter((conn) => conn !== ws));
      }
    });

    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

    console.log(`User ${userEmail} connected`);
  });
};

module.exports = { handleUpgrade, notifyOwnerAndPartners };