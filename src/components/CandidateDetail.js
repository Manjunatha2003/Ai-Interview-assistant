import React from 'react';
import { Mail, Phone, Award } from 'lucide-react';

function CandidateDetail({ candidate, onBack }) {
  return (
    <div className="detail-container">
      <button className="back-button" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="detail-header">
        <div>
          <h2 className="detail-name">{candidate.name}</h2>
          <div className="detail-contact">
            <span><Mail size={14} /> {candidate.email}</span>
            <span><Phone size={14} /> {candidate.phone}</span>
          </div>
        </div>
        <div className="detail-score">
          <Award size={32} color="#f59e0b" />
          <div>
            <div className="detail-score-number">{candidate.totalScore}/120</div>
            <div className="detail-score-label">Final Score</div>
          </div>
        </div>
      </div>

      <div className="detail-summary">
        <h3 className="section-title">AI Summary</h3>
        <p>{candidate.summary}</p>
      </div>

      <div className="detail-answers">
        <h3 className="section-title">Interview Responses</h3>
        {candidate.answers.map((answer, idx) => {
          const difficultyClass = `difficulty-${answer.difficulty}`;
          
          return (
            <div key={idx} className="answer-detail">
              <div className="answer-detail-header">
                <span className="answer-detail-number">Question {idx + 1}</span>
                <span className={`difficulty-badge ${difficultyClass}`}>
                  {answer.difficulty.toUpperCase()}
                </span>
                <span className="answer-detail-score">
                  <Award size={14} /> {answer.score} points
                </span>
              </div>
              <p className="answer-detail-question">{answer.question}</p>
              <p className="answer-detail-answer"><strong>Answer:</strong> {answer.answer}</p>
              <p className="answer-detail-feedback"><strong>Feedback:</strong> {answer.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CandidateDetail;