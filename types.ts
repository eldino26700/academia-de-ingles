
export type Language = 'english' | 'spanish';

export interface UserProfile {
  targetLanguage: Language;
  interests: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  streak: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface VoxelItem {
  id: string;
  name: string; // Target language name
  translation: string; // Native language name
  icon: string;
  emoji: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
