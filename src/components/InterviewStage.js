import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { AIService } from '../services/AIService';
import Message from './Message';

function InterviewStage({ candidate, onUpdate, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Safe defaults to avoid null errors
  const currentQuestionNum = candidate?.currentQuestion ?? 1;
  const difficulty =
    currentQuestionNum <= 2 ? 'easy' :
    currentQuestionNum <= 4 ? 'medium' : 'hard';
  const timeLimit = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120;

  const askQuestion = (cand = candidate) => {
    if (!cand) return;
    const questionNum = cand.currentQuestion ?? 1;
    if (questionNum > 6) {
      completeInterview(cand);
      return;
    }

    const diff =
      questionNum <= 2 ? 'easy' :
      questionNum <= 4 ? 'medium' : 'hard';
    const tLimit = diff === 'easy' ? 20 : diff === 'medium' ? 60 : 120;

    const question = AIService.generateQuestion(diff, questionNum);

    setMessages(prev => [
      ...prev,
      {
        type: 'question',
        text: question,
        questionNum: questionNum,
        difficulty: diff
      }
    ]);

    setIsAnswering(true);
    setTimeLeft(tLimit);
  };

  const handleSubmitAnswer = () => {
    if (!candidate) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAnswering(false);

    const lastQuestion = messages[messages.length - 1]?.text ?? '';
    const evalResult = AIService.evaluateAnswer(lastQuestion, currentAnswer, difficulty);

    const answerRecord = {
      question: lastQuestion,
      answer: currentAnswer || '(No answer provided)',
      difficulty: difficulty,
      score: evalResult.score,
      feedback: evalResult.feedback,
      timeTaken: timeLimit - (timeLeft || 0)
    };

    setMessages(prev => [
      ...prev,
      {
        type: 'answer',
        text: currentAnswer || '(No answer provided)',
        score: evalResult.score,
        feedback: evalResult.feedback
      }
    ]);

    const updatedCandidate = {
      ...candidate,
      answers: [...(candidate.answers || []), answerRecord],
      totalScore: (candidate.totalScore || 0) + evalResult.score,
      currentQuestion: (candidate.currentQuestion || 1) + 1
    };

    onUpdate(updatedCandidate);
    setCurrentAnswer('');
    setTimeLeft(null);

    setTimeout(() => {
      if (updatedCandidate.currentQuestion <= 6) {
        askQuestion(updatedCandidate);
      } else {
        completeInterview(updatedCandidate);
      }
    }, 1500);
  };

  const completeInterview = (cand = candidate) => {
    if (!cand) return;
    const summary = AIService.generateSummary(cand);
    const completedCandidate = {
      ...cand,
      status: 'completed',
      completedAt: new Date().toISOString(),
      summary: summary
    };

    setMessages(prev => [
      ...prev,
      {
        type: 'completion',
        text: `Interview completed! Your final score is ${cand.totalScore || 0}/120.`,
        summary: summary
      }
    ]);

    onComplete(completedCandidate);
  };

  // Always call useEffect unconditionally
  useEffect(() => {
    if (!candidate) return;

    if ((candidate.answers?.length || 0) === 0 && messages.length === 0) {
      askQuestion();
    } else if ((candidate.answers?.length || 0) > 0) {
      const restored = [];
      candidate.answers.forEach((ans, idx) => {
        restored.push({
          type: 'question',
          text: ans.question,
          questionNum: idx + 1,
          difficulty: ans.difficulty
        });
        restored.push({
          type: 'answer',
          text: ans.answer,
          score: ans.score,
          feedback: ans.feedback
        });
      });

      if ((candidate.currentQuestion || 1) <= 6 && candidate.status === 'in-progress') {
        const q = AIService.generateQuestion(difficulty, currentQuestionNum);
        restored.push({
          type: 'question',
          text: q,
          questionNum: currentQuestionNum,
          difficulty: difficulty
        });
        setIsAnswering(true);
        setTimeLeft(timeLimit);
      }

      setMessages(restored);
    }
  }, [candidate]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!isAnswering || timeLeft === null) return;

    if (timeLeft <= 0) {
      handleSubmitAnswer();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnswering, timeLeft]);

  if (!candidate) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="progress-info">
          <span className="progress-text">Question {Math.min(currentQuestionNum, 6)}/6</span>
          <span className="score-text">Score: {candidate.totalScore || 0}</span>
        </div>
        {isAnswering && timeLeft !== null && (
          <div className="timer">
            <Clock size={18} />
            <span style={{ color: timeLeft <= 10 ? '#ef4444' : '#10b981' }}>{timeLeft}s</span>
          </div>
        )}
      </div>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isAnswering && (
        <div className="input-container">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="textarea"
            placeholder="Type your answer here..."
            rows={4}
          />
          <button className="submit-button" onClick={handleSubmitAnswer}>
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}

export default InterviewStage;
