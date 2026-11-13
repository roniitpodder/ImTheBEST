import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const StreakCalendar: React.FC = () => {
  const { roadmapTasks, completedDaysCount, currentStreak, longestStreak } = useApp();
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const activeHoveredTask = hoveredDay !== null ? roadmapTasks[hoveredDay - 1] : null;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              252-Day Consistency Heatmap
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              {completedDaysCount} / 252 Days Logged
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            GitHub-style activity tracker displaying daily completion & study intensity across all 9 months.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 self-start sm:self-auto">
          <span>0 Task</span>
          <div className="w-3.5 h-3.5 rounded-xs bg-neutral-100 dark:bg-[#232328] border border-neutral-200 dark:border-neutral-700/60" />
          <div className="w-3.5 h-3.5 rounded-xs bg-blue-300/60 dark:bg-blue-950 border border-blue-300 dark:border-blue-900" />
          <div className="w-3.5 h-3.5 rounded-xs bg-blue-500 text-white" />
          <div className="w-3.5 h-3.5 rounded-xs bg-emerald-500 text-white" />
          <span>Full Day (3h)</span>
        </div>
      </div>

      {/* Grid: 36 columns of 7 rows = 252 days exactly */}
      <div className="overflow-x-auto pb-3 pt-1">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[760px]">
          {roadmapTasks.map(day => {
            let subtasks = 0;
            if (day.dsa.completed) subtasks++;
            if (day.backend.completed) subtasks++;
            if (day.revision.completed) subtasks++;

            let cellClass =
              'bg-neutral-100 dark:bg-[#232328] border border-neutral-200 dark:border-neutral-800';
            if (day.isCompleted) {
              cellClass = 'bg-emerald-500 border border-emerald-600 shadow-xs shadow-emerald-500/20';
            } else if (subtasks === 2) {
              cellClass = 'bg-blue-600 border border-blue-500';
            } else if (subtasks === 1) {
              cellClass = 'bg-blue-400/50 dark:bg-blue-900/60 border border-blue-400/30';
            }

            return (
              <button
                key={day.id}
                type="button"
                aria-label={`Day ${day.dayNumber}: ${day.title} (${day.isCompleted ? 'Completed' : 'Incomplete'})`}
                onMouseEnter={() => setHoveredDay(day.dayNumber)}
                onMouseLeave={() => setHoveredDay(null)}
                onFocus={() => setHoveredDay(day.dayNumber)}
                onBlur={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 rounded-xs transition-transform duration-150 cursor-pointer hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500 ${cellClass}`}
              />
            );
          })}
        </div>
      </div>

      {/* Hover preview tooltip bar */}
      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div>
          {activeHoveredTask ? (
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">
              Day {activeHoveredTask.dayNumber} (Month {activeHoveredTask.month}, Week {activeHoveredTask.week}):{' '}
              {activeHoveredTask.title} —{' '}
              <span className={activeHoveredTask.isCompleted ? 'text-emerald-500 font-semibold' : 'text-blue-500'}>
                {activeHoveredTask.isCompleted ? 'Completed (3h full log)' : 'Incomplete'}
              </span>
            </span>
          ) : (
            <span>Hover over any milestone day square to inspect tasks and progress.</span>
          )}
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0 font-medium text-[11px]">
          <span>Current Streak: <strong className="text-neutral-900 dark:text-neutral-100">{currentStreak} Days</strong></span>
          <span>Longest Streak: <strong className="text-neutral-900 dark:text-neutral-100">{longestStreak} Days</strong></span>
        </div>
      </div>
    </div>
  );
};
