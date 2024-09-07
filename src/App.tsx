import React from 'react';
import './App.css';
import Main from './components/Main';
import Login from './components/Login';
import { UserProvider, useUser } from './UserContext';

function AppContent() {
  const { isLoggedIn, login, logout } = useUser();

  return (
    <div>
      {isLoggedIn ? (
        <Main />
      ) : (
        <Login onLogin={login} />
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;