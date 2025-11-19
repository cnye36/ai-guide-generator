import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/app.store';
import { exportService, ExportOptions } from '../services/export.service';

export const ExportMenu: React.FC = () => {
  const { generatedGuide } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeMetadata: true,
    includeSources: true,
    includeOutline: true,
  });

  if (!generatedGuide) {
    return null;
  }

  const handleCopy = async (format: 'markdown' | 'html' | 'plain') => {
    setIsCopying(true);
    try {
      await exportService.copyGuide(generatedGuide, format, exportOptions);
      toast.success(`Guide copied to clipboard as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to copy guide');
    } finally {
      setIsCopying(false);
    }
  };

  const handleExport = (format: 'markdown' | 'html' | 'json') => {
    setIsExporting(true);
    try {
      exportService.exportGuide(generatedGuide, format, exportOptions);
      toast.success(`Guide exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export guide');
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 rounded-lg font-semibold text-purple-600 border-2 border-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
      >
        <svg
          className="w-5 h-5"
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
        <span>📥 Export / Copy</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-4">
            {/* Options */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Include:</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        includeMetadata: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Metadata</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeOutline}
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        includeOutline: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Outline</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeSources}
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        includeSources: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Sources</span>
                </label>
              </div>
            </div>

            {/* Copy Section */}
            <div className="border-t border-gray-200 pt-3">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Copy to Clipboard:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCopy('markdown')}
                  disabled={isCopying}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Markdown
                </button>
                <button
                  onClick={() => handleCopy('html')}
                  disabled={isCopying}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  HTML
                </button>
                <button
                  onClick={() => handleCopy('plain')}
                  disabled={isCopying}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Plain
                </button>
              </div>
            </div>

            {/* Export Section */}
            <div className="border-t border-gray-200 pt-3">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Download:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleExport('markdown')}
                  disabled={isExporting}
                  className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  .md
                </button>
                <button
                  onClick={() => handleExport('html')}
                  disabled={isExporting}
                  className="px-3 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  .html
                </button>
                <button
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                  className="px-3 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  .json
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

