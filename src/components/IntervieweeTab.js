import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import CollectInfoStage from './CollectInfoStage';
import InterviewStage from './InterviewStage';

const parseResume = async (file) => {
  const text = await extractTextFromFile(file);
  
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const nameRegex = /^([A-Z][a-z]+\s[A-Z][a-z]+)/m;
  
  const email = text.match(emailRegex)?.[0] || '';
  const phone = text.match(phoneRegex)?.[0] || '';
  const name = text.match(nameRegex)?.[1] || '';
  
  return { name, email, phone };
};

const extractTextFromFile = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve("John Doe\njohn.doe@email.com\n+1-555-123-4567\nExperienced Full Stack Developer");
    };
    reader.readAsText(file);
  });
};

function IntervieweeTab({ currentCandidate, onStart, onComplete, onUpdate }) {
  const [stage, setStage] = useState('upload');
  const [resumeFile, setResumeFile] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (currentCandidate) {
      setCandidateInfo({
        name: currentCandidate.name,
        email: currentCandidate.email,
        phone: currentCandidate.phone
      });
      setStage(currentCandidate.status === 'in-progress' ? 'interview' : 'completed');
    }
  }, [currentCandidate]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const parsed = await parseResume(file);
      setCandidateInfo(parsed);
      setResumeFile(file);
      setStage('collect-info');
    } catch (err) {
      setError('Failed to parse resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startInterview = () => {
    if (!candidateInfo.name || !candidateInfo.email || !candidateInfo.phone) {
      setError('Please provide all required information');
      return;
    }

    const newCandidate = {
      ...candidateInfo,
      status: 'in-progress',
      currentQuestion: 1,
      answers: [],
      totalScore: 0,
      startedAt: new Date().toISOString()
    };

    onStart(newCandidate);
    setStage('interview');
  };

  if (stage === 'upload') {
    return (
      <div className="upload-container">
        <div className="upload-box">
          <h2 className="upload-title">Upload Your Resume</h2>
          <p className="upload-desc">Upload your resume to begin the AI-powered interview</p>

          <label className="upload-label">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="file-input"
              disabled={isProcessing}
            />
            <div className="upload-button">
              {isProcessing ? 'Processing...' : 'Choose File (PDF or DOCX)'}
            </div>
          </label>

          {error && (
            <div className="error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'collect-info') {
    return (
      <CollectInfoStage
        candidateInfo={candidateInfo}
        onChange={setCandidateInfo}
        onStart={startInterview}
        error={error}
      />
    );
  }

  if (stage === 'interview') {
    return (
      <InterviewStage
        candidate={currentCandidate}
        onUpdate={onUpdate}
        onComplete={onComplete}
      />
    );
  }

  return null;
}

export default IntervieweeTab;