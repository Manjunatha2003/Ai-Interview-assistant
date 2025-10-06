import React, { useState, useEffect } from 'react';
import { UserPlus, Copy, X, CheckCircle } from 'lucide-react';

const generateRandomCredentials = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return {
    userId: `user${randomNum}`,
    password: Math.random().toString(36).slice(-8),
    role: 'interviewee',
    name: `Candidate ${randomNum}`,
    email: `candidate${randomNum}@example.com`
  };
};

function CredentialManager() {
  const [users, setUsers] = useState([]);
  const [newCredential, setNewCredential] = useState(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('intervieweeUsers') || '[]');
    setUsers(storedUsers);
  }, []);

  const generateNewUser = () => {
    const newUser = generateRandomCredentials();
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('intervieweeUsers', JSON.stringify(updatedUsers));
    setNewCredential(newUser);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.userId !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('intervieweeUsers', JSON.stringify(updatedUsers));
  };

  return (
    <div className="credential-manager">
      <div className="credential-header">
        <h3 className="credential-title">Interviewee Credentials Management</h3>
        <button className="generate-button" onClick={generateNewUser}>
          <UserPlus size={18} />
          Generate New Credentials
        </button>
      </div>

      {newCredential && (
        <div className="new-credential-box">
          <h4 className="new-credential-title">
            <CheckCircle size={20} color="#10b981" />
            New Credentials Generated!
          </h4>
          <div className="credential-details">
            <div className="credential-row">
              <span className="credential-label">Name:</span>
              <span className="credential-value">{newCredential.name}</span>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(newCredential.name)}
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="credential-row">
              <span className="credential-label">Email:</span>
              <span className="credential-value">{newCredential.email}</span>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(newCredential.email)}
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="credential-row">
              <span className="credential-label">User ID:</span>
              <span className="credential-value">{newCredential.userId}</span>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(newCredential.userId)}
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="credential-row">
              <span className="credential-label">Password:</span>
              <span className="credential-value">{newCredential.password}</span>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(newCredential.password)}
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
          {showCopySuccess && (
            <div className="copy-success">
              <CheckCircle size={14} />
              Copied to clipboard!
            </div>
          )}
        </div>
      )}

      <div className="user-list">
        <h4 className="user-list-title">Active Interviewee Accounts ({users.length})</h4>
        {users.length === 0 ? (
          <p className="empty-user-list">No interviewee accounts created yet.</p>
        ) : (
          <div className="user-cards">
            {users.map((user, idx) => (
              <div key={idx} className="user-card">
                <div className="user-card-content">
                  <div>
                    <p className="user-card-label">Name:</p>
                    <p className="user-card-value">{user.name}</p>
                  </div>
                  <div>
                    <p className="user-card-label">Email:</p>
                    <p className="user-card-value">{user.email}</p>
                  </div>
                  <div>
                    <p className="user-card-label">User ID:</p>
                    <p className="user-card-value">{user.userId}</p>
                  </div>
                  <div>
                    <p className="user-card-label">Password:</p>
                    <p className="user-card-value">{user.password}</p>
                  </div>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => deleteUser(user.userId)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CredentialManager;
