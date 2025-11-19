import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useAppStore } from '../store/app.store';

export const GuidePreview: React.FC = () => {
  const { generatedGuide, isGenerating, currentStage, progress } = useAppStore();

  if (isGenerating) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentStage || 'Generating your guide...'}
            </h3>
            <div className="w-64 bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{progress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedGuide) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No guide yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter a topic and click "Generate Guide" to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">{generatedGuide.title}</h2>
        <div className="flex items-center space-x-4 mt-2 text-blue-100 text-sm">
          <span>📖 {generatedGuide.metadata.wordCount} words</span>
          <span>⏱️ {generatedGuide.metadata.readingTime} min read</span>
          <span>
            📅 {new Date(generatedGuide.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="markdown-content prose prose-lg max-w-none">
          <ReactMarkdown>{generatedGuide.content}</ReactMarkdown>
        </div>

        {/* Sources */}
        {generatedGuide.sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Sources</h3>
            <div className="space-y-2">
              {generatedGuide.sources.map((source, index) => (
                <div key={index} className="text-sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {index + 1}. {source.title}
                  </a>
                  <p className="text-gray-600 ml-4">{source.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
