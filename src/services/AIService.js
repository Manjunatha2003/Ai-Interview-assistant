export const AIService = {
  generateQuestion: (difficulty, questionNumber) => {
    const questions = {
      easy: [
        "What is the difference between let, const, and var in JavaScript?",
        "Explain what React hooks are and name three commonly used hooks.",
        "What is the purpose of the virtual DOM in React?",
        "Explain the difference between == and === in JavaScript.",
        "What is a closure in JavaScript? Provide an example.",
        "What are props in React and how do you pass them?",
        "Explain what npm is and why it's used.",
        "What is the difference between null and undefined in JavaScript?"
      ],
      medium: [
        "How does the virtual DOM work in React? Why is it beneficial?",
        "Explain the event loop in Node.js and how it handles asynchronous operations.",
        "What is the difference between synchronous and asynchronous code? Give examples.",
        "Explain React component lifecycle methods and their use cases.",
        "What are promises in JavaScript? How do they differ from callbacks?",
        "Describe the concept of middleware in Express.js.",
        "What is the difference between REST and GraphQL?",
        "Explain how authentication and authorization differ in web applications."
      ],
      hard: [
        "Design a RESTful API for a social media platform. Describe the endpoints and data structure.",
        "How would you optimize a React application for performance? Discuss at least 4 techniques.",
        "Explain how you would implement real-time chat functionality using WebSockets in a Node.js application.",
        "Describe the SOLID principles and how they apply to JavaScript/TypeScript development.",
        "How would you design a scalable microservices architecture for an e-commerce platform?",
        "Explain database indexing, sharding, and replication. When would you use each?",
        "Design a rate limiting system for an API. Discuss the algorithm and implementation.",
        "How would you implement server-side rendering (SSR) in a React application and what are its benefits?"
      ]
    };

    const difficultyQuestions = questions[difficulty];
    const questionIndex = (questionNumber - 1) % difficultyQuestions.length;
    return difficultyQuestions[questionIndex];
  },

  evaluateAnswer: (question, answer, difficulty) => {
    if (!answer || answer.trim().length < 10) {
      return { score: 0, feedback: "Answer too short or empty. Please provide more details." };
    }

    const baseScore = {
      easy: { min: 5, max: 10 },
      medium: { min: 10, max: 20 },
      hard: { min: 15, max: 30 }
    };

    const range = baseScore[difficulty];
    const wordCount = answer.trim().split(/\s+/).length;
    const hasKeywords = answer.length > 50;

    let score = range.min + Math.floor((wordCount / 30) * (range.max - range.min));

    if (hasKeywords && wordCount > 40) {
      score = Math.min(range.max, score + 2);
    }

    score = Math.min(range.max, Math.max(range.min, score));

    const percentage = ((score - range.min) / (range.max - range.min)) * 100;

    let feedback = "";
    if (percentage >= 80) {
      feedback = "Excellent answer! Shows strong understanding with relevant details and examples.";
    } else if (percentage >= 60) {
      feedback = "Good answer with relevant information. Could include more specific examples.";
    } else if (percentage >= 40) {
      feedback = "Decent attempt. The answer covers basics but lacks depth and detail.";
    } else {
      feedback = "Answer needs improvement. Consider providing more detailed explanation with examples.";
    }

    return { score, feedback };
  },

  generateSummary: (candidateData) => {
    const totalScore = candidateData.totalScore;
    const answers = candidateData.answers;
    const maxScore = 120;
    const percentage = (totalScore / maxScore) * 100;

    let performance = "Needs Improvement";
    if (percentage >= 85) performance = "Outstanding";
    else if (percentage >= 70) performance = "Excellent";
    else if (percentage >= 55) performance = "Good";
    else if (percentage >= 40) performance = "Average";

    const strongAnswers = answers.filter(a => a.score > 15).length;
    const avgScore = (totalScore / 6).toFixed(1);

    return `${performance} performance with ${totalScore}/${maxScore} points (${percentage.toFixed(1)}%). Demonstrated ${strongAnswers} strong answers with an average of ${avgScore} points per question. ${
      percentage >= 70 ? "Candidate shows solid understanding of full-stack concepts." :
      percentage >= 50 ? "Candidate has foundational knowledge but needs more practice." :
      "Candidate requires significant improvement in core concepts."
    }`;
  }
};