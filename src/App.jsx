import React, { useState } from 'react';
import { Brain, Trophy } from 'lucide-react';

const MathAdventures = () => {
  const [gameState, setGameState] = useState('setup');
  const [studentName, setStudentName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [session, setSession] = useState({
    attempts: [],
    currentStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0
  });

  const generateProblem = (level) => {
    const operations = ['+', '-', '×', '÷'];
    let num1, num2, operation, answer;

    if (level === 'easy') {
      operation = Math.random() < 0.7 ? '+' : '-';
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      
      if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
      }
      answer = operation === '+' ? num1 + num2 : num1 - num2;
    } 
    else if (level === 'medium') {
      operation = operations[Math.floor(Math.random() * 3)];
      
      if (operation === '×') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
      } else {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 30) + 1;
        
        if (operation === '-' && num2 > num1) {
          [num1, num2] = [num2, num1];
        }
        answer = operation === '+' ? num1 + num2 : num1 - num2;
      }
    } 
    else {
      operation = operations[Math.floor(Math.random() * 4)];
      
      if (operation === '×') {
        num1 = Math.floor(Math.random() * 15) + 5;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
      } else if (operation === '÷') {
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = Math.floor(Math.random() * 15) + 1;
        num1 = num2 * answer;
      } else {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        
        if (operation === '-' && num2 > num1) {
          [num1, num2] = [num2, num1];
        }
        answer = operation === '+' ? num1 + num2 : num1 - num2;
      }
    }

    return { num1, num2, operation, answer, difficulty: level };
  };

  const getNextDifficulty = (currentDiff, attempts) => {
    if (attempts.length < 2) return currentDiff;

    const recent = attempts.slice(-3);
    const recentCorrect = recent.filter(a => a.correct).length;
    const avgTime = recent.reduce((sum, a) => sum + a.time, 0) / recent.length;

    if (recentCorrect === 3 && avgTime < 8000) {
      if (currentDiff === 'easy') return 'medium';
      if (currentDiff === 'medium') return 'hard';
    }
    
    if (recentCorrect >= 2 && avgTime < 15000) {
      if (currentDiff === 'easy' && recentCorrect === 3) return 'medium';
      return currentDiff;
    }

    if (recentCorrect <= 1) {
      if (currentDiff === 'hard') return 'medium';
      if (currentDiff === 'medium') return 'easy';
    }

    return currentDiff;
  };

  const startGame = () => {
    if (!studentName.trim()) {
      alert('Please enter your name!');
      return;
    }
    setGameState('playing');
    const problem = generateProblem(difficulty);
    setCurrentProblem(problem);
    setStartTime(Date.now());
  };

  const submitAnswer = () => {
    if (userAnswer === '') return;

    const timeTaken = Date.now() - startTime;
    const isCorrect = parseInt(userAnswer) === currentProblem.answer;

    const attempt = {
      problem: `${currentProblem.num1} ${currentProblem.operation} ${currentProblem.num2}`,
      userAnswer: parseInt(userAnswer),
      correctAnswer: currentProblem.answer,
      correct: isCorrect,
      time: timeTaken,
      difficulty: currentProblem.difficulty
    };

    const newAttempts = [...session.attempts, attempt];
    const newStreak = isCorrect ? session.currentStreak + 1 : 0;

    setSession({
      attempts: newAttempts,
      currentStreak: newStreak,
      totalCorrect: session.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempts: session.totalAttempts + 1
    });

    setGameState('feedback');
    
    setTimeout(() => {
      if (newAttempts.length >= 10) {
        setGameState('summary');
      } else {
        const nextDiff = getNextDifficulty(difficulty, newAttempts);
        if (nextDiff !== difficulty) {
          setDifficulty(nextDiff);
        }
        
        const nextProblem = generateProblem(nextDiff);
        setCurrentProblem(nextProblem);
        setUserAnswer('');
        setStartTime(Date.now());
        setGameState('playing');
      }
    }, 1500);
  };

  const restart = () => {
    setGameState('setup');
    setStudentName('');
    setDifficulty('medium');
    setSession({
      attempts: [],
      currentStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0
    });
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Brain className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Math Adventures</h1>
            <p className="text-gray-600">AI-Powered Adaptive Learning</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-2 px-4 rounded-lg font-medium capitalize transition ${
                      difficulty === level
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition"
            >
              Start Learning!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">Hello, {studentName}!</p>
                <p className="text-lg font-semibold text-gray-800">
                  Question {session.totalAttempts + 1} of 10
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Difficulty</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {session.currentStreak >= 3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 font-medium">
                  🔥 {session.currentStreak} in a row! You're on fire!
                </p>
              </div>
            )}

            <div className="text-center py-12">
              <p className="text-6xl font-bold text-gray-800 mb-8">
                {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
              </p>

              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                className="w-48 text-center text-3xl px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="?"
                autoFocus
              />
            </div>

            <button
              onClick={submitAnswer}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition"
            >
              Submit Answer
            </button>

            <div className="mt-6 flex justify-around text-sm">
              <div className="text-center">
                <p className="text-gray-600">Correct</p>
                <p className="text-2xl font-bold text-green-600">{session.totalCorrect}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-blue-600">
                  {session.totalAttempts > 0 
                    ? Math.round((session.totalCorrect / session.totalAttempts) * 100) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'feedback') {
    const lastAttempt = session.attempts[session.attempts.length - 1];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8 flex items-center justify-center">
        <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center ${
          lastAttempt.correct ? 'border-4 border-green-400' : 'border-4 border-red-400'
        }`}>
          <div className="text-6xl mb-4">
            {lastAttempt.correct ? '🎉' : '💪'}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            lastAttempt.correct ? 'text-green-600' : 'text-red-600'
          }`}>
            {lastAttempt.correct ? 'Correct!' : 'Not quite!'}
          </h2>
          <p className="text-gray-600 text-lg">
            {lastAttempt.problem} = {lastAttempt.correctAnswer}
          </p>
          {!lastAttempt.correct && (
            <p className="text-gray-500 mt-2">You answered: {lastAttempt.userAnswer}</p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Time: {(lastAttempt.time / 1000).toFixed(1)}s
          </p>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const accuracy = Math.round((session.totalCorrect / session.totalAttempts) * 100);
    const avgTime = session.attempts.reduce((sum, a) => sum + a.time, 0) / session.attempts.length / 1000;
    
    const difficultyProgression = session.attempts.map(a => a.difficulty);
    const finalDiff = difficultyProgression[difficultyProgression.length - 1];
    const startDiff = difficultyProgression[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Great Job, {studentName}!
            </h1>
            <p className="text-gray-600">Here's how you did</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Problems Solved</p>
              <p className="text-3xl font-bold text-blue-600">{session.totalAttempts}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Avg Time</p>
              <p className="text-3xl font-bold text-purple-600">{avgTime.toFixed(1)}s</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Difficulty Progression
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {difficultyProgression.map((d, i) => (
                <div
                  key={i}
                  className={`h-8 flex-1 rounded ${
                    d === 'easy' ? 'bg-green-400' :
                    d === 'medium' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}
                  title={`Q${i + 1}: ${d}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Started: {startDiff}</span>
              <span>Ended: {finalDiff}</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Recommendation</h3>
            <p className="text-gray-700">
              {accuracy >= 80 && finalDiff === 'hard' 
                ? "Outstanding work! You're ready for even more challenges!"
                : accuracy >= 70
                ? "Great progress! Keep practicing at this level to build confidence."
                : accuracy >= 50
                ? "Good effort! Try starting with an easier level next time."
                : "Don't worry! Math takes practice. Start with easier problems and work your way up."}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Next recommended level: <span className="font-semibold capitalize">
                {accuracy >= 80 && finalDiff !== 'hard' ? 'hard' : 
                 accuracy >= 60 ? finalDiff : 
                 finalDiff === 'hard' ? 'medium' : 'easy'}
              </span>
            </p>
          </div>

          <button
            onClick={restart}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }
};

export default MathAdventures;