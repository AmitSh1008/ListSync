import React, { useState, useEffect } from 'react';
import { WebSocketProvider } from './WebSocketContext'; // Import the WebSocket context provider
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import Authentication from './Components/Authentication';
import Lists from './Components/Lists';
import Navbar from './Components/Navbar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);
  //const [screenResolution, setScreenResolution] = useState('');

  // useEffect(() => {
  //   const updateResolution = () => {
  //     setScreenResolution(`${window.innerWidth}x${window.innerHeight}`);
  //   };

  //   updateResolution();
  //   window.addEventListener('resize', updateResolution);

  //   return () => window.removeEventListener('resize', updateResolution);
  // }, []);

  const handleLogin = (token, userId, userEmail) => {
    setToken(token);
    setUserId(userId);
    setUserEmail(userEmail);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
  };

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    setUserEmail('');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  };

  return (
    <ConfigProvider direction="rtl">
      <Router basename="/ListSyncWeb">
        <div className="app-container">
          <Navbar isLoggedIn={!!token} onLogout={handleLogout} />
          {/* <div className="resolution-display">
            רזולוציית מסך: {screenResolution}
          </div> */}
          <main className="app-content">
            <Routes>
              <Route path="/" element={
                !token ? <Authentication setUserInfo={(data) => handleLogin(data.token, data.userId, data.userEmail)} />
                       : <Navigate to="/lists" replace />
              } />
              <Route path="/lists" element={
                token ? (
                  // Wrap the Lists component in WebSocketProvider to establish WebSocket connection after login
                  <WebSocketProvider userEmail={userEmail}>
                    <Lists token={token} userId={userId} userEmail={userEmail} />
                  </WebSocketProvider>
                ) : (
                  <Navigate to="/" replace />
                )
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;