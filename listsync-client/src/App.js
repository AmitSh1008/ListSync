import React, { useState, useEffect } from 'react';
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
  const [userEmail, setUserEmail] = useState('');
  const [screenResolution, setScreenResolution] = useState('');

  useEffect(() => {
    const updateResolution = () => {
      setScreenResolution(`${window.innerWidth}x${window.innerHeight}`);
    };

    updateResolution();
    window.addEventListener('resize', updateResolution);

    return () => window.removeEventListener('resize', updateResolution);
  }, []);

  const handleLogin = (token, userId, userEmail) => {
    setToken(token);
    setUserId(userId);
    setUserEmail(userEmail);
  };

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    setUserEmail('');
  };

  return (
    <ConfigProvider direction="rtl">
      <Router>
        <div className="app-container">
          <Navbar isLoggedIn={!!token} onLogout={handleLogout} />
          <div className="resolution-display">
            רזולוציית מסך: {screenResolution}
          </div>
          <main className="app-content">
            <Routes>
              <Route path="/" element={
                !token ? <Authentication setUserInfo={(data) => handleLogin(data.token, data.userId, data.userEmail)} />
                       : <Navigate to="/lists" replace />
              } />
              <Route path="/lists" element={
                token ? <Lists token={token} userId={userId} userEmail={userEmail} />
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