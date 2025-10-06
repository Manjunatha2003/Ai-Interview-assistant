import React, { useState } from 'react';
import { Search, Award } from 'lucide-react';
import CandidateDetail from './CandidateDetail';

function InterviewerTab({ candidates, searchTerm, onSearchChange, sortBy, onSortChange }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  if (selectedCandidate) {
    return (
      <CandidateDetail
        candidate={selectedCandidate}
        onBack={() => setSelectedCandidate(null)}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Candidates Dashboard</h2>

        <div className="controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="search-input"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="score">Sort by Score</option>
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="empty-state">
          <p>No candidates yet. Interviewees can start taking interviews!</p>
        </div>
      ) : (
        <div className="candidates-list">
          {candidates.map((candidate, idx) => (
            <div
              key={idx}
              className="candidate-card"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <div className="candidate-header">
                <div>
                  <h3 className="candidate-name">{candidate.name}</h3>
                  <p className="candidate-email">{candidate.email}</p>
                </div>
                <div className="candidate-score">
                  <Award size={24} color="#f59e0b" />
                  <span className="score-number">{candidate.totalScore}/120</span>
                </div>
              </div>
              <p className="candidate-summary">{candidate.summary}</p>
              <div className="candidate-meta">
                <span>{new Date(candidate.completedAt).toLocaleDateString()}</span>
                <span className="view-details">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewerTab;