import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import IntervieweeTab from './IntervieweeTab';
import InterviewerTab from './InterviewerTab';
import CredentialManager from './CredentialManager';
import WelcomeBackModal from './WelcomeBackModal';

function MainApp({ userRole, currentUserId, onLogout }) {
  const [activeTab, setActiveTab] = useState(userRole === 'interviewer' ? 'interviewer' : 'interviewee');
  const [candidates, setCandidates] = useState([]);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    const savedCandidates = localStorage.getItem('interviewCandidates');
    const savedCurrent = localStorage.getItem('currentCandidate');
    
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    }
    
    if (savedCurrent && userRole === 'interviewee') {
      const parsed = JSON.parse(savedCurrent);
      if (parsed.status !== 'completed' && parsed.userId === currentUserId) {
        setCurrentCandidate(parsed);
        setShowWelcomeBack(true);
      }
    }
  }, [userRole, currentUserId]);

  useEffect(() => {
    if (candidates.length > 0) {
      localStorage.setItem('interviewCandidates', JSON.stringify(candidates));
    }
  }, [candidates]);

  useEffect(() => {
    if (currentCandidate) {
      localStorage.setItem('currentCandidate', JSON.stringify(currentCandidate));
    }
  }, [currentCandidate]);

  const startNewInterview = (candidateData) => {
    const dataWithUserId = {
      ...candidateData,
      userId: currentUserId
    };
    setCurrentCandidate(dataWithUserId);
  };

  const completeInterview = (candidateData) => {
    setCandidates(prev => {
      const existing = prev.findIndex(c => c.email === candidateData.email);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = candidateData;
        return updated;
      }
      return [...prev, candidateData];
    });
    setCurrentCandidate(null);
    localStorage.removeItem('currentCandidate');
  };

const filteredCandidates = candidates
  .filter(c =>
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  .sort((a, b) => {
    if (sortBy === 'score') return (b.totalScore || 0) - (a.totalScore || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
  });


  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">AI Interview Assistant</h1>
          <div className="user-info">
            <span className="role-tag">{userRole === 'interviewer' ? 'Admin' : 'Interviewee'}</span>
            <span className="user-id-text">({currentUserId})</span>
          </div>
          {userRole === 'interviewer' && (
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'credentials' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('credentials')}
              >
                Manage Credentials
              </button>
              <button
                className={`tab ${activeTab === 'interviewer' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('interviewer')}
              >
                Dashboard
              </button>
            </div>
          )}
        </div>
        <button className="logout-button" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {showWelcomeBack && (
        <WelcomeBackModal
          onContinue={() => setShowWelcomeBack(false)}
          onStartNew={() => {
            setCurrentCandidate(null);
            localStorage.removeItem('currentCandidate');
            setShowWelcomeBack(false);
          }}
        />
      )}

      <main className="main">
        {userRole === 'interviewee' ? (
          <IntervieweeTab
            currentCandidate={currentCandidate}
            onStart={startNewInterview}
            onComplete={completeInterview}
            onUpdate={setCurrentCandidate}
          />
        ) : activeTab === 'credentials' ? (
          <CredentialManager />
        ) : (
          <InterviewerTab
            candidates={filteredCandidates}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}
      </main>
    </div>
  );
}

export default MainApp;