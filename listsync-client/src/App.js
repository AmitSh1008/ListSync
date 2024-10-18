// src/App.js
import React, { useState } from 'react';
import Register from './Components/Register';
import Login from './Components/Login';
import Lists from './Components/Lists';

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleLogin = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };

  return (
    <div>
      {!token ? (
        <>
          <Register />
          <Login setToken={(data) => handleLogin(data.token, data.userId)} />
        </>
      ) : (
        <div>
          <Lists token={token} userId={userId} />
          <button onClick={() => { setToken(null); setUserId(null); }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
