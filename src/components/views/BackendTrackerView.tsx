import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink, CheckCircle2, Circle, Search, RotateCcw } from 'lucide-react';

export const BackendTrackerView: React.FC = () => {
  const { backendModules, toggleLessonCompletion } = useApp();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const q = searchTerm.trim().toLowerCase();
  const filteredModules = backendModules
    .filter(m => selectedModuleId === 'all' || m.id === selectedModuleId)
    .map(m => ({
      ...m,
      lessons: q
        ? m.lessons.filter(l => l.title.toLowerCase().includes(q))
        : m.lessons
    }))
    .filter(m => m.lessons.length > 0 || (q && m.title.toLowerCase().includes(q)));

  const allLessons = backendModules.flatMap(m => m.lessons);
  const totalCompleted = allLessons.filter(l => l.completed).length;
  const pct = allLessons.length > 0 ? Math.round((totalCompleted / allLessons.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
              Backend Engineering Curriculum Tracker
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-semibold border border-purple-200 dark:border-purple-900">
              Java 21 • Spring Boot 3 • PostgreSQL
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Track mastery of core modules from JVM internals to Redis caching, Kafka streaming, and AWS deployment.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-2xl self-start sm:self-auto">
          <span className="text-neutral-500 dark:text-neutral-400">Total Completion:</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {pct}% ({totalCompleted}/{allLessons.length} units)
          </span>
        </div>
      </div>

      {/* Search & Module Selector Filter */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-neutral-400" />
          <input
            type="text"
            aria-label="Search backend topics and lessons"
            placeholder="Search backend lessons or topics..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedModuleId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedModuleId === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#18181B] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            All Modules ({backendModules.length})
          </button>
          {backendModules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setSelectedModuleId(mod.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedModuleId === mod.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#18181B] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {mod.title.split('.')[1]?.trim() || mod.title}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid or Empty State */}
      {filteredModules.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            No backend lessons match your search.
          </p>
          <button
            onClick={() => {
              setSelectedModuleId('all');
              setSearchTerm('');
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredModules.map(mod => {
            const fullMod = backendModules.find(bm => bm.id === mod.id) || mod;
            const completedCount = fullMod.lessons.filter(l => l.completed).length;
            const modPct =
              fullMod.lessons.length > 0
                ? Math.round((completedCount / fullMod.lessons.length) * 100)
                : 0;

            return (
              <div
                key={mod.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {mod.title}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 shrink-0">
                      {modPct}% ({completedCount}/{fullMod.lessons.length})
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mt-3 mb-4">
                    <div
                      className="h-full bg-purple-600 dark:bg-purple-500 transition-all duration-300"
                      style={{ width: `${modPct}%` }}
                    />
                  </div>

                  {/* Lessons list */}
                  <div className="space-y-2.5">
                    {mod.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-xs transition hover:border-neutral-300 dark:hover:border-neutral-700 gap-2"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <button
                            onClick={() => toggleLessonCompletion(mod.id, lesson.id)}
                            aria-label={`Mark ${lesson.title} ${lesson.completed ? 'incomplete' : 'complete'}`}
                            className="text-emerald-500 hover:scale-110 transition cursor-pointer shrink-0"
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white dark:text-neutral-900" />
                            ) : (
                              <Circle className="w-4 h-4 text-neutral-400" />
                            )}
                          </button>
                          <span
                            className={`font-semibold truncate ${
                              lesson.completed
                                ? 'line-through text-neutral-400'
                                : 'text-neutral-900 dark:text-neutral-100'
                            }`}
                          >
                            {lesson.title}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-neutral-400 shrink-0">
                          <span className="text-[11px] font-medium">{lesson.duration}</span>
                          <a
                            href={lesson.documentationUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Documentation for ${lesson.title}`}
                            className="hover:text-purple-600 p-1"
                            title="Official Documentation"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
