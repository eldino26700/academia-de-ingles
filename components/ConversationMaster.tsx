
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language, ChatMessage } from '../types';

interface ConversationMasterProps {
  language: Language;
  interests: string[];
  onCorrect: (xp: number) => void;
}

const ConversationMaster: React.FC<ConversationMasterProps> = ({ language, interests, onCorrect }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm your language partner. Let's talk about ${interests.join(", ")} in ${language}. What's on your mind?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    onCorrect(5); // Reward for participation

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are a helpful and friendly language tutor. The user is learning ${language}. Keep the conversation interesting around the topics: ${interests.join(", ")}. If the user makes a mistake in ${language}, gently correct them. Respond in ${language} mostly, but use brief translations if the concept is complex.`,
        },
      });

      // Simple way for the demo: history consists of previous messages
      const response = await chat.sendMessage({ message: input });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm listening!" }]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-rose-100 flex flex-col h-[600px]">
      <div className="flex items-center space-x-3 mb-6 border-b-2 border-rose-50 pb-4">
        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-xl">
          <i className="fas fa-robot animate-bounce-slow"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Tutor Chat</h2>
          <p className="text-xs text-green-500 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Online
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium
              ${m.role === 'user' 
                ? 'bg-rose-500 text-white rounded-tr-none' 
                : 'bg-rose-50 text-gray-800 rounded-tl-none border border-rose-100'}
            `}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-rose-50 px-4 py-3 rounded-2xl rounded-tl-none border border-rose-100 animate-pulse text-rose-300">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Type in ${language}...`}
          className="flex-1 bg-gray-50 border-2 border-rose-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-rose-300 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-rose-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-colors active:scale-95 disabled:opacity-50"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ConversationMaster;
