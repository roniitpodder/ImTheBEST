import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AuthScreen } from './components/auth/AuthScreen';
import { DashboardView } from './components/views/DashboardView';
import { RoadmapView } from './components/views/RoadmapView';
import { DSATrackerView } from './components/views/DSATrackerView';
import { BackendTrackerView } from './components/views/BackendTrackerView';
import { ProjectsView } from './components/views/ProjectsView';
import { NotesView } from './components/views/NotesView';
import { WeeklyTestsView } from './components/views/WeeklyTestsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { AlertTriangle, Sparkles, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, authLoading, dataLoading, syncError, clearSyncError } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#09090B] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col items-center justify-center space-y-4">
        <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white animate-pulse shadow-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          {authLoading ? 'Checking session...' : 'Loading your personal workspace...'}
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#09090B] text-[#1D1D1F] dark:text-[#F5F5F7] flex transition-colors duration-200 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        {syncError && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{syncError}</span>
            </div>
            <button
              onClick={clearSyncError}
              aria-label="Dismiss sync warning"
              className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView onNavigate={tab => setCurrentTab(tab)} />
          )}
          {currentTab === 'roadmap' && <RoadmapView />}
          {currentTab === 'dsa' && <DSATrackerView />}
          {currentTab === 'backend' && <BackendTrackerView />}
          {currentTab === 'projects' && <ProjectsView />}
          {currentTab === 'notes' && <NotesView />}
          {currentTab === 'tests' && <WeeklyTestsView />}
          {currentTab === 'analytics' && <AnalyticsView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
