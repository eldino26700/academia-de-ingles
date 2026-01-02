
export const INTEREST_OPTIONS = [
  { id: 'tech', label: 'Technology', icon: 'fa-laptop-code', color: 'bg-blue-500' },
  { id: 'cooking', label: 'Cooking', icon: 'fa-utensils', color: 'bg-orange-500' },
  { id: 'travel', label: 'Travel', icon: 'fa-plane', color: 'bg-green-500' },
  { id: 'sports', label: 'Sports', icon: 'fa-football', color: 'bg-red-500' },
  { id: 'music', label: 'Music', icon: 'fa-music', color: 'bg-purple-500' },
  { id: 'art', label: 'Art', icon: 'fa-palette', color: 'bg-pink-500' },
  { id: 'science', label: 'Science', icon: 'fa-microscope', color: 'bg-indigo-500' },
  { id: 'history', label: 'History', icon: 'fa-landmark', color: 'bg-amber-600' },
];

export const INITIAL_PROFILE = {
  targetLanguage: 'english' as const,
  interests: [],
  level: 'beginner' as const,
  xp: 0,
  streak: 0,
};
