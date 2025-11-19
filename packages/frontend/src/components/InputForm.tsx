import React from 'react';
import { useAppStore } from '../store/app.store';

export const InputForm: React.FC = () => {
  const {
    topic,
    preferences,
    setTopic,
    setPreferences,
    isGenerating,
    isViewingGuide,
  } = useAppStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Create Your Guide</h2>
        <p className="text-gray-600 mb-4">
          Enter a topic and customize your guide preferences
        </p>
      </div>

      {/* Topic Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topic *
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., React Hooks, Machine Learning Basics, SEO Best Practices"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isGenerating}
        />
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Depth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Depth
          </label>
          <select
            value={preferences.depth}
            onChange={(e) => setPreferences({ depth: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || isViewingGuide}
          >
            <option value="quick">Quick Overview</option>
            <option value="standard">Standard</option>
            <option value="comprehensive">Comprehensive</option>
            <option value="deep-dive">Deep Dive</option>
          </select>
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audience Level
          </label>
          <select
            value={preferences.audience}
            onChange={(e) =>
              setPreferences({ audience: e.target.value as any })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || isViewingGuide}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <select
            value={preferences.style}
            onChange={(e) => setPreferences({ style: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || isViewingGuide}
          >
            <option value="tutorial">Tutorial (Step-by-step)</option>
            <option value="conceptual">Conceptual</option>
            <option value="practical">Practical/Hands-on</option>
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Length
          </label>
          <select
            value={preferences.length}
            onChange={(e) => setPreferences({ length: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || isViewingGuide}
          >
            <option value="short">Short (500-1000 words)</option>
            <option value="medium">Medium (1000-2000 words)</option>
            <option value="long">Long (2000+ words)</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <select
            value={preferences.format}
            onChange={(e) => setPreferences({ format: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || isViewingGuide}
          >
            <option value="blog-post">Blog Post</option>
            <option value="social-media">Social Media Thread</option>
            <option value="newsletter">Newsletter</option>
            <option value="documentation">Documentation</option>
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <select
            value={preferences.tone}
            onChange={(e) => setPreferences({ tone: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || isViewingGuide}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
            <option value="conversational">Conversational</option>
          </select>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Preference
        </label>
        <select
          value={preferences.images}
          onChange={(e) => setPreferences({ images: e.target.value as any })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isGenerating}
        >
          <option value="without-images">Without Images</option>
          <option value="with-sourced-images">With Sourced Images</option>
          <option value="with-ai-images">With AI-Generated Images</option>
        </select>
      </div>
    </div>
  );
};
