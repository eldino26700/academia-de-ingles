
import React, { useState, useEffect } from 'react';
import { generateVoxelItems } from '../services/geminiService';
import { Language, VoxelItem } from '../types';

interface VoxelExplorerProps {
  language: Language;
  interests: string[];
  specificInterests?: string;
  onCorrect: (xp: number) => void;
}

const VoxelExplorer: React.FC<VoxelExplorerProps> = ({ language, interests, specificInterests, onCorrect }) => {
  const [items, setItems] = useState<VoxelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetItem, setTargetItem] = useState<VoxelItem | null>(null);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const query = specificInterests || interests.join(", ");
        const data = await generateVoxelItems(language, query);
        setItems(data);
        if (data.length > 0) {
          setTargetItem(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (error) {
        console.error("Failed to load voxel items", error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [language, interests, specificInterests]);

  const handleBoxClick = (item: VoxelItem) => {
    if (targetItem && item.id === targetItem.id) {
      onCorrect(20);
      setFoundCount(prev => prev + 1);
      const remaining = items.filter(i => i.id !== item.id);
      if (remaining.length > 0) {
        setTargetItem(remaining[Math.floor(Math.random() * remaining.length)]);
      } else {
        setTargetItem(null);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <p className="text-emerald-400 font-medium animate-pulse tech-font uppercase">Initializing Voxel Matrix...</p>
    </div>
  );

  return (
    <div className="bg-[#0a2e21] rounded-[2rem] p-8 shadow-2xl border-4 border-emerald-500/20 h-full flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Voxel Object Scanner</h2>
        <div className="bg-emerald-500/10 inline-block px-8 py-4 rounded-2xl border border-emerald-500/30">
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest tech-font mb-1">Target Identified:</p>
          <p className="text-4xl font-black text-emerald-400 tech-font">
            {targetItem ? targetItem.translation.toUpperCase() : "GRID CLEAR!"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleBoxClick(item)}
              className={`
                group relative aspect-square bg-white/5 rounded-2xl flex flex-col items-center justify-center text-4xl
                transition-all duration-300 transform hover:scale-110 border-2 border-emerald-500/10 hover:border-emerald-500
                active:scale-95 shadow-lg
              `}
            >
              <span className="z-10 group-hover:scale-125 transition-transform">{item.emoji}</span>
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-opacity rounded-2xl" />
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-500/20 rounded-full" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center tech-font text-emerald-400 text-xs font-bold uppercase">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-emerald-500 ${foundCount > 0 ? 'animate-pulse' : ''}`} />
          <span>Extracted: {foundCount} / {items.length} units</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="hover:text-white transition-colors border-b border-emerald-500/30"
        >
          Re-Scan Network_
        </button>
      </div>
    </div>
  );
};

export default VoxelExplorer;
