
import React, { useState, useEffect } from 'react';
import { UserProfile, Language } from './types';
import { INTEREST_OPTIONS, INITIAL_PROFILE } from './constants';
import VoxelExplorer from './components/VoxelExplorer';
import ConversationMaster from './components/ConversationMaster';
import QuizChallenge from './components/QuizChallenge';
import LibraryReader from './components/LibraryReader';
import RacingGame from './components/RacingGame';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lingovoxel_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new fields exist even in old saved data
      return { ...INITIAL_PROFILE, ...parsed };
    }
    return INITIAL_PROFILE;
  });
  
  const [view, setView] = useState<'welcome' | 'interests' | 'specifics' | 'dashboard' | 'game_voxel' | 'game_chat' | 'game_quiz' | 'game_library' | 'game_racing'>('welcome');
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
      <div className="min-h-screen bg-[#051611] flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent)]" />
        <div className="scanline" />
        
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-3xl flex items-center justify-center text-5xl text-emerald-400 neon-pulse border border-emerald-500/50">
            <i className="fas fa-microchip"></i>
          </div>
          <div className="absolute -top-4 -right-4 bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-lg tech-font">
            AI v2.0
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-emerald-400 uppercase">
          LINGO<span className="text-white">VOXEL</span>
        </h1>
        <p className="text-lg md:text-xl text-emerald-100/60 mb-12 max-w-lg mx-auto tech-font uppercase">
          // NEURAL LANGUAGE PROTOCOL ACTIVATED<br/>
          // CHOOSE TARGET IDIOM
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button 
            onClick={() => { setLanguage('english'); setView('interests'); }}
            className="group cyber-card p-8 rounded-3xl text-left hover:scale-105 transition-all active:scale-95 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <img src="https://flagcdn.com/us.svg" className="w-12 rounded shadow-lg" alt="US" />
              <i className="fas fa-terminal text-emerald-500/30"></i>
            </div>
            <h3 className="text-2xl font-bold mb-1">ENGLISH</h3>
            <p className="text-sm text-emerald-400/60 tech-font">protocol_en_us.sys</p>
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-emerald-500 transition-all duration-500" />
          </button>

          <button 
            onClick={() => { setLanguage('spanish'); setView('interests'); }}
            className="group cyber-card p-8 rounded-3xl text-left hover:scale-105 transition-all active:scale-95 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <img src="https://flagcdn.com/es.svg" className="w-12 rounded shadow-lg" alt="ES" />
              <i className="fas fa-terminal text-emerald-500/30"></i>
            </div>
            <h3 className="text-2xl font-bold mb-1">SPANISH</h3>
            <p className="text-sm text-emerald-400/60 tech-font">protocol_es_es.sys</p>
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-emerald-500 transition-all duration-500" />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'interests') {
    return (
      <div className="min-h-screen bg-[#051611] p-6 md:p-12 text-white relative">
        <div className="scanline opacity-20" />
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-emerald-400 mb-2 uppercase">NEURAL MAPPING</h2>
            <p className="text-emerald-100/40 tech-font uppercase tracking-widest text-sm">Select areas of cognitive interest</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleInterest(opt.id)}
                className={`
                  p-6 rounded-[2rem] flex flex-col items-center justify-center space-y-4 transition-all duration-300 border-2 tech-font
                  ${profile.interests.includes(opt.id) 
                    ? `bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-105` 
                    : 'bg-white/5 text-emerald-500/40 border-emerald-500/10 hover:border-emerald-500/30'}
                `}
              >
                <i className={`fas ${opt.icon} text-3xl`}></i>
                <span className="font-bold text-xs uppercase tracking-tighter">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              disabled={profile.interests.length === 0}
              onClick={() => setView('specifics')}
              className={`
                px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 tech-font
                ${profile.interests.length > 0 
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400' 
                  : 'bg-white/10 text-white/20 cursor-not-allowed'}
              `}
            >
              INITIALIZE SYNC_
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'specifics') {
    return (
      <div className="min-h-screen bg-[#051611] p-6 md:p-12 flex items-center justify-center text-white">
        <div className="max-w-xl w-full cyber-card rounded-[2.5rem] p-10 border-emerald-500/30">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
              <i className="fas fa-fingerprint animate-pulse"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-emerald-400 uppercase">Personalized Feed</h2>
              <p className="text-emerald-100/40 text-xs tech-font">Tailoring AI models to your niche passions.</p>
            </div>
          </div>
          
          <p className="text-emerald-100/60 mb-6 font-medium">What exactly drives you? Be specific (e.g., MMA, Quantum Physics, Vegan Baking, Cyberpunk Architecture...)</p>
          <input 
            type="text" 
            value={profile.specificInterests}
            onChange={(e) => setProfile(p => ({ ...p, specificInterests: e.target.value }))}
            placeholder="Type your passions..."
            className="w-full bg-black/40 border-2 border-emerald-500/20 rounded-2xl px-6 py-5 text-xl font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 transition-all mb-8 tech-font placeholder:text-emerald-900"
          />
          <button
            onClick={() => setView('dashboard')}
            className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl text-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:bg-emerald-400 transition-all active:scale-95 tech-font uppercase"
          >
            CONFIRM PROTOCOL_
          </button>
        </div>
      </div>
    );
  }

  const renderCurrentGame = () => {
    const specificParam = profile.specificInterests || profile.interests.join(", ");
    switch(view) {
      case 'game_voxel': return <VoxelExplorer language={profile.targetLanguage} interests={profile.interests} onCorrect={addXp} specificInterests={specificParam} />;
      case 'game_chat': return <ConversationMaster language={profile.targetLanguage} interests={profile.interests} onCorrect={addXp} />;
      case 'game_quiz': return <QuizChallenge language={profile.targetLanguage} interests={profile.interests} onCorrect={addXp} specificInterests={specificParam} />;
      case 'game_library': return <LibraryReader language={profile.targetLanguage} interests={profile.interests} onCorrect={addXp} specificInterests={specificParam} />;
      case 'game_racing': return <RacingGame language={profile.targetLanguage} specificInterests={specificParam} onFinish={addXp} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#051611] pb-20 text-emerald-100">
      <header className="bg-[#0a2e21]/80 backdrop-blur-md border-b border-emerald-500/20 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => setView('dashboard')} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <i className="fas fa-cube"></i>
            </div>
            <span className="font-black text-2xl tracking-tighter text-white hidden md:block uppercase">Lingo<span className="text-emerald-400">Voxel</span></span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 relative tech-font">
              <i className="fas fa-bolt text-emerald-400"></i>
              <span className="font-bold text-emerald-400">{profile.xp} XP</span>
              {showXpAnim && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-emerald-400 font-black animate-bounce">
                  +XP
                </span>
              )}
            </div>
            <button onClick={() => setView('interests')} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 border border-white/5">
              <i className="fas fa-cog text-emerald-400/60"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {view === 'dashboard' ? (
          <div>
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-black text-white mb-2 uppercase">SYSTEM_ACTIVE: {profile.specificInterests.split(' ')[0] || 'User'}</h1>
                <p className="text-emerald-400/60 tech-font uppercase text-xs">Awaiting cognitive input...</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {profile.interests.map(i => (
                  <span key={i} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tech-font tracking-widest">{i}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* PRIMARY ACTION: CYBER RACE */}
              <button 
                onClick={() => setView('game_racing')}
                className="group isometric-card bg-[#0a2e21] border-2 border-emerald-400 p-8 rounded-[2rem] text-left text-white shadow-[0_0_30px_rgba(34,197,94,0.2)] flex flex-col h-[360px] justify-between relative overflow-hidden md:col-span-2 lg:col-span-1"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-emerald-500 text-black rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-[0_0_30px_rgba(34,197,94,0.6)]">
                    <i className="fas fa-flag-checkered animate-pulse"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Passion Race</h3>
                  <p className="text-emerald-200/60 font-medium text-lg tech-font uppercase leading-tight">// EXECUTE HIGH-SPEED TRANSLATION ON: {profile.specificInterests || 'GENERAL'}</p>
                </div>
                <div className="z-10 flex items-center font-black text-xs uppercase tech-font bg-emerald-500 text-black w-fit px-6 py-3 rounded-full shadow-lg group-hover:scale-105 transition-transform">
                  Launch Race_ <i className="fas fa-bolt ml-2 animate-pulse text-black/50"></i>
                </div>
                <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:opacity-20 transition-opacity">
                  <i className="fas fa-tachometer-alt text-[200px]"></i>
                </div>
              </button>

              <button 
                onClick={() => setView('game_voxel')}
                className="group isometric-card cyber-card p-8 rounded-[2rem] text-left text-white flex flex-col h-[360px] justify-between relative overflow-hidden"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 text-emerald-400 border border-emerald-500/20">
                    <i className="fas fa-cube"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Voxel Scan</h3>
                  <p className="text-emerald-100/40 font-medium text-lg tech-font uppercase">Visual translation matrix.</p>
                </div>
                <div className="z-10 flex items-center font-black text-xs uppercase tech-font bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20">
                  Enter Voxel_
                </div>
              </button>

              <button 
                onClick={() => setView('game_chat')}
                className="group isometric-card bg-rose-900/40 border-2 border-rose-500/20 p-8 rounded-[2rem] text-left text-white flex flex-col h-[360px] justify-between relative overflow-hidden"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                    <i className="fas fa-robot"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Neural Chat</h3>
                  <p className="text-rose-100/40 font-medium text-lg tech-font uppercase">Adaptive NLP training.</p>
                </div>
                <div className="z-10 flex items-center font-black text-xs uppercase tech-font bg-rose-500 text-white w-fit px-4 py-2 rounded-full">
                  Initialize Link_
                </div>
              </button>

              <button 
                onClick={() => setView('game_quiz')}
                className="group isometric-card bg-indigo-900/40 border-2 border-indigo-500/20 p-8 rounded-[2rem] text-left text-white flex flex-col h-[360px] justify-between relative overflow-hidden"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-6">
                    <i className="fas fa-brain"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Logic Probe</h3>
                  <p className="text-indigo-100/40 font-medium text-lg tech-font uppercase">Verification modules.</p>
                </div>
                <div className="z-10 flex items-center font-black text-xs uppercase tech-font bg-indigo-500 text-white w-fit px-4 py-2 rounded-full">
                  Run Test_
                </div>
              </button>

              <button 
                onClick={() => setView('game_library')}
                className="group isometric-card bg-amber-900/40 border-2 border-amber-500/20 p-8 rounded-[2rem] text-left text-white flex flex-col h-[360px] justify-between relative overflow-hidden"
              >
                <div className="z-10">
                  <div className="w-16 h-16 bg-amber-500 text-black rounded-2xl flex items-center justify-center text-3xl mb-6">
                    <i className="fas fa-database"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Core Data</h3>
                  <p className="text-amber-100/40 font-medium text-lg tech-font uppercase">Information ingestion.</p>
                </div>
                <div className="z-10 flex items-center font-black text-xs uppercase tech-font bg-amber-500 text-black w-fit px-4 py-2 rounded-full">
                  Access DB_
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <button 
              onClick={() => setView('dashboard')}
              className="mb-6 flex items-center text-emerald-400/60 font-bold hover:text-emerald-400 transition-colors tech-font uppercase text-xs"
            >
              <i className="fas fa-arrow-left mr-2"></i> Return to Terminal
            </button>
            <div className="pb-12">
              {renderCurrentGame()}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-4 shadow-2xl flex justify-around items-center z-50">
        <button onClick={() => setView('dashboard')} className={`text-2xl ${view === 'dashboard' ? 'text-emerald-400' : 'text-emerald-900'}`}>
          <i className="fas fa-th-large"></i>
        </button>
        <button onClick={() => setView('game_racing')} className={`text-2xl ${view === 'game_racing' ? 'text-emerald-400' : 'text-emerald-900'}`}>
          <i className="fas fa-flag-checkered"></i>
        </button>
        <button onClick={() => setView('game_chat')} className={`text-2xl ${view === 'game_chat' ? 'text-rose-500' : 'text-emerald-900'}`}>
          <i className="fas fa-robot"></i>
        </button>
      </nav>
    </div>
  );
};

export default App;
