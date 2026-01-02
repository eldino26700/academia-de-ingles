
import React, { useState, useEffect } from 'react';
import { UserProfile, Language } from './types';
import { INTEREST_OPTIONS, INITIAL_PROFILE } from './constants';
import VoxelExplorer from './components/VoxelExplorer';
import ConversationMaster from './components/ConversationMaster';
import QuizChallenge from './components/QuizChallenge';
import LibraryReader from './components/LibraryReader';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lingovoxel_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });
  const [view, setView] = useState<'welcome' | 'interests' | 'dashboard' | 'game_voxel' | 'game_chat' | 'game_quiz' | 'game_library'>('welcome');
  const [showXpAnim, setShowXpAnim] = useState(false);

  useEffect(() => {
    localStorage.setItem('lingovoxel_profile', JSON.stringify(profile));
  }, [profile]);

  const addXp = (amount: number) => {
    setProfile(p => ({ ...p, xp: p.xp + amount }));
    setShowXpAnim(true);
    setTimeout(() => setShowXpAnim(false), 2000);
  };

  const toggleInterest = (id: string) => {
    setProfile(p => ({
      ...p,
      interests: p.interests.includes(id) 
        ? p.interests.filter(i => i !== id) 
        : [...p.interests, id]
    }));
  };

  const setLanguage = (lang: Language) => {
    setProfile(p => ({ ...p, targetLanguage: lang }));
  };

  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="mb-8 animate-bounce-slow">
          <div className="relative inline-block">
            <i className="fas fa-cube text-8xl text-indigo-200"></i>
            <i className="fas fa-language absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-white"></i>
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">LingoVoxel AI</h1>
        <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-lg mx-auto">
          Learn English or Spanish through play, discovery, and the magic of AI.
        </p>
        
        <div className="space-y-4 w-full max-w-sm">
          <button 
            onClick={() => { setLanguage('english'); setView('interests'); }}
            className="w-full bg-white text-indigo-600 font-bold py-5 rounded-2xl text-xl shadow-2xl hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center space-x-3"
          >
            <span>I want to learn <strong>English</strong></span>
            <img src="https://flagcdn.com/us.svg" className="w-8 rounded" alt="US Flag" />
          </button>
          <button 
            onClick={() => { setLanguage('spanish'); setView('interests'); }}
            className="w-full bg-indigo-700/30 backdrop-blur-md border-2 border-white/30 text-white font-bold py-5 rounded-2xl text-xl shadow-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center space-x-3"
          >
            <span>Quiero aprender <strong>Español</strong></span>
            <img src="https://flagcdn.com/es.svg" className="w-8 rounded" alt="Spain Flag" />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'interests') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">What interests you?</h2>
            <p className="text-slate-500 text-lg">We'll use AI to create personalized lessons based on your hobbies.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleInterest(opt.id)}
                className={`
                  p-6 rounded-3xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border-4
                  ${profile.interests.includes(opt.id) 
                    ? `${opt.color} text-white border-white shadow-xl scale-105` 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}
                `}
              >
                <i className={`fas ${opt.icon} text-3xl`}></i>
                <span className="font-bold">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              disabled={profile.interests.length === 0}
              onClick={() => setView('dashboard')}
              className={`
                px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95
                ${profile.interests.length > 0 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              `}
            >
              Start My Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentGame = () => {
    switch(view) {
      case 'game_voxel': return <VoxelExplorer language={profile.targetLanguage} interests={profile.interests} onCorrect={addXp} />;
      case 'game_chat': return <ConversationMaster language={profile.targetLanguage} interests={profile.interests} onCorrect={addXp} />;
      case 'game_quiz': return <QuizChallenge language={profile.targetLanguage} interests={profile.interests} onCorrect={addXp} />;
      case 'game_library': return <LibraryReader language={profile.targetLanguage} interests={profile.interests} onCorrect={addXp} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => setView('dashboard')} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-cube"></i>
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900 hidden md:block">LingoVoxel</span>
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 relative">
              <i className="fas fa-bolt text-amber-500"></i>
              <span className="font-bold text-indigo-900">{profile.xp} XP</span>
              {showXpAnim && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-green-500 font-black animate-bounce">
                  +XP!
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
              <i className="fas fa-fire text-orange-500"></i>
              <span className="font-bold text-orange-900">{profile.streak} Days</span>
            </div>
            <button onClick={() => setView('interests')} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
              <i className="fas fa-cog text-slate-600"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        {view === 'dashboard' ? (
          <div>
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome Back, Learner! 👋</h1>
              <p className="text-slate-500 font-medium">What's your learning focus today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Option 1: Voxel World */}
              <button 
                onClick={() => setView('game_voxel')}
                className="group isometric-card bg-indigo-500 p-8 rounded-[2rem] text-left text-white shadow-2xl hover:shadow-indigo-200/50 flex flex-col h-[320px] justify-between relative overflow-hidden"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6">
                    <i className="fas fa-cube"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2">Voxel World</h3>
                  <p className="text-indigo-100 font-medium text-lg leading-snug">Explore isometric scenes and discover new words.</p>
                </div>
                <div className="z-10 flex items-center font-black text-sm uppercase tracking-widest bg-white/20 w-fit px-4 py-2 rounded-full">
                  Play Now <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                </div>
                <i className="fas fa-cubes absolute -right-4 -bottom-4 text-9xl opacity-20 transform rotate-12"></i>
              </button>

              {/* Option 2: AI Chat */}
              <button 
                onClick={() => setView('game_chat')}
                className="group isometric-card bg-rose-500 p-8 rounded-[2rem] text-left text-white shadow-2xl hover:shadow-rose-200/50 flex flex-col h-[320px] justify-between relative overflow-hidden"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6">
                    <i className="fas fa-comment-dots"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2">AI Master</h3>
                  <p className="text-rose-100 font-medium text-lg leading-snug">Chat with your personalized AI language tutor.</p>
                </div>
                <div className="z-10 flex items-center font-black text-sm uppercase tracking-widest bg-white/20 w-fit px-4 py-2 rounded-full">
                  Practice <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                </div>
                <i className="fas fa-robot absolute -right-4 -bottom-4 text-9xl opacity-20 transform -rotate-12"></i>
              </button>

              {/* Option 3: Grammar Quest */}
              <button 
                onClick={() => setView('game_quiz')}
                className="group isometric-card bg-emerald-500 p-8 rounded-[2rem] text-left text-white shadow-2xl hover:shadow-emerald-200/50 flex flex-col h-[320px] justify-between relative overflow-hidden"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6">
                    <i className="fas fa-gamepad"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2">Grammar Quest</h3>
                  <p className="text-emerald-100 font-medium text-lg leading-snug">Master structures with fun interest-based quizzes.</p>
                </div>
                <div className="z-10 flex items-center font-black text-sm uppercase tracking-widest bg-white/20 w-fit px-4 py-2 rounded-full">
                  Challenge <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                </div>
                <i className="fas fa-puzzle-piece absolute -right-4 -bottom-4 text-9xl opacity-20 transform rotate-45"></i>
              </button>

              {/* Option 4: Library */}
              <button 
                onClick={() => setView('game_library')}
                className="group isometric-card bg-amber-500 p-8 rounded-[2rem] text-left text-white shadow-2xl hover:shadow-amber-200/50 flex flex-col h-[320px] justify-between relative overflow-hidden"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6">
                    <i className="fas fa-book-open"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2">The Library</h3>
                  <p className="text-amber-100 font-medium text-lg leading-snug">Read stories generated specifically for your hobbies.</p>
                </div>
                <div className="z-10 flex items-center font-black text-sm uppercase tracking-widest bg-white/20 w-fit px-4 py-2 rounded-full">
                  Read <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                </div>
                <i className="fas fa-scroll absolute -right-4 -bottom-4 text-9xl opacity-20 transform -rotate-6"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <button 
              onClick={() => setView('dashboard')}
              className="mb-6 flex items-center text-slate-500 font-bold hover:text-indigo-600 transition-colors"
            >
              <i className="fas fa-chevron-left mr-2"></i> Back to Dashboard
            </button>
            {renderCurrentGame()}
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-4 shadow-2xl flex justify-around items-center z-50">
        <button onClick={() => setView('dashboard')} className={`text-2xl ${view === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-th-large"></i>
        </button>
        <button onClick={() => setView('game_voxel')} className={`text-2xl ${view === 'game_voxel' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-cube"></i>
        </button>
        <button onClick={() => setView('game_chat')} className={`text-2xl ${view === 'game_chat' ? 'text-rose-500' : 'text-slate-400'}`}>
          <i className="fas fa-robot"></i>
        </button>
        <button onClick={() => setView('game_quiz')} className={`text-2xl ${view === 'game_quiz' ? 'text-emerald-500' : 'text-slate-400'}`}>
          <i className="fas fa-graduation-cap"></i>
        </button>
      </nav>
    </div>
  );
};

export default App;
