import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isFirebaseConfigured } from '../../firebase';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CalendarCheck,
  Code2,
  Server,
  Sun,
  Moon,
  AlertCircle,
  HardDrive
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, signInLocalProfile, authError, theme, toggleTheme } = useApp();
  const [localName, setLocalName] = useState('');
  const [localEmail, setLocalEmail] = useState('');

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localName.trim() || !localEmail.trim()) return;
    signInLocalProfile(localName.trim(), localEmail.trim());
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#09090B] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col justify-between p-6 sm:p-10 transition-colors duration-200">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-neutral-900 dark:text-white">
              ImThe<span className="text-blue-600 dark:text-blue-500">BEST</span>
            </span>
            <span className="block text-[10px] uppercase font-semibold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Personal FAANG Engineering OS
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Auth Card */}
      <div className="max-w-5xl w-full mx-auto my-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Pitch */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>252 Days • 3 Hours a Day • 0% to Offer-Ready</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
            Your private OS for top-tier software engineering.
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Every account gets its own isolated workspace starting cleanly from <strong>Day 1 (0%)</strong>. Track your 252-day roadmap, LeetCode drills, Spring Boot & PostgreSQL modules, projects, and weekly diagnostics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex items-start space-x-3">
              <CalendarCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">252 Unique Days</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Daily DSA, Java/Spring, and Git drills
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">Private Multi-User</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Each user’s progress is strictly isolated
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex items-start space-x-3">
              <Code2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">True Live Analytics</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Zero fake stats—every % reflects your logs
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex items-start space-x-3">
              <Server className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">7 Capstone Projects</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  From Java CLI to Distributed Payments
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sign-In Card */}
        <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xl">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Sign in to your workspace
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
            {isFirebaseConfigured
              ? 'Sign in with Google to create or resume your personal 252-day engineering tracker across devices.'
              : 'Firebase environment variables are not set yet. Sign in with a local profile to test everything offline, or configure VITE_FIREBASE_* in .env for cloud sync.'}
          </p>

          {authError && (
            <div className="mt-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {isFirebaseConfigured ? (
            <button
              onClick={signInWithGoogle}
              className="mt-6 w-full py-3.5 px-5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-sm flex items-center justify-center space-x-3 hover:opacity-90 transition shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          ) : (
            <form onSubmit={handleLocalSubmit} className="mt-5 space-y-3">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start space-x-2 text-[11px] text-amber-800 dark:text-amber-300">
                <HardDrive className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Running in <strong>Local Workspace Mode</strong>. Progress saves per email in this browser until Firebase keys are configured.
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={localName}
                  onChange={e => setLocalName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Profile Email (isolates your local data)
                </label>
                <input
                  type="email"
                  required
                  value={localEmail}
                  onChange={e => setLocalEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-5 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-sm cursor-pointer"
              >
                Open Local Workspace
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Starts cleanly at 0 days, 0% DSA, 0% Backend</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Persistent storage across refreshes & sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full JSON backup export & import always available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-neutral-400">
        Target: Apple • Google • Microsoft • Amazon • Meta
      </div>
    </div>
  );
};
