
import React, { useState, useEffect } from 'react';
import { generateReadingContent } from '../services/geminiService';
import { Language } from '../types';

interface LibraryReaderProps {
  language: Language;
  interests: string[];
  onCorrect: (xp: number) => void;
}

const LibraryReader: React.FC<LibraryReaderProps> = ({ language, interests, onCorrect }) => {
  const [reading, setReading] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await generateReadingContent(language, interests);
        setReading(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [language, interests]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-amber-100 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-amber-100 text-amber-800 text-xs font-bold uppercase py-1 px-3 rounded-full inline-block mb-3">
          Daily Story
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
          {reading?.title}
        </h2>
      </div>

      <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed text-lg mb-8">
        {reading?.content.split('\n').map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </div>

      <div className="flex justify-center border-t border-amber-50 pt-8">
        <button
          onClick={() => onCorrect(15)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg hover:-translate-y-1 active:scale-95 flex items-center"
        >
          <i className="fas fa-check-circle mr-2"></i>
          I've Read This! (+15 XP)
        </button>
      </div>
    </div>
  );
};

export default LibraryReader;
