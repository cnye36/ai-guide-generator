import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/app.store';
import { apiService } from '../services/api.service';
import { GeneratedGuide } from '@guide-generator/shared';

export const GuidesSidebar: React.FC = () => {
  const {
    guides,
    selectedGuideId,
    isLoadingGuides,
    setIsLoadingGuides,
    setGuides,
    selectGuide,
    removeGuide,
    setError,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Load guides on mount
  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    setIsLoadingGuides(true);
    try {
      const loadedGuides = await apiService.getAllGuides();
      setGuides(loadedGuides);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load guides');
    } finally {
      setIsLoadingGuides(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this guide?')) {
      return;
    }

    setIsDeleting(id);
    try {
      await apiService.deleteGuide(id);
      removeGuide(id);
      toast.success('Guide deleted successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete guide';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredGuides = guides.filter(guide => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      guide.title.toLowerCase().includes(query) ||
      guide.topic.toLowerCase().includes(query) ||
      guide.content.toLowerCase().includes(query)
    );
  });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return d.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Your Guides</h2>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Guides List */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingGuides ? (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading guides...</p>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="p-4 text-center">
            {searchQuery ? (
              <>
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">No guides match your search</p>
              </>
            ) : (
              <>
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
                <p className="mt-2 text-sm text-gray-600">No guides yet</p>
                <p className="text-xs text-gray-500">Create your first guide to get started</p>
              </>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => selectGuide(guide.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedGuideId === guide.id
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 truncate">
                      {guide.topic}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                      <span>{guide.metadata.wordCount} words</span>
                      <span>•</span>
                      <span>{formatDate(guide.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(guide.id, e)}
                    disabled={isDeleting === guide.id}
                    className={`ml-2 p-1 rounded hover:bg-red-100 transition-colors ${
                      isDeleting === guide.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Delete guide"
                  >
                    {isDeleting === guide.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        {guides.length} {guides.length === 1 ? 'guide' : 'guides'}
      </div>
    </div>
  );
};

