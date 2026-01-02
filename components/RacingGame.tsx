
import React, { useState, useEffect, useRef } from 'react';
import { generateRacingChallenges } from '../services/geminiService';
import { Language, RacingChallenge } from '../types';

interface RacingGameProps {
  language: Language;
  specificInterests: string;
  onFinish: (xp: number) => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ language, specificInterests, onFinish }) => {
  const [challenges, setChallenges] = useState<RacingChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Progress is 0-1000 to allow smoother movement
  const [userProgress, setUserProgress] = useState(0);
  const [userSpeed, setUserSpeed] = useState(0);
  const [opponents, setOpponents] = useState([
    { id: 1, name: 'Neural Bot', progress: 0, baseSpeed: 1.8, color: '#06b6d4' },
    { id: 2, name: 'Cyber Racer', progress: 0, baseSpeed: 1.5, color: '#ec4899' },
    { id: 3, name: 'Data Ghost', progress: 0, baseSpeed: 2.1, color: '#a855f7' },
  ]);

  const [feedback, setFeedback] = useState<'hit' | 'miss' | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await generateRacingChallenges(language, specificInterests);
        setChallenges(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [language, specificInterests]);

  // Countdown logic
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('playing');
        setUserSpeed(2); // Initial speed
      }
    }
  }, [countdown, gameState]);

  // Main Game Loop
  useEffect(() => {
    if (gameState === 'playing') {
      const frameRate = 1000 / 60;
      const interval = setInterval(() => {
        // Update user
        setUserProgress(prev => {
          const next = prev + userSpeed;
          if (next >= 1000) {
            setGameState('finished');
            return 1000;
          }
          return next;
        });

        // Decay user speed back to base over time
        setUserSpeed(prev => Math.max(1.2, prev - 0.005));

        // Update opponents with slight variance
        setOpponents(prev => prev.map(opp => {
          const variance = (Math.random() - 0.5) * 0.2;
          const next = opp.progress + opp.baseSpeed + variance;
          if (next >= 1000 && gameState === 'playing') {
            setGameState('finished');
          }
          return { ...opp, progress: Math.min(1000, next) };
        }));
      }, frameRate);

      return () => clearInterval(interval);
    }
  }, [gameState, userSpeed]);

  useEffect(() => {
    if (gameState === 'finished') {
      const userWon = userProgress >= 1000;
      onFinish(userWon ? 50 : 15);
    }
  }, [gameState]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setUserSpeed(prev => Math.min(12, prev + 3.5)); // Nitro Boost
      setFeedback('hit');
      // Advance question
      if (currentIndex < challenges.length - 1) {
        setCurrentIndex(c => c + 1);
      }
    } else {
      setUserSpeed(prev => Math.max(0.5, prev - 2)); // Major slowdown
      setFeedback('miss');
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
    
    setTimeout(() => setFeedback(null), 600);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <i className="fas fa-bolt absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 text-2xl animate-pulse"></i>
      </div>
      <p className="tech-font text-emerald-400 font-bold text-xl uppercase tracking-widest animate-pulse">
        Generating Track: {specificInterests}...
      </p>
    </div>
  );

  if (gameState === 'finished') {
    // FIX: Compare user progress directly to target 1000 instead of attempting to compare to a boolean from .every()
    const userWon = userProgress >= 1000;
    return (
      <div className="bg-[#051611] rounded-[3rem] p-12 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] border-4 border-emerald-500/30 max-w-2xl mx-auto animate-fadeIn">
        <div className="mb-6">
          <i className={`fas ${userWon ? 'fa-trophy text-amber-400' : 'fa-flag-checkered text-emerald-400'} text-7xl animate-bounce`}></i>
        </div>
        <h2 className="text-5xl font-black mb-4 text-white uppercase tracking-tighter">
          {userWon ? "VICTORY ACHIEVED" : "RACE CONCLUDED"}
        </h2>
        <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 mb-8">
          <p className="text-emerald-400 tech-font text-sm uppercase mb-2">Neural Rewards Synced:</p>
          <p className="text-4xl font-black text-white">+{userWon ? 50 : 15} XP</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-emerald-500 text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-95 tech-font uppercase"
        >
          Initialize Re-match_
        </button>
      </div>
    );
  }

  const currentChallenge = challenges[currentIndex];
  const shuffledOptions = currentChallenge ? [currentChallenge.correct, currentChallenge.wrong].sort((a, b) => a.localeCompare(b)) : [];

  return (
    <div className={`flex flex-col space-y-8 max-w-4xl mx-auto transition-transform duration-75 ${shake ? 'translate-x-1 -translate-y-1' : ''}`}>
      
      {/* 3D-ish Perspective Racing Track */}
      <div className="relative h-80 bg-[#0a2e21] rounded-[2.5rem] p-6 shadow-2xl border-4 border-emerald-500/20 overflow-hidden perspective-1000">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(34,197,94,0.1)_100%)] pointer-events-none"></div>
        
        {/* The Grid / Road */}
        <div className="absolute inset-0 flex flex-col justify-around opacity-20 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[2px] w-full bg-emerald-500/40 shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
          ))}
        </div>

        {/* Speed Lines effect when fast */}
        {userSpeed > 5 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="absolute h-px bg-emerald-400/40 w-24 animate-speedLine"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `-100px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        )}

        <div className="relative h-full flex flex-col justify-around py-4">
          {/* Opponents */}
          {opponents.map((opp) => (
            <div key={opp.id} className="relative h-10 w-full">
              <div 
                className="absolute top-0 flex flex-col items-center transition-all duration-100 ease-linear"
                style={{ left: `${(opp.progress / 1000) * 85}%` }}
              >
                <div 
                  className="w-16 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-lg border-2"
                  style={{ backgroundColor: `${opp.color}33`, borderColor: opp.color, color: opp.color }}
                >
                  <i className="fas fa-car-side"></i>
                </div>
                <span className="text-[8px] tech-font uppercase font-bold opacity-40 mt-1" style={{ color: opp.color }}>{opp.name}</span>
              </div>
            </div>
          ))}

          {/* User Car */}
          <div className="relative h-12 w-full">
            <div 
              className="absolute top-0 flex flex-col items-center transition-all duration-100 ease-linear z-30"
              style={{ left: `${(userProgress / 1000) * 85}%` }}
            >
              <div className="relative">
                <div className="w-20 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-black text-xl shadow-[0_0_25px_rgba(34,197,94,0.6)] border-2 border-white">
                  <i className="fas fa-rocket transform -rotate-45"></i>
                </div>
                {userSpeed > 6 && (
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex space-x-1 animate-pulse">
                    <div className="w-4 h-1 bg-orange-500 rounded-full blur-[2px]"></div>
                    <div className="w-2 h-1 bg-yellow-400 rounded-full blur-[1px]"></div>
                  </div>
                )}
                {feedback === 'hit' && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-black font-black text-[10px] py-1 px-2 rounded tech-font animate-bounce uppercase">
                    Critical_Boost!
                  </div>
                )}
              </div>
              <span className="text-[10px] tech-font uppercase font-black text-white mt-1 drop-shadow-md">YOU</span>
            </div>
          </div>
        </div>

        {/* HUD Overlay */}
        <div className="absolute top-4 right-6 flex items-center space-x-6 tech-font">
           <div className="text-right">
              <p className="text-[10px] text-emerald-400/50 uppercase font-bold">Velocity</p>
              <p className="text-2xl font-black text-white">{(userSpeed * 25).toFixed(0)} <span className="text-xs text-emerald-400">GHZ</span></p>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-emerald-400/50 uppercase font-bold">Progress</p>
              <p className="text-2xl font-black text-white">{(userProgress / 10).toFixed(1)}%</p>
           </div>
        </div>
      </div>

      {/* Control / Question Panel */}
      {gameState === 'countdown' ? (
        <div className="bg-[#0a2e21] rounded-[2rem] p-12 text-center border-4 border-emerald-500/20">
          <p className="tech-font text-emerald-400 uppercase tracking-[0.4em] text-sm mb-4">Neural Link Establishing...</p>
          <div className="text-9xl font-black text-white animate-ping">
            {countdown}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Question Display */}
          <div className="md:col-span-1 bg-white/5 p-8 rounded-[2rem] border-2 border-white/5 flex flex-col justify-center text-center">
            <p className="text-emerald-400/50 tech-font text-[10px] uppercase font-bold mb-4">Translate to {language}:</p>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
              {currentChallenge?.prompt}
            </h3>
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse w-full"></div>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shuffledOptions.map((opt, i) => (
              <button
                key={i}
                disabled={feedback !== null}
                onClick={() => handleAnswer(opt === currentChallenge.correct)}
                className={`
                  group relative py-8 px-6 rounded-[2rem] text-xl font-black transition-all active:scale-95 shadow-xl border-b-8 tech-font
                  ${feedback && opt === currentChallenge.correct 
                    ? 'bg-emerald-500 border-emerald-700 text-black scale-105' 
                    : feedback && opt !== currentChallenge.correct && feedback === 'miss'
                    ? 'bg-rose-500 border-rose-700 text-white'
                    : 'bg-white/5 text-white border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30'}
                `}
              >
                <div className="absolute top-4 left-6 text-[10px] opacity-20 group-hover:opacity-40 uppercase">Option_{String.fromCharCode(65 + i)}</div>
                {opt}
                {feedback === 'hit' && opt === currentChallenge.correct && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-[1.8rem]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Global CSS for speed lines */}
      <style>{`
        @keyframes speedLine {
          from { transform: translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          to { transform: translateX(1200px); opacity: 0; }
        }
        .animate-speedLine {
          animation: speedLine linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default RacingGame;
