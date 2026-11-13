import React, { useEffect, useRef, useState } from 'react';
import { ThemePreference, useApp } from '../../context/AppContext';
import {
  User,
  Save,
  RotateCcw,
  Download,
  Upload,
  ShieldAlert,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    exportDataJSON,
    importDataJSON,
    resetAllProgress,
    themePreference,
    setThemePreference
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [degree, setDegree] = useState(userProfile.degree);
  const [targetRole, setTargetRole] = useState(userProfile.targetRole);
  const [primaryLanguage, setPrimaryLanguage] = useState(userProfile.primaryLanguage);
  const [framework, setFramework] = useState(userProfile.framework);
  const [database, setDatabase] = useState(userProfile.database);
  const [dailyHours, setDailyHours] = useState(userProfile.dailyHours);
  const [companies, setCompanies] = useState(userProfile.targetCompanies.join(', '));
  const [saveFeedback, setSaveFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [importFeedback, setImportFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const saveTimerRef = useRef<number | null>(null);
  const importTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
      if (importTimerRef.current !== null) window.clearTimeout(importTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    setName(userProfile.name);
    setDegree(userProfile.degree);
    setTargetRole(userProfile.targetRole);
    setPrimaryLanguage(userProfile.primaryLanguage);
    setFramework(userProfile.framework);
    setDatabase(userProfile.database);
    setDailyHours(userProfile.dailyHours);
    setCompanies(userProfile.targetCompanies.join(', '));
  }, [userProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateUserProfile({
      name: name.trim() || userProfile.name,
      degree: degree.trim(),
      targetRole: targetRole.trim(),
      primaryLanguage: primaryLanguage.trim() || 'Java',
      framework: framework.trim() || 'Spring Boot',
      database: database.trim() || 'PostgreSQL',
      dailyHours: Math.min(24, Math.max(1, Number(dailyHours) || 3)),
      targetCompanies: companies
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    });
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    setSaveFeedback(
      ok
        ? { ok: true, msg: 'Learning profile updated successfully!' }
        : { ok: false, msg: 'Could not save profile changes. Check your connection.' }
    );
    saveTimerRef.current = window.setTimeout(() => {
      setSaveFeedback(null);
      saveTimerRef.current = null;
    }, 3000);
  };

  const themeOptions: { id: ThemePreference; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'system', label: 'System Default', icon: Monitor },
    { id: 'light', label: 'Light Mode', icon: Sun },
    { id: 'dark', label: 'Dark Mode', icon: Moon }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
          Account & Roadmap Settings
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Personalize your theme, learning parameters, study schedule, and target tech companies.
        </p>
      </div>

      {/* Appearance & Theme Selector */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Appearance & Theme
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          Choose Light Mode, Dark Mode, or sync automatically with your operating system.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map(opt => {
            const Icon = opt.icon;
            const active = themePreference === opt.id;
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => setThemePreference(opt.id)}
                className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center space-x-2.5 transition cursor-pointer ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'bg-neutral-50 dark:bg-[#202025] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center space-x-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Learning Profile Configuration</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Full Name / Candidate Handle
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Academic Degree
              </label>
              <input
                type="text"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Primary Language
              </label>
              <input
                type="text"
                required
                value={primaryLanguage}
                onChange={e => setPrimaryLanguage(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Backend Framework
              </label>
              <input
                type="text"
                required
                value={framework}
                onChange={e => setFramework(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Primary Database
              </label>
              <input
                type="text"
                required
                value={database}
                onChange={e => setDatabase(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Target Engineering Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Daily Study Schedule Allocation (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={dailyHours}
                onChange={e => setDailyHours(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
              Target Tier-1 Tech Companies (comma separated)
            </label>
            <input
              type="text"
              value={companies}
              onChange={e => setCompanies(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold ${
                saveFeedback?.ok
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {saveFeedback?.msg || ''}
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold flex items-center space-x-1.5 shadow-xs hover:bg-blue-700 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Backup & Cloud Ready Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Data Portability & Reset
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
          Export a complete JSON backup of your 252-day roadmap, DSA tracker, backend lessons, projects, notes, and test scores, or restore from a previous backup.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportDataJSON}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-[#202025] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold flex items-center space-x-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Export Progress JSON Backup</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-[#202025] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold flex items-center space-x-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition cursor-pointer focus-within:ring-2 focus-within:ring-blue-500">
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async ev => {
                  const ok = await importDataJSON(ev.target?.result as string);
                  if (importTimerRef.current !== null) window.clearTimeout(importTimerRef.current);
                  setImportFeedback(
                    ok
                      ? { ok: true, msg: 'Backup imported and synced successfully.' }
                      : { ok: false, msg: 'Failed to parse or import backup JSON.' }
                  );
                  importTimerRef.current = window.setTimeout(() => {
                    setImportFeedback(null);
                    importTimerRef.current = null;
                  }, 4000);
                };
                reader.readAsText(file);
                e.target.value = '';
              }}
              className="sr-only"
            />
          </label>

          {!confirmingReset ? (
            <button
              onClick={() => setConfirmingReset(true)}
              className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-semibold flex items-center space-x-2 hover:bg-red-100 transition ml-auto cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Progress to 0%</span>
            </button>
          ) : (
            <div className="w-full mt-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-2.5 text-xs text-red-700 dark:text-red-300">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Permanently reset all roadmap checks, DSA statuses, backend lessons, projects, notes, and test scores back to 0%?
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setConfirmingReset(false)}
                  disabled={resetting}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setResetting(true);
                    await resetAllProgress();
                    setResetting(false);
                    setConfirmingReset(false);
                  }}
                  disabled={resetting}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition cursor-pointer disabled:opacity-60"
                >
                  {resetting ? 'Resetting...' : 'Yes, Reset to 0%'}
                </button>
              </div>
            </div>
          )}
        </div>

        {importFeedback && (
          <p
            className={`mt-3 text-xs font-semibold ${
              importFeedback.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {importFeedback.msg}
          </p>
        )}
      </div>
    </div>
  );
};
