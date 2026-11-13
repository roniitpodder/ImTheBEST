import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import { StreakCalendar } from '../ui/StreakCalendar';
import { MOTIVATIONAL_QUOTES } from '../../data/quotes';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  Code2,
  Server,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Award,
  Clock,
  CheckSquare,
  Calendar,
  CalendarCheck
} from 'lucide-react';

export const DashboardView: React.FC<{ onNavigate: (tab: string) => void }> = ({
  onNavigate
}) => {
  const {
    userProfile,
    roadmapTasks,
    toggleTaskCompletion,
    toggleDayComplete,
    updateUserNotes,
    currentStreak,
    totalStudyHours,
    overallCompletionPct,
    completedDaysCount,
    completedTasksCount,
    totalTasksCount,
    dsaProblems,
    backendModules
  } = useApp();

  // Next incomplete day (or last day if all 252 completed)
  const activeDay =
    roadmapTasks.find(t => !t.isCompleted) || roadmapTasks[roadmapTasks.length - 1];

  // Rotating quote
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );

  // Quick note editing for Today's Focus
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(activeDay.userNotes || '');

  useEffect(() => {
    setNoteDraft(activeDay.userNotes || '');
    setEditingNote(false);
  }, [activeDay.dayNumber, activeDay.userNotes]);

  // True DSA percentage
  const totalDsaCount = dsaProblems.length;
  const solvedDsaCount = dsaProblems.filter(
    p => p.status === 'Solved' || p.status === 'Revised'
  ).length;
  const dsaCompletionPct =
    totalDsaCount > 0 ? Math.round((solvedDsaCount / totalDsaCount) * 100) : 0;

  // True Backend percentage
  const allLessons = backendModules.flatMap(m => m.lessons);
  const completedLessons = allLessons.filter(l => l.completed).length;
  const backendCompletionPct =
    allLessons.length > 0 ? Math.round((completedLessons / allLessons.length) * 100) : 0;

  // Dynamic remaining days & hour targets based on userProfile & actual roadmap
  const totalRoadmapDays = roadmapTasks.length;
  const remainingDays = Math.max(0, totalRoadmapDays - completedDaysCount);
  const totalGoalHours = totalRoadmapDays * userProfile.dailyHours;
  const weeklyGoalHours = 6 * userProfile.dailyHours;
  const activeDayMinutes =
    activeDay.dsa.duration + activeDay.backend.duration + activeDay.revision.duration;
  const activeDayHours = Math.round((activeDayMinutes / 60) * 10) / 10;

  // True Weekly stats for the active week
  const currentWeek = activeDay.week;
  const weekTasks = roadmapTasks.filter(t => t.week === currentWeek);
  const weekCompletedDays = weekTasks.filter(t => t.isCompleted).length;
  const weekSubtasksDone = weekTasks.reduce((acc, d) => {
    let c = 0;
    if (d.dsa.completed) c++;
    if (d.backend.completed) c++;
    if (d.revision.completed) c++;
    return acc + c;
  }, 0);
  const weekCompletionPct =
    weekTasks.length > 0 ? Math.round((weekSubtasksDone / (weekTasks.length * 3)) * 100) : 0;
  const weekStudyHours =
    Math.round(
      (weekTasks.reduce((acc, d) => {
        let m = 0;
        if (d.dsa.completed) m += d.dsa.duration;
        if (d.backend.completed) m += d.backend.duration;
        if (d.revision.completed) m += d.revision.duration;
        return acc + m;
      }, 0) /
        60) *
        10
    ) / 10;

  const handleDayCompleteWithCelebration = async (dayNum: number, wasCompleted: boolean) => {
    await toggleDayComplete(dayNum);
    if (!wasCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner — crisp Apple surface adapting to Light & Dark modes */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#121216] border border-neutral-200 dark:border-neutral-800 p-7 sm:p-9 text-neutral-900 dark:text-white shadow-xs transition-colors duration-200">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              Roadmap Day {activeDay.dayNumber} of {totalRoadmapDays}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              Month {activeDay.month} • Week {activeDay.week}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Welcome back, {userProfile.name.split(' ')[0]}.
          </h1>
          <p className="mt-2 text-base text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
            “Your future is built one day at a time.” Dedicate your {userProfile.dailyHours} focused hours today to build toward {userProfile.targetCompanies.slice(0, 4).join(', ')}.
          </p>

          <button
            type="button"
            onClick={() =>
              setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length)
            }
            className="mt-5 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200/70 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 cursor-pointer text-xs text-neutral-700 dark:text-neutral-300 transition text-left"
            title="Click for next quote"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>{MOTIVATIONAL_QUOTES[quoteIndex]}</span>
          </button>
        </div>
      </div>

      {/* Progress Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Roadmap"
          value={`${overallCompletionPct}%`}
          subtext={`${completedDaysCount} of ${totalRoadmapDays} days completed`}
          badge={`${remainingDays} Days Left`}
          icon={TrendingUp}
          color="text-blue-500"
          onClick={() => onNavigate('roadmap')}
        />
        <StatCard
          label="DSA Completion"
          value={`${dsaCompletionPct}%`}
          subtext={`${solvedDsaCount} of ${totalDsaCount} problems solved`}
          badge="LeetCode"
          icon={Code2}
          color="text-emerald-500"
          onClick={() => onNavigate('dsa')}
        />
        <StatCard
          label="Backend Mastery"
          value={`${backendCompletionPct}%`}
          subtext={`${completedLessons} of ${allLessons.length} units completed`}
          badge={`${userProfile.primaryLanguage} + ${userProfile.framework}`}
          icon={Server}
          color="text-purple-500"
          onClick={() => onNavigate('backend')}
        />
        <StatCard
          label="Current Streak"
          value={`${currentStreak} Days`}
          subtext={`${totalStudyHours} total study hours`}
          badge={`${completedTasksCount}/${totalTasksCount} Tasks`}
          icon={Flame}
          color="text-orange-500"
          onClick={() => onNavigate('analytics')}
        />
      </div>

      {/* Secondary Quick Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Completed Tasks
            </span>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {completedTasksCount}{' '}
              <span className="text-xs font-normal text-neutral-400">/ {totalTasksCount}</span>
            </div>
          </div>
          <CheckSquare className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Study Hours
            </span>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {totalStudyHours} hrs{' '}
              <span className="text-xs font-normal text-neutral-400">/ {totalGoalHours} hrs</span>
            </div>
          </div>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>

        <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Remaining Roadmap Days
            </span>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {remainingDays} days <span className="text-xs font-normal text-neutral-400">remaining</span>
            </div>
          </div>
          <Calendar className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      {/* Today's Focus Action Card */}
      <div className="rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Today’s Focus: Day {activeDay.dayNumber}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {activeDay.title} • Target: {activeDayMinutes} Minutes ({activeDayHours} Hours total)
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() =>
                handleDayCompleteWithCelebration(activeDay.dayNumber, activeDay.isCompleted)
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                activeDay.isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeDay.isCompleted ? 'Mark Incomplete' : 'Complete All Day'}</span>
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className="flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-2 cursor-pointer"
            >
              <span>Full Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Core Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* DSA Task */}
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                  DSA • {activeDay.dsa.duration} MINS
                </span>
                <input
                  type="checkbox"
                  aria-label="Mark DSA task completed"
                  checked={activeDay.dsa.completed}
                  onChange={() => toggleTaskCompletion(activeDay.dayNumber, 'dsa')}
                  className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
                />
              </div>
              <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
                {activeDay.dsa.title}
              </h3>
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {activeDay.dsa.description}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs">
              <a
                href={activeDay.dsa.resource}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <span>Problem Catalog</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span
                className={`text-[11px] font-bold ${
                  activeDay.dsa.completed ? 'text-emerald-500' : 'text-neutral-400'
                }`}
              >
                {activeDay.dsa.completed ? '✓ Completed' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Backend Task */}
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50">
                  BACKEND • {activeDay.backend.duration} MINS
                </span>
                <input
                  type="checkbox"
                  aria-label="Mark Backend task completed"
                  checked={activeDay.backend.completed}
                  onChange={() => toggleTaskCompletion(activeDay.dayNumber, 'backend')}
                  className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
                />
              </div>
              <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
                {activeDay.backend.title}
              </h3>
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {activeDay.backend.description}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs">
              <a
                href={activeDay.backend.resource}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                <span>Spring Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span
                className={`text-[11px] font-bold ${
                  activeDay.backend.completed ? 'text-emerald-500' : 'text-neutral-400'
                }`}
              >
                {activeDay.backend.completed ? '✓ Completed' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Revision Task + Notes */}
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                  REVISION & GIT • {activeDay.revision.duration} MINS
                </span>
                <input
                  type="checkbox"
                  aria-label="Mark Revision and Git task completed"
                  checked={activeDay.revision.completed}
                  onChange={() => toggleTaskCompletion(activeDay.dayNumber, 'revision')}
                  className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
                />
              </div>
              <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
                {activeDay.revision.title}
              </h3>
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {activeDay.revision.description}
              </p>

              {/* Inline Day Notes */}
              <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-700/60">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                    Today’s Notes
                  </span>
                  <button
                    onClick={() => {
                      setNoteDraft(activeDay.userNotes || '');
                      setEditingNote(!editingNote);
                    }}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    {editingNote ? 'Close' : activeDay.userNotes ? 'Edit' : '+ Add Note'}
                  </button>
                </div>
                {editingNote ? (
                  <div className="mt-2 space-y-1.5">
                    <textarea
                      rows={2}
                      value={noteDraft}
                      onChange={e => setNoteDraft(e.target.value)}
                      placeholder="Write takeaways for today..."
                      className="w-full text-xs p-2 rounded-lg bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          await updateUserNotes(activeDay.dayNumber, noteDraft);
                          setEditingNote(false);
                        }}
                        className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-semibold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] italic text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {activeDay.userNotes || 'No notes recorded for this day yet.'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Commit: "feat: day {activeDay.dayNumber} sprint"
              </span>
              <span
                className={`text-[11px] font-bold ${
                  activeDay.revision.completed ? 'text-emerald-500' : 'text-neutral-400'
                }`}
              >
                {activeDay.revision.completed ? '✓ Pushed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Overview Section with True Per-Day Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Weekly Overview — Week {currentWeek}
              </span>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {weekCompletionPct}% Completed
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {weekCompletedDays} / {weekTasks.length} full days • {weekStudyHours} hrs logged
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              Target: 6 Study Days ({weeklyGoalHours} hrs)
            </span>
          </div>

          {weekStudyHours === 0 && (
            <p className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400">
              No study minutes logged in Week {currentWeek} yet. Check off tasks above to build your weekly momentum.
            </p>
          )}

          {/* True Bar Chart of minutes logged per day in current week */}
          <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-3 items-end h-28 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {weekTasks.map(d => {
              let mins = 0;
              if (d.dsa.completed) mins += d.dsa.duration;
              if (d.backend.completed) mins += d.backend.duration;
              if (d.revision.completed) mins += d.revision.duration;
              const barPct = Math.round((mins / 180) * 100);

              return (
                <div key={d.id} className="flex flex-col items-center space-y-1.5 h-full justify-end">
                  <span className="text-[10px] font-semibold text-neutral-400">
                    {mins > 0 ? `${mins}m` : '0m'}
                  </span>
                  <div className="w-full max-w-[36px] h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex items-end">
                    <div
                      className={`w-full transition-all duration-300 rounded-t-md ${
                        d.isCompleted
                          ? 'bg-emerald-500'
                          : mins > 0
                          ? 'bg-blue-500'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${barPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    D{d.dayNumber}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => onNavigate('roadmap')}
            className="w-full text-left p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex-1 flex flex-col justify-between cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
          >
            <div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Current Milestone
              </span>
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                Month {activeDay.month} of 9
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                6 study days + 1 revision & diagnostic test per week.
              </p>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
              <Layers className="w-4 h-4" />
              <span>28 Days per Month Structure</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tests')}
            className="w-full text-left p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 flex-1 flex flex-col justify-between cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
          >
            <div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Weekly Checkpoint
              </span>
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                Week {currentWeek} Assessment
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Test your DSA complexity, {userProfile.primaryLanguage}, and backend concepts.
              </p>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Award className="w-4 h-4" />
              <span>Open Diagnostic Tests</span>
            </div>
          </button>
        </div>
      </div>

      {/* GitHub Style 252-Day Heatmap */}
      <StreakCalendar />
    </div>
  );
};
