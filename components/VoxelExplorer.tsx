
import React, { useState, useEffect } from 'react';
import { generateVoxelItems } from '../services/geminiService';
import { Language, VoxelItem } from '../types';

interface VoxelExplorerProps {
  language: Language;
  interests: string[];
  onCorrect: (xp: number) => void;
}

const VoxelExplorer: React.FC<VoxelExplorerProps> = ({ language, interests, onCorrect }) => {
  const [items, setItems] = useState<VoxelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetItem, setTargetItem] = useState<VoxelItem | null>(null);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const data = await generateVoxelItems(language, interests);
        setItems(data);
        setTargetItem(data[Math.floor(Math.random() * data.length)]);
      } catch (error) {
        console.error("Failed to load voxel items", error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [language, interests]);

  const handleBoxClick = (item: VoxelItem) => {
    if (targetItem && item.id === targetItem.id) {
      onCorrect(20);
      setFoundCount(prev => prev + 1);
      // Pick next target
      const remaining = items.filter(i => i.id !== item.id);
      if (remaining.length > 0) {
        setTargetItem(remaining[Math.floor(Math.random() * remaining.length)]);
      } else {
        setTargetItem(null);
      }
      // Visual feedback handled by state change
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="text-gray-600 font-medium animate-pulse">Building your voxel world...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-indigo-100 h-full flex flex-col">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">Voxel Word Explorer</h2>
        <div className="bg-indigo-50 inline-block px-6 py-3 rounded-2xl border-2 border-indigo-200">
          <p className="text-sm text-indigo-600 font-bold uppercase tracking-wider">Find the item for:</p>
          <p className="text-3xl font-extrabold text-indigo-900 mt-1">
            {targetItem ? targetItem.translation : "World Explored! 🎉"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleBoxClick(item)}
              className={`
                group relative aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-4xl
                transition-all duration-300 transform hover:scale-110 hover:-translate-y-2
                active:scale-95 shadow-md border-b-4 border-slate-300
                ${targetItem?.id === item.id ? 'hover:border-indigo-400' : ''}
              `}
            >
              <span className="z-10">{item.emoji}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-black/5 rounded-full" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-indigo-900">
        <div className="flex items-center space-x-2">
          <i className="fas fa-trophy text-amber-500"></i>
          <span className="font-bold">Found: {foundCount} / {items.length}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm font-semibold hover:underline"
        >
          Generate New World
        </button>
      </div>
    </div>
  );
};

export default VoxelExplorer;
