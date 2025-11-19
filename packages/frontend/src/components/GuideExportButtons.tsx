import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/app.store';
import { exportService } from '../services/export.service';

export const GuideExportButtons: React.FC = () => {
  const { generatedGuide } = useAppStore();
  const [isCopying, setIsCopying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!generatedGuide) {
    return null;
  }

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await exportService.copyGuide(generatedGuide, 'markdown', {
        includeMetadata: true,
        includeSources: true,
        includeOutline: true,
      });
      toast.success('Guide copied to clipboard!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to copy guide');
    } finally {
      setIsCopying(false);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportService.exportGuide(generatedGuide, 'markdown', {
        includeMetadata: true,
        includeSources: true,
        includeOutline: true,
      });
      toast.success('Guide exported!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export guide');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        disabled={isCopying}
        className="p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Copy guide to clipboard"
      >
        {isCopying ? (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export guide as Markdown"
      >
        {isExporting ? (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

