import React, { createContext, useContext, useEffect, useState } from 'react';

// Create WebSocket Context
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, userEmail }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    // Open WebSocket connection after login
    const socket = new WebSocket(`ws://192.168.1.24:5000?user=${userEmail}`);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      // You can dispatch events or handle the messages globally here
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);

    // Clean up on component unmount (logout or page close)
    return () => {
      socket.close();
    };
  }, [userEmail]);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
