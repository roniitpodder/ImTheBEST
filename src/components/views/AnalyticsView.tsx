import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import {
  Clock,
  Flame,
  Award,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    userProfile,
    roadmapTasks,
    dsaProblems,
    backendModules,
    projects,
    weeklyTests,
    totalStudyHours,
    currentStreak,
    longestStreak,
    completedDaysCount
  } = useApp();

  const totalGoalHours = roadmapTasks.length * userProfile.dailyHours;

  // True DSA metrics
  const totalDsa = dsaProblems.length;
  const solvedDsa = dsaProblems.filter(
    p => p.status === 'Solved' || p.status === 'Revised'
  ).length;
  const dsaRate = totalDsa > 0 ? Math.round((solvedDsa / totalDsa) * 100) : 0;

  // True Backend metrics
  const allLessons = backendModules.flatMap(m => m.lessons);
  const finishedLessons = allLessons.filter(l => l.completed).length;
  const backendRate =
    allLessons.length > 0 ? Math.round((finishedLessons / allLessons.length) * 100) : 0;

  // True Project milestone metrics
  const totalMilestones = projects.flatMap(p => p.milestones);
  const finishedMilestones = totalMilestones.filter(m => m.completed).length;
  const projectMilestoneRate =
    totalMilestones.length > 0
      ? Math.round((finishedMilestones / totalMilestones.length) * 100)
      : 0;

  // Average weekly test score
  const attemptedTests = weeklyTests.filter(t => t.completed);
  const avgTestScore =
    attemptedTests.length > 0
      ? Math.round(attemptedTests.reduce((a, b) => a + b.score, 0) / attemptedTests.length)
      : 0;

  // True Average Daily Study Time (across active days, or 0 if 0 days logged)
  const activeStudyDays = roadmapTasks.filter(
    t => t.dsa.completed || t.backend.completed || t.revision.completed
  ).length;
  const avgDailyHours =
    activeStudyDays > 0 ? Math.round((totalStudyHours / activeStudyDays) * 10) / 10 : 0;

  // Monthly breakdown calculation (true progress per month)
  const monthlyStats = Array.from({ length: 9 }, (_, i) => {
    const mNum = i + 1;
    const mTasks = roadmapTasks.filter(t => t.month === mNum);
    const mCompleted = mTasks.filter(t => t.isCompleted).length;
    return {
      month: mNum,
      completed: mCompleted,
      total: mTasks.length,
      pct: mTasks.length > 0 ? Math.round((mCompleted / mTasks.length) * 100) : 0
    };
  });

  // Dynamic DSA topic completion computed strictly from user's actual dsaProblems
  const topicMap: Record<string, { total: number; solved: number }> = {};
  dsaProblems.forEach(p => {
    if (!topicMap[p.topic]) topicMap[p.topic] = { total: 0, solved: 0 };
    topicMap[p.topic].total += 1;
    if (p.status === 'Solved' || p.status === 'Revised') {
      topicMap[p.topic].solved += 1;
    }
  });
  const dsaTopicBreakdown = Object.entries(topicMap)
    .map(([topic, counts]) => ({
      topic,
      solved: counts.solved,
      total: counts.total,
      pct: counts.total > 0 ? Math.round((counts.solved / counts.total) * 100) : 0
    }))
    .sort((a, b) => b.pct - a.pct);

  // Dynamic Backend module completion computed strictly from user's actual backendModules
  const backendBreakdown = backendModules.map(mod => {
    const done = mod.lessons.filter(l => l.completed).length;
    const total = mod.lessons.length;
    return {
      id: mod.id,
      title: mod.title,
      done,
      total,
      pct: total > 0 ? Math.round((done / total) * 100) : 0
    };
  });

  // Strongest & Weakest Topics (only from topics that exist; highlight real weakest)
  const strongestTopics = dsaTopicBreakdown.filter(t => t.solved > 0).slice(0, 3);
  const weakestTopics = [...dsaTopicBreakdown]
    .filter(t => t.pct < 100)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
            Monthly Analytics & Career Readiness
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
            Live Calculated Metrics
          </span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Every number below is computed directly from your logged roadmap tasks, solved DSA problems, completed backend lessons, project milestones, and test scores.
        </p>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Study Time"
          value={`${totalStudyHours} hrs`}
          subtext={`Avg ${avgDailyHours} hrs / active day (${activeStudyDays} active days)`}
          badge={`Goal: ${totalGoalHours}h`}
          icon={Clock}
          color="text-blue-500"
        />
        <StatCard
          label="Consistency Streak"
          value={`${currentStreak} Days`}
          subtext={`Longest: ${longestStreak} days • ${completedDaysCount} full days`}
          badge="6d / week"
          icon={Flame}
          color="text-orange-500"
        />
        <StatCard
          label="DSA Problems Solved"
          value={`${solvedDsa} / ${totalDsa}`}
          subtext={`${dsaRate}% of tracked catalog solved`}
          badge="LeetCode"
          icon={Award}
          color="text-emerald-500"
        />
        <StatCard
          label="Weekly Test Average"
          value={attemptedTests.length > 0 ? `${avgTestScore}%` : '—'}
          subtext={`${attemptedTests.length} of ${weeklyTests.length} tests attempted • Projects ${projectMilestoneRate}%`}
          badge="Diagnostics"
          icon={ShieldCheck}
          color="text-purple-500"
        />
      </div>

      {/* 9-Month Roadmap Progress Bars */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Monthly Roadmap Progression (252 Days)
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          Real-time completion percentage calculated directly from your 28-day monthly sections.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {monthlyStats.map(m => (
            <div
              key={m.month}
              className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                  Month {m.month}
                </span>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {m.pct}%
                </div>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {m.completed}/{m.total} Days
                </span>
              </div>

              <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strongest vs Weakest Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Strongest DSA Topics
            </h3>
          </div>
          {strongestTopics.length === 0 ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 py-4">
              No DSA problems marked as Solved or Revised yet. Mark problems solved in the DSA Tracker to reveal your strongest topics.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              {strongestTopics.map(t => (
                <div key={t.topic} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{t.topic}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {t.pct}% ({t.solved}/{t.total})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Focus Areas / Weakest Topics
            </h3>
          </div>
          {weakestTopics.length === 0 ? (
            <p className="text-xs text-emerald-500 font-semibold py-4">
              Every tracked DSA topic is at 100% completion!
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              {weakestTopics.map(t => (
                <div key={t.topic} className="flex items-center justify-between p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{t.topic}</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {t.pct}% ({t.solved}/{t.total})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Real Topic & Module Breakdown Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DSA Topics */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              DSA Topic Completion
            </h3>
            <span className="text-xs font-bold text-emerald-500">
              {dsaRate}% Overall
            </span>
          </div>

          {dsaTopicBreakdown.length === 0 ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 py-4">
              No DSA problems tracked yet. Add or solve problems in the DSA Tracker to inspect topic-level completion.
            </p>
          ) : (
            <div className="space-y-3.5 text-xs">
              {dsaTopicBreakdown.map(item => (
                <div key={item.topic}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-neutral-700 dark:text-neutral-300">{item.topic}</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold">
                      {item.pct}% ({item.solved}/{item.total})
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backend Modules */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Backend Modules Completion
            </h3>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {backendRate}% Overall
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {backendBreakdown.map(mod => (
              <div key={mod.id}>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-neutral-700 dark:text-neutral-300 truncate pr-2">
                    {mod.title}
                  </span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-bold shrink-0">
                    {mod.pct}% ({mod.done}/{mod.total})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${mod.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
