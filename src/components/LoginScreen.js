import React, { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';

function LoginScreen({ onLogin, adminCredentials, defaultInterviewee }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (userId === adminCredentials.userId && password === adminCredentials.password) {
        onLogin(adminCredentials.role, userId);
      } else if (userId === defaultInterviewee.userId && password === defaultInterviewee.password) {
        onLogin(defaultInterviewee.role, userId);
      } else {
        const storedUsers = JSON.parse(localStorage.getItem('intervieweeUsers') || '[]');
        const foundUser = storedUsers.find(u => u.userId === userId && u.password === password);
        
        if (foundUser) {
          onLogin('interviewee', userId);
        } else {
          setError('Invalid credentials. Please try again.');
        }
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <Lock size={40} color="#3b82f6" />
          <h1 className="login-title">AI Interview Assistant</h1>
          <p className="login-subtitle">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="label">
              <User size={18} />
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input"
              placeholder="Enter user ID"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="label">
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            style={{ opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="login-hint">
            <p className="hint-text">Demo credentials:</p>
            <p className="hint-credentials">Admin: manju / 1234</p>
            <p className="hint-credentials">Interviewee: user / 1234</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;