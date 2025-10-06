import React from 'react';

function WelcomeBackModal({ onContinue, onStartNew }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Welcome Back!</h2>
        <p className="modal-text">
          You have an unfinished interview. Would you like to continue where you left off?
        </p>
        <div className="modal-buttons">
          <button className="modal-button-primary" onClick={onContinue}>
            Continue Interview
          </button>
          <button className="modal-button-secondary" onClick={onStartNew}>
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBackModal;