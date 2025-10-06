import React from 'react';
import { Award, CheckCircle } from 'lucide-react';

function Message({ message }) {
  if (message.type === 'question') {
    const difficultyClass = `difficulty-${message.difficulty}`;
    
    return (
      <div className="question-message">
        <div className="question-header">
          <span className="question-badge">Question {message.questionNum}</span>
          <span className={`difficulty-badge ${difficultyClass}`}>
            {message.difficulty.toUpperCase()}
          </span>
        </div>
        <p className="message-text">{message.text}</p>
      </div>
    );
  }

  if (message.type === 'answer') {
    return (
      <div className="answer-message">
        <p className="answer-text">{message.text}</p>
        <div className="feedback">
          <div className="score-display">
            <Award size={16} />
            <span>+{message.score} points</span>
          </div>
          <p className="feedback-text">{message.feedback}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'completion') {
    return (
      <div className="completion-message">
        <CheckCircle size={32} color="#10b981" />
        <h3 className="completion-title">{message.text}</h3>
        <p className="completion-summary">{message.summary}</p>
      </div>
    );
  }

  return null;
}

export default Message;