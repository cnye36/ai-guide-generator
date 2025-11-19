import React, { useEffect } from 'react';
import toast from "react-hot-toast";
import { GuidePreview } from "./components/GuidePreview";
import { GuideChat } from "./components/GuideChat";
import { GuidesSidebar } from "./components/GuidesSidebar";
import { CreateGuideModal } from "./components/CreateGuideModal";
import { useAppStore } from './store/app.store';
import { apiService } from "./services/api.service";

function App() {
  const {
    error,
    setError,
    isViewingGuide,
    generatedGuide,
    isCreateModalOpen,
    setCreateModalOpen,
    guides,
    setGuides,
    setIsLoadingGuides,
    setGeneratedGuide,
    setIsViewingGuide,
    selectGuide,
    startNewGuide,
  } = useAppStore();

  // Load guides on mount and populate the most recent guide
  useEffect(() => {
    const loadInitialGuide = async () => {
      setIsLoadingGuides(true);
      try {
        const loadedGuides = await apiService.getAllGuides();
        setGuides(loadedGuides);

        // Get current state to check if guide already exists
        const currentState = useAppStore.getState();

        // If there are guides and no guide is currently selected, load the most recent one
        if (loadedGuides.length > 0 && !currentState.generatedGuide) {
          const mostRecentGuide = loadedGuides[0]; // Already sorted by date DESC
          setGeneratedGuide(mostRecentGuide);
          setIsViewingGuide(true);
          selectGuide(mostRecentGuide.id);
        }
      } catch (error) {
        console.error("Failed to load guides:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load guides"
        );
      } finally {
        setIsLoadingGuides(false);
      }
    };

    loadInitialGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - Close sidebar/view/modal
      if (e.key === "Escape") {
        // Close modal if open
        if (isCreateModalOpen) {
          setCreateModalOpen(false);
          return;
        }
        // Close mobile sidebar if open
        const mobileSidebar = document.getElementById("mobile-sidebar");
        if (
          mobileSidebar &&
          !mobileSidebar.classList.contains("translate-x-full")
        ) {
          mobileSidebar.classList.add("translate-x-full");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCreateModalOpen, setCreateModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🤖 AI Guide Generator
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Create high-quality guides and tutorials with AI-powered
                research
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    startNewGuide();
                    setCreateModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>New Guide</span>
                </button>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{ paddingBottom: generatedGuide ? "420px" : "0" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-12rem)]">
          {/* Sidebar - Guides List */}
          <div className="lg:col-span-3 hidden lg:block h-full">
            <div className="sticky top-4">
              <GuidesSidebar />
            </div>
          </div>

          {/* Guide Preview - Takes up remaining space */}
          <div className={isViewingGuide ? "lg:col-span-9" : "lg:col-span-12"}>
            <GuidePreview />
          </div>
        </div>
      </main>

      {/* Create Guide Modal */}
      <CreateGuideModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Chat box - Fixed to bottom when guide exists and modal is not open */}
      {generatedGuide && !isCreateModalOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            maxWidth: "1800px",
            margin: "0 auto",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <GuideChat />
        </div>
      )}

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-24 right-4 z-40">
        <button
          onClick={() => {
            const sidebar = document.getElementById("mobile-sidebar");
            if (sidebar) {
              const isHidden = sidebar.classList.contains("translate-x-full");
              if (isHidden) {
                sidebar.classList.remove("translate-x-full");
              } else {
                sidebar.classList.add("translate-x-full");
              }
            }
          }}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
          aria-label="Toggle guides sidebar"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className="lg:hidden fixed inset-0 z-40 bg-white transform translate-x-full transition-transform duration-300 ease-in-out"
      >
        <div className="h-full overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <h2 className="text-xl font-bold text-gray-900">Your Guides</h2>
            <button
              onClick={() => {
                const sidebar = document.getElementById("mobile-sidebar");
                if (sidebar) {
                  sidebar.classList.add("translate-x-full");
                }
              }}
              className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg touch-manipulation transition-colors"
              aria-label="Close sidebar"
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
          <div className="flex-1 overflow-y-auto">
            <GuidesSidebar />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            Built with ❤️ using React, TypeScript, and Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
