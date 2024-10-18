// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import Authentication from './Components/Authentication';
import Lists from './Components/Lists';
import Navbar from './Components/Navbar';

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleLogin = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <ConfigProvider direction="rtl">
      <Router>
        <div className="app-container">
          <Navbar isLoggedIn={!!token} onLogout={handleLogout} />
          <main className="app-content">
            <Routes>
              <Route path="/" element={
                !token ? <Authentication setUserInfo={(data) => handleLogin(data.token, data.userId)} />
                       : <Navigate to="/lists" replace />
              } />
              <Route path="/lists" element={
                token ? <Lists token={token} userId={userId} />
                      : <Navigate to="/" replace />
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;