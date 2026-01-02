
import React, { useState, useEffect } from 'react';
import { generateReadingContent } from '../services/geminiService';
import { Language } from '../types';

interface LibraryReaderProps {
  language: Language;
  interests: string[];
  specificInterests?: string;
  onCorrect: (xp: number) => void;
}

const LibraryReader: React.FC<LibraryReaderProps> = ({ language, interests, specificInterests, onCorrect }) => {
  const [reading, setReading] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const query = specificInterests || interests.join(", ");
        const data = await generateReadingContent(language, query);
        setReading(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [language, interests, specificInterests]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <p className="tech-font text-emerald-400 uppercase text-xs">Deciphering text streams...</p>
    </div>
  );

  return (
    <div className="bg-[#0a2e21] rounded-[2.5rem] p-10 shadow-2xl border-4 border-emerald-500/10 max-w-3xl mx-auto relative overflow-hidden">
      <div className="scanline opacity-10" />
      
      <div className="text-center mb-10">
        <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase py-1 px-4 rounded-full inline-block mb-4 border border-emerald-500/20 tech-font tracking-[0.2em]">
          Encrypted Data Stream
        </div>
        <h2 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter">
          {reading?.title}
        </h2>
      </div>

      <div className="text-emerald-100/80 leading-relaxed text-xl mb-12 tech-font">
        {reading?.content.split('\n').map((para, i) => (
          <p key={i} className="mb-6">{para}</p>
        ))}
      </div>

      <div className="flex justify-center border-t border-white/5 pt-10">
        <button
          onClick={() => onCorrect(15)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-12 py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 active:scale-95 flex items-center tech-font uppercase"
        >
          <i className="fas fa-check-double mr-3"></i>
          Ingestion Complete (+15 XP)
        </button>
      </div>
    </div>
  );
};

export default LibraryReader;
