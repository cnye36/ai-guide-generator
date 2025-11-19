import React from 'react';
import { useAppStore } from '../store/app.store';
import { apiService } from '../services/api.service';

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
    reset,
  } = useAppStore();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setGenerating(true);
    setError(null);
    setProgress(0);

    try {
      setCurrentStage('Researching topic...');
      setProgress(20);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 2000);

      const guide = await apiService.generateGuide({
        topic,
        preferences,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStage('Complete!');

      setTimeout(() => {
        setGeneratedGuide(guide);
        setGenerating(false);
      }, 500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to generate guide'
      );
      setGenerating(false);
      setProgress(0);
    }
  };

  const handleCopyMarkdown = () => {
    if (generatedGuide) {
      navigator.clipboard.writeText(generatedGuide.content);
      alert('Guide copied to clipboard!');
    }
  };

  const handleExportHTML = () => {
    if (generatedGuide) {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${generatedGuide.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  <h1>${generatedGuide.title}</h1>
  <p><em>${generatedGuide.metadata.wordCount} words • ${generatedGuide.metadata.readingTime} min read</em></p>
  ${generatedGuide.content.replace(/\n/g, '<br>')}
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedGuide.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
      a.click();
      URL.revokeObjectURL(url);
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
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isGenerating ? 'Generating...' : '✨ Generate Guide'}
        </button>

        {/* Export Buttons */}
        {generatedGuide && !isGenerating && (
          <>
            <button
              onClick={handleCopyMarkdown}
              className="w-full px-6 py-3 rounded-lg font-semibold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              📋 Copy Markdown
            </button>

            <button
              onClick={handleExportHTML}
              className="w-full px-6 py-3 rounded-lg font-semibold text-green-600 border-2 border-green-600 hover:bg-green-50 transition-colors"
            >
              📄 Export HTML
            </button>

            <button
              onClick={reset}
              className="w-full px-6 py-3 rounded-lg font-semibold text-gray-600 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              🔄 Start New Guide
            </button>
          </>
        )}
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
            <h4 className="font-semibold text-green-900 mb-2">📊 Guide Stats</h4>
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
