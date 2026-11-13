import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MONTH_THEMES } from '../../data/roadmapData';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  Compass,
  RotateCcw
} from 'lucide-react';

type StatusFilter = 'All' | 'Completed' | 'Pending';

export const RoadmapView: React.FC = () => {
  const {
    userProfile,
    roadmapTasks,
    toggleTaskCompletion,
    toggleDayComplete,
    updateUserNotes
  } = useApp();

  const activeDay = roadmapTasks.find(t => !t.isCompleted) || roadmapTasks[roadmapTasks.length - 1];

  const [selectedMonth, setSelectedMonth] = useState<number>(activeDay?.month || 1);
  const [expandedDay, setExpandedDay] = useState<number | null>(activeDay?.dayNumber || 1);
  const [editingNotesDay, setEditingNotesDay] = useState<number | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('All');

  const monthTasks = roadmapTasks.filter(t => t.month === selectedMonth);
  const activeMonthMeta = MONTH_THEMES.find(m => m.month === selectedMonth);

  const filteredMonthTasks = monthTasks.filter(task => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      task.title.toLowerCase().includes(q) ||
      task.dsa.title.toLowerCase().includes(q) ||
      task.backend.title.toLowerCase().includes(q) ||
      `day ${task.dayNumber}`.includes(q);

    const matchesStatus =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Completed'
        ? task.isCompleted
        : !task.isCompleted;

    return matchesSearch && matchesStatus;
  });

  const handleDayCompleteAndCelebrate = (dayNum: number, currentCompleted: boolean) => {
    toggleDayComplete(dayNum);
    if (!currentCompleted) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  const handleJumpToActive = () => {
    if (!activeDay) return;
    setSelectedMonth(activeDay.month);
    setExpandedDay(activeDay.dayNumber);
    setSearchTerm('');
    setFilterStatus('All');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
              The Complete 252-Day FAANG Roadmap
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
              9 Months • 252 Unique Study Days
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Structured for {userProfile.dailyHours} hours daily target: 75m DSA + 90m Backend + 15m Revision &amp; GitHub.
          </p>
        </div>

        <button
          onClick={handleJumpToActive}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition cursor-pointer self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Jump to Active Day (Day {activeDay?.dayNumber || 1})</span>
        </button>
      </div>

      {/* 9 Month Navigation Tabs */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-2">
        {MONTH_THEMES.map(m => {
          const isSelected = m.month === selectedMonth;
          const monthDays = roadmapTasks.filter(t => t.month === m.month);
          const finishedDays = monthDays.filter(t => t.isCompleted).length;
          const pct = monthDays.length > 0 ? Math.round((finishedDays / monthDays.length) * 100) : 0;

          return (
            <button
              key={m.month}
              onClick={() => {
                setSelectedMonth(m.month);
                setExpandedDay(monthDays[0]?.dayNumber || null);
              }}
              className={`px-4 py-3 rounded-2xl whitespace-nowrap text-left border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-[#18181B] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-700'
              }`}
            >
              <div className="text-[11px] uppercase font-bold tracking-wider">
                Month {m.month}
              </div>
              <div className="text-xs font-semibold truncate max-w-[170px] mt-0.5">
                {m.title.split('+')[0].trim()}
              </div>
              <div
                className={`text-[10px] mt-1 font-medium ${
                  isSelected ? 'text-white/85' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {pct}% Done ({finishedDays}/28)
              </div>
            </button>
          );
        })}
      </div>

      {/* Month Milestone Meta Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">
              Month {selectedMonth} Curriculum • 28 Days
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {activeMonthMeta?.title}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl">
              {activeMonthMeta?.subtitle}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
              Deliverable Project
            </span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              {activeMonthMeta?.project}
            </span>
          </div>
        </div>

        {/* Filter bar for Month */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              aria-label={`Search Month ${selectedMonth} days`}
              placeholder={`Search ${monthTasks.length} days in Month ${selectedMonth}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              aria-label="Filter days by completion status"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as StatusFilter)}
              className="text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="All">All Statuses ({monthTasks.length})</option>
              <option value="Completed">
                Completed ({monthTasks.filter(t => t.isCompleted).length})
              </option>
              <option value="Pending">
                Pending ({monthTasks.filter(t => !t.isCompleted).length})
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 28 Daily Tasks List */}
      {filteredMonthTasks.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            No roadmap days in Month {selectedMonth} match your current search or filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('All');
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMonthTasks.map(day => {
            const isExpanded = expandedDay === day.dayNumber;

            return (
              <div
                key={day.id}
                className={`rounded-2xl border transition-all duration-200 ${
                  day.isCompleted
                    ? 'bg-white/95 dark:bg-[#18181B]/95 border-emerald-500/40 shadow-xs'
                    : 'bg-white dark:bg-[#18181B] border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {/* Day Header Row */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <button
                      onClick={() => handleDayCompleteAndCelebrate(day.dayNumber, day.isCompleted)}
                      aria-label={`Mark Day ${day.dayNumber} ${day.isCompleted ? 'incomplete' : 'complete'}`}
                      className="text-emerald-500 hover:scale-110 transition cursor-pointer shrink-0"
                      title={day.isCompleted ? 'Mark incomplete' : 'Mark entire 3h day complete'}
                    >
                      {day.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white dark:text-neutral-900" />
                      ) : (
                        <Circle className="w-6 h-6 text-neutral-300 dark:text-neutral-700" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#24242A] text-neutral-700 dark:text-neutral-300">
                          Day {day.dayNumber}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Week {day.week}
                        </span>
                        {day.completedAt && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ Logged {day.completedAt}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 truncate">
                        {day.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="hidden sm:flex items-center space-x-1.5 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          day.dsa.completed
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        DSA
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          day.backend.completed
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        Backend
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          day.revision.completed
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        Git
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                      aria-label={isExpanded ? `Collapse Day ${day.dayNumber}` : `Expand Day ${day.dayNumber}`}
                      className="p-1.5 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* DSA Detail */}
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                            DSA Drill • 75 Mins
                          </span>
                          <input
                            type="checkbox"
                            aria-label={`Mark Day ${day.dayNumber} DSA complete`}
                            checked={day.dsa.completed}
                            onChange={() => toggleTaskCompletion(day.dayNumber, 'dsa')}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                          />
                        </div>
                        <div className="text-sm font-bold mt-2 text-neutral-900 dark:text-neutral-100">
                          {day.dsa.title}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                          {day.dsa.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs">
                        <a
                          href={day.dsa.resource}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                          <span>LeetCode Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className={`text-[11px] font-bold ${day.dsa.completed ? 'text-emerald-500' : 'text-neutral-400'}`}>
                          {day.dsa.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Backend Detail */}
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                            Backend Core • 90 Mins
                          </span>
                          <input
                            type="checkbox"
                            aria-label={`Mark Day ${day.dayNumber} Backend complete`}
                            checked={day.backend.completed}
                            onChange={() => toggleTaskCompletion(day.dayNumber, 'backend')}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                          />
                        </div>
                        <div className="text-sm font-bold mt-2 text-neutral-900 dark:text-neutral-100">
                          {day.backend.title}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                          {day.backend.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs">
                        <a
                          href={day.backend.resource}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                        >
                          <span>Documentation</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className={`text-[11px] font-bold ${day.backend.completed ? 'text-emerald-500' : 'text-neutral-400'}`}>
                          {day.backend.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Revision Detail */}
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                            Revision & Git • 15 Mins
                          </span>
                          <input
                            type="checkbox"
                            aria-label={`Mark Day ${day.dayNumber} Revision complete`}
                            checked={day.revision.completed}
                            onChange={() => toggleTaskCompletion(day.dayNumber, 'revision')}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                          />
                        </div>
                        <div className="text-sm font-bold mt-2 text-neutral-900 dark:text-neutral-100">
                          {day.revision.title}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                          {day.revision.description}
                        </p>

                        {/* Personal Notes */}
                        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700/60">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                              Day Notes
                            </span>
                            <button
                              onClick={() => {
                                setEditingNotesDay(day.dayNumber);
                                setNotesInput(day.userNotes || '');
                              }}
                              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-[11px] cursor-pointer"
                            >
                              {day.userNotes ? 'Edit' : '+ Add Note'}
                            </button>
                          </div>

                          {editingNotesDay === day.dayNumber ? (
                            <div className="mt-2 space-y-2">
                              <textarea
                                rows={2}
                                value={notesInput}
                                onChange={e => setNotesInput(e.target.value)}
                                placeholder="Key edge cases, realization or questions..."
                                className="w-full text-xs p-2 rounded-lg bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setEditingNotesDay(null)}
                                  className="text-[11px] text-neutral-500 px-2 py-1 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={async () => {
                                    await updateUserNotes(day.dayNumber, notesInput);
                                    setEditingNotesDay(null);
                                  }}
                                  className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-semibold cursor-pointer"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs italic text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                              {day.userNotes || 'No notes added for this day yet.'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
