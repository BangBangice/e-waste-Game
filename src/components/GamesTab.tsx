"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const games: Game[] = [
  {
    id: "sorting",
    name: "E-Waste Sorting",
    description: "Sort different electronic items into correct recycling categories",
    icon: "♻️",
    color: "bg-green-500",
  },
  {
    id: "quiz",
    name: "Recycling Quiz",
    description: "Test your knowledge about e-waste recycling in Melbourne",
    icon: "🧠",
    color: "bg-blue-500",
  },
];

const sortingQuestions: Question[] = [
  {
    id: 1,
    question: "Where should you dispose of a broken smartphone?",
    options: ["Regular trash", "E-waste collection point", "Recycling bin", "Landfill"],
    correct: 1,
    explanation: "Smartphones contain valuable materials and should be taken to designated e-waste collection points for proper recycling."
  },
  {
    id: 2,
    question: "What should you do with old laptop batteries?",
    options: ["Throw in regular bin", "Take to e-waste facility", "Burn them", "Bury in garden"],
    correct: 1,
    explanation: "Batteries contain hazardous materials and must be disposed of at proper e-waste facilities to prevent environmental damage."
  },
  {
    id: 3,
    question: "How should you prepare a computer for recycling?",
    options: ["Just throw it away", "Remove personal data first", "Break it into pieces", "Leave it as is"],
    correct: 1,
    explanation: "Always remove personal data and sensitive information before recycling electronics to protect your privacy."
  }
];

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Which items are accepted at Melbourne e-waste collection points?",
    options: ["All electronics", "Only computers", "Only phones", "Only batteries"],
    correct: 0,
    explanation: "Most electronic items are accepted at e-waste collection points, including computers, phones, TVs, and small appliances."
  },
  {
    id: 2,
    question: "How often does Melbourne collect e-waste?",
    options: ["Daily", "Weekly", "Monthly", "On request"],
    correct: 2,
    explanation: "Melbourne provides monthly e-waste collection services in most areas. Check your local council schedule."
  },
  {
    id: 3,
    question: "What happens to recycled e-waste in Melbourne?",
    options: ["Goes to landfill", "Exported overseas", "Processed locally", "Burned for energy"],
    correct: 2,
    explanation: "E-waste in Melbourne is processed at local facilities where valuable materials are recovered and reused."
  }
];

export default function GamesTab() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const totalRounds = 3;
  const questionsPerRound = 1;

  const getCurrentQuestions = () => {
    return selectedGame === "sorting" ? sortingQuestions : quizQuestions;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const currentQ = getCurrentQuestions()[currentQuestion];
    if (answerIndex === currentQ.correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < getCurrentQuestions().length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Round complete
      if (currentRound < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Game complete
        setGameComplete(true);
      }
    }
  };

  const resetGame = () => {
    setSelectedGame(null);
    setCurrentRound(1);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
  };

  const startGame = (gameId: string) => {
    setSelectedGame(gameId);
    setCurrentRound(1);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="bg-white rounded-lg shadow-md p-8">
          <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-4">
            You scored {score} out of {getCurrentQuestions().length * totalRounds} points
          </p>
          <div className="text-4xl mb-6">
            {score >= (getCurrentQuestions().length * totalRounds) * 0.8 ? "🏆" : 
             score >= (getCurrentQuestions().length * totalRounds) * 0.6 ? "🥈" : "🥉"}
          </div>
          <button
            onClick={resetGame}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (selectedGame) {
    const currentQ = getCurrentQuestions()[currentQuestion];
    const progress = ((currentRound - 1) * getCurrentQuestions().length + currentQuestion + 1) / (totalRounds * getCurrentQuestions().length);

    return (
      <div className="space-y-6">
        {/* Game Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {games.find(g => g.id === selectedGame)?.name}
            </h2>
            <span className="text-sm text-gray-600">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Score: {score}</span>
            <span>Question {currentQuestion + 1} of {getCurrentQuestions().length}</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  showResult
                    ? index === currentQ.correct
                      ? "border-green-500 bg-green-50 text-green-800"
                      : index === selectedAnswer && index !== currentQ.correct
                      ? "border-red-500 bg-red-50 text-red-800"
                      : "border-gray-200 bg-gray-50"
                    : selectedAnswer === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {showResult && index === currentQ.correct && (
                    <CheckCircle className="text-green-500" size={20} />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQ.correct && (
                    <XCircle className="text-red-500" size={20} />
                  )}
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
              <p className="text-blue-700">{currentQ.explanation}</p>
            </motion.div>
          )}

          {showResult && (
            <div className="mt-6 text-center">
              <button
                onClick={handleNextQuestion}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                {currentQuestion < getCurrentQuestions().length - 1 || currentRound < totalRounds
                  ? "Next Question"
                  : "Finish Game"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Recycling Games</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a game to test your e-waste recycling knowledge
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-gray-300 transition-all"
          >
            <div className="text-center">
              <div className={`w-16 h-16 ${game.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4`}>
                {game.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <button
                onClick={() => startGame(game.id)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Play size={20} />
                <span>Start Game</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
