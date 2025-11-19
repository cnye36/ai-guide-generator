import React from 'react';
import toast from "react-hot-toast";
import { useAppStore } from "../store/app.store";
import { apiService } from "../services/api.service";

export const ControlPanel: React.FC = () => {
  const {
    topic,
    preferences,
    isGenerating,
    generatedGuide,
    setGenerating,
    setCurrentStage,
    setProgress,
    setGeneratedGuide,
    setError,
    setGuides,
    setIsLoadingGuides,
    setIsViewingGuide,
    setCreateModalOpen,
  } = useAppStore();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setGenerating(true);
    setError(null);
    setProgress(0);

    try {
      setCurrentStage("Researching topic...");
      setProgress(20);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const currentProgress = useAppStore.getState().progress;
        setProgress(Math.min(currentProgress + 10, 90));
      }, 2000);

      const guide = await apiService.generateGuide({
        topic,
        preferences,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStage("Complete!");

      setTimeout(() => {
        setGeneratedGuide(guide);
        setGenerating(false);
        setIsViewingGuide(true);
        setCreateModalOpen(false); // Close modal after generation
        toast.success("Guide generated successfully!");
        // Reload guides list to include the new guide
        setIsLoadingGuides(true);
        apiService
          .getAllGuides()
          .then((guides) => {
            setGuides(guides);
            setIsLoadingGuides(false);
          })
          .catch((error) => {
            const errorMsg =
              error instanceof Error ? error.message : "Failed to load guides";
            setError(errorMsg);
            toast.error(errorMsg);
            setIsLoadingGuides(false);
          });
      }, 500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate guide"
      );
      setGenerating(false);
      setProgress(0);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>

      <div className="space-y-3">
        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            isGenerating || !topic.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {isGenerating ? "Generating..." : "✨ Generate Guide"}
        </button>
      </div>

      {/* Info Cards */}
      <div className="mt-6 space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific with your topic</li>
            <li>• Choose appropriate audience level</li>
            <li>• Generation takes 30-60 seconds</li>
          </ul>
        </div>

        {generatedGuide && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">
              📊 Guide Stats
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• {generatedGuide.outline.length} sections</li>
              <li>• {generatedGuide.sources.length} sources</li>
              <li>• {generatedGuide.preferences.tone} tone</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
