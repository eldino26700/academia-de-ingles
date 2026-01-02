
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Language, QuizQuestion } from '../types';

interface QuizChallengeProps {
  language: Language;
  interests: string[];
  onCorrect: (xp: number) => void;
}

const QuizChallenge: React.FC<QuizChallengeProps> = ({ language, interests, onCorrect }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const data = await generateQuiz(language, interests);
        setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [language, interests]);

  const handleOptionClick = (option: string) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
    if (option === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
      onCorrect(10);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(prev => prev + 1);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  if (loading) return <div className="text-center p-12">Loading challenges...</div>;

  if (currentIndex >= questions.length) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-2xl border-4 border-emerald-100">
        <div className="text-6xl mb-6 animate-bounce">🏆</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
        <p className="text-lg text-gray-600 mb-8">You got {score} out of {questions.length} correct!</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-emerald-500 text-white font-bold px-10 py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl"
        >
          Try Another Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-indigo-100 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
        {q.question}
      </h3>

      <div className="space-y-4">
        {q.options.map((option, idx) => {
          let styles = "bg-gray-50 border-2 border-gray-100 text-gray-800 hover:bg-white hover:border-indigo-200 transition-all";
          if (showFeedback) {
            if (option === q.correctAnswer) styles = "bg-green-100 border-2 border-green-500 text-green-700 font-bold";
            else if (option === selectedOption) styles = "bg-red-100 border-2 border-red-500 text-red-700";
            else styles = "bg-gray-50 border-2 border-gray-100 text-gray-300";
          }
          return (
            <button
              key={idx}
              disabled={showFeedback}
              onClick={() => handleOptionClick(option)}
              className={`w-full text-left p-5 rounded-2xl text-lg font-medium active:scale-95 ${styles}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-8 animate-fadeIn">
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6 text-indigo-900 text-sm italic">
            <strong>Pro Tip:</strong> {q.explanation}
          </div>
          <button
            onClick={nextQuestion}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizChallenge;
