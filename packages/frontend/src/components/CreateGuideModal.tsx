import React from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/app.store';
import { InputForm } from './InputForm';
import { ControlPanel } from './ControlPanel';

interface CreateGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGuideModal: React.FC<CreateGuideModalProps> = ({ isOpen, onClose }) => {
  const { startNewGuide } = useAppStore();

  // Reset form state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      startNewGuide();
    }
  }, [isOpen, startNewGuide]);

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="text-2xl font-bold text-white">Create New Guide</h2>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <InputForm />
              <ControlPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

