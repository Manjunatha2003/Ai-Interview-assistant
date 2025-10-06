import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MainApp from './components/MainApp';
import './App.css';

const ADMIN_CREDENTIALS = { userId: 'manju', password: '1234', role: 'interviewer' };
const DEFAULT_INTERVIEWEE = { userId: 'user', password: '1234', role: 'interviewee' };

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const savedRole = localStorage.getItem('userRole');
    const savedUserId = localStorage.getItem('currentUserId');
    
    if (authStatus === 'true' && savedRole) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setCurrentUserId(savedUserId);
    }
  }, []);

  const handleLogin = (role, userId) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentUserId(userId);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('currentUserId', userId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUserId(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUserId');
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        adminCredentials={ADMIN_CREDENTIALS}
        defaultInterviewee={DEFAULT_INTERVIEWEE}
      />
    );
  }

  return (
    <MainApp 
      userRole={userRole}
      currentUserId={currentUserId}
      onLogout={handleLogout}
    />
  );
}

export default App;