import React, { createContext, useContext, useEffect, useState } from 'react';

// Create WebSocket Context
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, userEmail }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    // Open WebSocket connection after login
    const socket = new WebSocket(`ws://shilmanamit1008.ddns.net:5001?user=${userEmail}`);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      if (['partner_added', 'partnered_table_delete'].includes(message.changeType)) {
        // Create a custom event and pass the message as detail
        const customEvent = new CustomEvent('ListChangeEvent', { detail: message });
        window.dispatchEvent(customEvent); // Dispatch the event globally
        if (message.changeType === 'partner_added') {
          const customEvent = new CustomEvent('ItemChangeEvent', { detail: message });
          window.dispatchEvent(customEvent);  // Dispatch the event globally
        }
      } else if (['added', 'deleted', 'updated'].includes(message.changeType)) {
        const customEvent = new CustomEvent('ItemChangeEvent', { detail: message });
        window.dispatchEvent(customEvent);  // Dispatch the event globally
      }
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
