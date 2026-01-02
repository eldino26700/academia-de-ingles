
import { GoogleGenAI, Type } from "@google/genai";
import { Language, QuizQuestion, VoxelItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuiz = async (language: Language, interests: string[]): Promise<QuizQuestion[]> => {
  const prompt = `Generate a 5-question multiple choice quiz to learn ${language}. The theme should be about ${interests.join(", ")}. 
  Each question should have a 'question', 4 'options', a 'correctAnswer' (one of the options), and a short 'explanation' in the user's native language (if target is English, native is Spanish, and vice-versa).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });

  return JSON.parse(response.text);
};

export const generateVoxelItems = async (language: Language, interests: string[]): Promise<VoxelItem[]> => {
  const prompt = `Provide 12 vocabulary items related to ${interests.join(", ")} for a language learner learning ${language}. 
  Each item should have an 'id', 'name' (the word in ${language}), 'translation' (the word in ${language === 'english' ? 'Spanish' : 'English'}), and a relevant emoji.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            translation: { type: Type.STRING },
            emoji: { type: Type.STRING },
          },
          required: ["id", "name", "translation", "emoji"],
        },
      },
    },
  });

  return JSON.parse(response.text);
};

export const generateReadingContent = async (language: Language, interests: string[]): Promise<{ title: string; content: string }> => {
  const prompt = `Write a short, engaging story or article (around 200 words) in ${language} about ${interests.join(" and ")}. 
  Make it suitable for a language learner. Format as JSON with 'title' and 'content' fields.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
      },
    },
  });

  return JSON.parse(response.text);
};
