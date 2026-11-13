import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Code2,
  Server,
  FolderGit2,
  FileText,
  HelpCircle,
  BarChart3,
  Sliders,
  Sparkles,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  onClose
}) => {
  const { user, signOutUser, userProfile, overallCompletionPct } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: '252-Day Roadmap', icon: CalendarCheck },
    { id: 'dsa', label: 'DSA Tracker', icon: Code2 },
    { id: 'backend', label: 'Backend Tracker', icon: Server },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'notes', label: 'Notes & Revision', icon: FileText },
    { id: 'tests', label: 'Weekly Tests', icon: HelpCircle },
    { id: 'analytics', label: 'Monthly Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-[#121215] border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* Logo / Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                  ImThe<span className="text-blue-600 dark:text-blue-500">BEST</span>
                </span>
                <span className="block text-[10px] uppercase font-semibold text-neutral-500 dark:text-neutral-400 tracking-wider">
                  FAANG Operating OS
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="lg:hidden text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    setCurrentTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-current'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Progress Box */}
        <div className="p-3.5 space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#18181D] border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {userProfile.framework} + {userProfile.primaryLanguage}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold tabular-nums">
                {overallCompletionPct}%
              </span>
            </div>

            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                style={{ width: `${overallCompletionPct}%` }}
              />
            </div>

            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed truncate">
              {userProfile.targetCompanies.slice(0, 4).join(' • ')}
            </div>
          </div>

          {user && (
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#18181D] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {(userProfile.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {userProfile.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={signOutUser}
                aria-label="Sign out"
                title="Sign out"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
