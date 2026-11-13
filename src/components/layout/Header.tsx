import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Flame,
  Clock,
  Share2,
  LogOut,
  ShieldAlert,
  X
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    theme,
    toggleTheme,
    isCloudMode,
    currentStreak,
    totalStudyHours,
    exportDataJSON,
    importDataJSON,
    resetAllProgress,
    completedDaysCount,
    signOutUser
  } = useApp();

  const [notification, setNotification] = useState<{ ok: boolean; text: string } | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showResetModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !resetting) setShowResetModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showResetModal, resetting]);

  const showToast = (text: string, ok = true) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setNotification({ ok, text });
    toastTimerRef.current = window.setTimeout(() => {
      setNotification(null);
      toastTimerRef.current = null;
    }, 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      const text = ev.target?.result as string;
      const success = await importDataJSON(text);
      if (success) {
        showToast('Backup imported successfully!', true);
      } else {
        showToast('Invalid JSON backup file format.', false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleShare = async () => {
    const snippet = `I'm tracking my 252-day FAANG prep on ImTheBEST! Completed ${completedDaysCount} days (${totalStudyHours} hrs) with a ${currentStreak}-day streak.`;
    try {
      await navigator.clipboard.writeText(snippet);
      showToast('Progress summary copied to clipboard!', true);
    } catch {
      showToast('Clipboard permission unavailable in this browser context.', false);
    }
  };

  const handleConfirmReset = async () => {
    setResetting(true);
    await resetAllProgress();
    setResetting(false);
    setShowResetModal(false);
    showToast('Workspace reset cleanly to 0%.', true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-[#09090B]/85 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 min-w-0">
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 whitespace-nowrap">
              252-Day FAANG Track
            </span>
            {!isCloudMode && (
              <span className="hidden md:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 whitespace-nowrap">
                Local Mode
              </span>
            )}
            {notification && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border truncate max-w-[220px] sm:max-w-xs ${
                  notification.ok
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900'
                    : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'
                }`}
              >
                {notification.text}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Streak indicator */}
          <div
            title="Consecutive active calendar day streak"
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60 text-xs font-semibold"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{currentStreak}d</span>
          </div>

          {/* Study Hours */}
          <div
            title="Total logged study hours"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 text-xs font-semibold"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{totalStudyHours} hrs</span>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="Copy progress summary"
            title="Share progress snippet"
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Export JSON */}
          <button
            onClick={exportDataJSON}
            aria-label="Export progress JSON"
            title="Export complete progress as JSON"
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Import JSON */}
          <label
            aria-label="Import progress JSON"
            title="Import progress from JSON file"
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>

          {/* Reset (opens confirmation modal) */}
          <button
            onClick={() => setShowResetModal(true)}
            aria-label="Reset progress to zero"
            title="Reset all progress to 0%"
            className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Sign Out */}
          <button
            onClick={signOutUser}
            aria-label="Sign out"
            title="Sign Out"
            className="hidden sm:flex p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Safe Confirmation Modal for Header Reset */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 id="reset-modal-title" className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Reset All Progress to 0%?
                </h3>
              </div>
              <button
                onClick={() => !resetting && setShowResetModal(false)}
                aria-label="Close modal"
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This will permanently clear your roadmap checks, DSA problem statuses, backend lessons, project milestones, notes, and weekly test scores for this account. Consider exporting a JSON backup first.
            </p>
            <div className="mt-5 flex justify-end space-x-2">
              <button
                onClick={() => setShowResetModal(false)}
                disabled={resetting}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={resetting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition cursor-pointer disabled:opacity-60"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
