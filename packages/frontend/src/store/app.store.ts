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

  // Guides management
  guides: GeneratedGuide[];
  selectedGuideId: string | null;
  isViewingGuide: boolean;
  isLoadingGuides: boolean;
  isCreateModalOpen: boolean;

  // Actions
  setTopic: (topic: string) => void;
  setPreferences: (preferences: Partial<GuidePreferences>) => void;
  setGenerating: (isGenerating: boolean) => void;
  setCurrentStage: (stage: string) => void;
  setProgress: (progress: number) => void;
  setGeneratedGuide: (guide: GeneratedGuide | null) => void;
  setError: (error: string | null) => void;

  // Guide management actions
  setGuides: (guides: GeneratedGuide[]) => void;
  setSelectedGuideId: (id: string | null) => void;
  setIsViewingGuide: (viewing: boolean) => void;
  setIsLoadingGuides: (loading: boolean) => void;
  setCreateModalOpen: (open: boolean) => void;
  selectGuide: (id: string) => void;
  startNewGuide: () => void;
  removeGuide: (id: string) => void;

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

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  topic: "",
  preferences: defaultPreferences,
  isGenerating: false,
  currentStage: "",
  progress: 0,
  generatedGuide: null,
  error: null,
  guides: [],
  selectedGuideId: null,
  isViewingGuide: false,
  isLoadingGuides: false,
  isCreateModalOpen: false,

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

  // Guide management actions
  setGuides: (guides) => set({ guides }),

  setSelectedGuideId: (id) => set({ selectedGuideId: id }),

  setIsViewingGuide: (viewing) => set({ isViewingGuide: viewing }),

  setIsLoadingGuides: (loading) => set({ isLoadingGuides: loading }),

  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  selectGuide: (id) => {
    const state = get();
    const guide = state.guides.find((g) => g.id === id);
    if (guide) {
      set({
        selectedGuideId: id,
        generatedGuide: guide,
        isViewingGuide: true,
      });
    }
  },

  startNewGuide: () => {
    set({
      topic: "",
      preferences: defaultPreferences,
      selectedGuideId: null,
      generatedGuide: null,
      isViewingGuide: false,
      error: null,
    });
  },

  removeGuide: (id) => {
    const state = get();
    const newGuides = state.guides.filter((g) => g.id !== id);
    set({ guides: newGuides });

    // If the removed guide was selected, clear selection
    if (state.selectedGuideId === id) {
      set({
        selectedGuideId: null,
        generatedGuide: null,
        isViewingGuide: false,
      });
    }
  },

  reset: () =>
    set({
      topic: "",
      preferences: defaultPreferences,
      isGenerating: false,
      currentStage: "",
      progress: 0,
      generatedGuide: null,
      error: null,
      selectedGuideId: null,
      isViewingGuide: false,
      isCreateModalOpen: false,
    }),
}));
