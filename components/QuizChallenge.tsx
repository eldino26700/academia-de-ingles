
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Language, QuizQuestion } from '../types';

interface QuizChallengeProps {
  language: Language;
  interests: string[];
  specificInterests?: string;
  onCorrect: (xp: number) => void;
}

const QuizChallenge: React.FC<QuizChallengeProps> = ({ language, interests, specificInterests, onCorrect }) => {
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
        const query = specificInterests || interests.join(", ");
        const data = await generateQuiz(language, interests, query);
        setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [language, interests, specificInterests]);

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

  if (loading) return (
    <div className="text-center p-12 text-emerald-400 tech-font">
      <i className="fas fa-spinner animate-spin text-4xl mb-4"></i>
      <p>FETCHING CHALLENGE MODULES...</p>
    </div>
  );

  if (currentIndex >= questions.length) {
    return (
      <div className="bg-[#0a2e21] rounded-[2.5rem] p-12 text-center shadow-2xl border-4 border-emerald-500/20">
        <div className="text-7xl mb-6">⚙️</div>
        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Diagnostic Complete</h2>
        <p className="text-lg text-emerald-400/60 tech-font mb-8">Score Matrix: {score} / {questions.length} successful pulses</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-emerald-500 text-black font-black px-10 py-5 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl tech-font uppercase"
        >
          Initialize New Test_
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="bg-[#0a2e21] rounded-[2.5rem] p-10 shadow-2xl border-4 border-emerald-500/20 max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <div 
          className="h-full bg-emerald-500 transition-all duration-700"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-10 mt-4 tech-font">
        <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest">
          Node {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-white/20 text-xs">LOG_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
      </div>

      <h3 className="text-3xl font-black text-white mb-10 leading-tight">
        {q.question}
      </h3>

      <div className="space-y-4">
        {q.options.map((option, idx) => {
          let styles = "bg-white/5 border-2 border-white/5 text-emerald-100 hover:bg-white/10 hover:border-emerald-500/30 transition-all";
          if (showFeedback) {
            if (option === q.correctAnswer) styles = "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]";
            else if (option === selectedOption) styles = "bg-rose-500/20 border-2 border-rose-500 text-rose-400";
            else styles = "bg-white/5 border-2 border-white/5 text-white/20";
          }
          return (
            <button
              key={idx}
              disabled={showFeedback}
              onClick={() => handleOptionClick(option)}
              className={`w-full text-left p-6 rounded-2xl text-lg font-medium active:scale-95 tech-font ${styles}`}
            >
              <span className="opacity-40 mr-4 font-normal">{String.fromCharCode(65 + idx)})</span>
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-10 animate-fadeIn">
          <div className="p-6 bg-black/40 rounded-2xl border border-white/10 mb-6 text-emerald-100/60 text-sm leading-relaxed italic tech-font">
            <strong className="text-emerald-400 uppercase mr-2">Core Explanation:</strong> {q.explanation}
          </div>
          <button
            onClick={nextQuestion}
            className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl shadow-lg hover:bg-emerald-400 transition-all uppercase tech-font"
          >
            {currentIndex < questions.length - 1 ? 'Forward Message_' : 'Commit Final Results_'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizChallenge;
