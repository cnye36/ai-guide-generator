import { create } from 'zustand';
import { GuidePreferences, GeneratedGuide } from '@guide-generator/shared';

interface AppState {
  // Input state
  topic: string;
  preferences: GuidePreferences;

  // Generation state
  isGenerating: boolean;
  currentStage: string;
  progress: number;

  // Results
  generatedGuide: GeneratedGuide | null;
  error: string | null;

  // Actions
  setTopic: (topic: string) => void;
  setPreferences: (preferences: Partial<GuidePreferences>) => void;
  setGenerating: (isGenerating: boolean) => void;
  setCurrentStage: (stage: string) => void;
  setProgress: (progress: number) => void;
  setGeneratedGuide: (guide: GeneratedGuide | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultPreferences: GuidePreferences = {
  depth: 'standard',
  audience: 'intermediate',
  style: 'tutorial',
  length: 'medium',
  images: 'without-images',
  format: 'blog-post',
  tone: 'conversational',
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  topic: '',
  preferences: defaultPreferences,
  isGenerating: false,
  currentStage: '',
  progress: 0,
  generatedGuide: null,
  error: null,

  // Actions
  setTopic: (topic) => set({ topic }),
  
  setPreferences: (preferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...preferences },
    })),

  setGenerating: (isGenerating) => set({ isGenerating }),
  
  setCurrentStage: (currentStage) => set({ currentStage }),
  
  setProgress: (progress) => set({ progress }),
  
  setGeneratedGuide: (generatedGuide) => set({ generatedGuide }),
  
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      topic: '',
      preferences: defaultPreferences,
      isGenerating: false,
      currentStage: '',
      progress: 0,
      generatedGuide: null,
      error: null,
    }),
}));
