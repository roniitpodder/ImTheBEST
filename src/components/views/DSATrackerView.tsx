import React, { useEffect, useState } from 'react';
import { getLocalDateStr, useApp } from '../../context/AppContext';
import { DSAProblem, Difficulty, ProblemStatus } from '../../types';
import { DSA_TOPICS_LIST } from '../../data/dsaInitialData';
import {
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export const DSATrackerView: React.FC = () => {
  const { dsaProblems, addDSAProblem, updateDSAProblem, deleteDSAProblem } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterTopic, setFilterTopic] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<DSAProblem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium' as Difficulty,
    leetCodeUrl: '',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    notes: '',
    status: 'Not Started' as ProblemStatus,
    revisitDate: '',
    dateAttempted: ''
  });

  useEffect(() => {
    if (!showAddModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAddModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAddModal]);

  const topics = Array.from(new Set([...DSA_TOPICS_LIST, ...dsaProblems.map(p => p.topic)]));

  const filteredProblems = dsaProblems.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.notes.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q);
    const matchesDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    const matchesTopic = filterTopic === 'All' || p.topic === filterTopic;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesDiff && matchesTopic && matchesStatus;
  });

  const easySolved = dsaProblems.filter(
    p => p.difficulty === 'Easy' && (p.status === 'Solved' || p.status === 'Revised')
  ).length;
  const medSolved = dsaProblems.filter(
    p => p.difficulty === 'Medium' && (p.status === 'Solved' || p.status === 'Revised')
  ).length;
  const hardSolved = dsaProblems.filter(
    p => p.difficulty === 'Hard' && (p.status === 'Solved' || p.status === 'Revised')
  ).length;
  const totalSolved = easySolved + medSolved + hardSolved;
  const overallPct =
    dsaProblems.length > 0 ? Math.round((totalSolved / dsaProblems.length) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingProblem(null);
    setFormError(null);
    setFormData({
      name: '',
      topic: 'Arrays & Hashing',
      difficulty: 'Medium',
      leetCodeUrl: '',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      notes: '',
      status: 'Solved',
      revisitDate: '',
      dateAttempted: getLocalDateStr()
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (prob: DSAProblem) => {
    setEditingProblem(prob);
    setFormError(null);
    setFormData({
      name: prob.name,
      topic: prob.topic,
      difficulty: prob.difficulty,
      leetCodeUrl: prob.leetCodeUrl,
      timeComplexity: prob.timeComplexity,
      spaceComplexity: prob.spaceComplexity,
      notes: prob.notes,
      status: prob.status,
      revisitDate: prob.revisitDate || '',
      dateAttempted: prob.dateAttempted || ''
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const trimmed = formData.name.trim();
    if (!trimmed) {
      setFormError('Please enter a problem name.');
      return;
    }

    if (editingProblem) {
      const duplicateOther = dsaProblems.some(
        p => p.id !== editingProblem.id && p.name.trim().toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicateOther) {
        setFormError(`"${trimmed}" already exists in your tracker.`);
        return;
      }
      await updateDSAProblem(editingProblem.id, { ...formData, name: trimmed });
      setShowAddModal(false);
    } else {
      const res = await addDSAProblem({ ...formData, name: trimmed });
      if (!res.ok) {
        setFormError(res.error || 'Could not add problem.');
        return;
      }
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
            DSA Problem Mastery Tracker
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Track problem complexity, LeetCode URLs, solved dates, solution notes, and topic progress.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Problem</span>
        </button>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Solved
            </span>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              {overallPct}%
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {totalSolved}{' '}
            <span className="text-xs font-normal text-neutral-400">/ {dsaProblems.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            Easy Solved
          </span>
          <div className="text-2xl font-bold text-emerald-500 mt-1">{easySolved}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
            Medium Solved
          </span>
          <div className="text-2xl font-bold text-orange-500 mt-1">{medSolved}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">
            Hard Solved
          </span>
          <div className="text-2xl font-bold text-red-500 mt-1">{hardSolved}</div>
        </div>
      </div>

      {/* Topic-wise dynamic progress chips */}
      {dsaProblems.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Array.from(new Set(dsaProblems.map(p => p.topic))).map(topic => {
            const topicItems = dsaProblems.filter(p => p.topic === topic);
            const topicDone = topicItems.filter(
              p => p.status === 'Solved' || p.status === 'Revised'
            ).length;
            const active = filterTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setFilterTopic(active ? 'All' : topic)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap border transition cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-[#18181B] text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                {topic}: {topicDone}/{topicItems.length}
              </button>
            );
          })}
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-neutral-400" />
          <input
            type="text"
            aria-label="Search DSA problems"
            placeholder="Search problems by name, topic, or notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          aria-label="Filter by difficulty"
          value={filterDifficulty}
          onChange={e => setFilterDifficulty(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          aria-label="Filter by topic"
          value={filterTopic}
          onChange={e => setFilterTopic(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
        >
          <option value="All">All Topics</option>
          {topics.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by status"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Solved">Solved</option>
          <option value="Attempted">Attempted</option>
          <option value="Revised">Revised</option>
          <option value="Not Started">Not Started</option>
        </select>
      </div>

      {/* Problem Table or Empty State */}
      {filteredProblems.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {dsaProblems.length === 0
              ? 'No DSA problems tracked yet.'
              : 'No problems match your current search or filters.'}
          </p>
          <div className="flex justify-center gap-2">
            {dsaProblems.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDifficulty('All');
                  setFilterTopic('All');
                  setFilterStatus('All');
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Problem</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-[#202025] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Problem Name</th>
                  <th className="py-3 px-4 font-semibold">Topic</th>
                  <th className="py-3 px-4 font-semibold">Difficulty</th>
                  <th className="py-3 px-4 font-semibold">Complexity</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date Logged</th>
                  <th className="py-3 px-4 font-semibold">Notes / Trick</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredProblems.map(p => {
                  const diffColor =
                    p.difficulty === 'Easy'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900'
                      : p.difficulty === 'Medium'
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900'
                      : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900';

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-[#202025]/50 transition"
                    >
                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                        <div className="flex items-center space-x-2">
                          <span>{p.name}</span>
                          {p.leetCodeUrl && (
                            <a
                              href={p.leetCodeUrl}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open ${p.name} on LeetCode`}
                              className="text-blue-500 hover:text-blue-600"
                              title="Open in LeetCode"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                        {p.topic}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${diffColor}`}>
                          {p.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                        {p.timeComplexity || '—'} | {p.spaceComplexity || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          aria-label={`Change status for ${p.name}`}
                          value={p.status}
                          onChange={e =>
                            updateDSAProblem(p.id, {
                              status: e.target.value as ProblemStatus
                            })
                          }
                          className="text-[11px] font-medium bg-neutral-100 dark:bg-[#25252A] rounded-lg px-2 py-1 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Attempted">Attempted</option>
                          <option value="Solved">Solved</option>
                          <option value="Revised">Revised</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                        {p.dateAttempted || '—'}
                      </td>

                      <td
                        className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate"
                        title={p.notes}
                      >
                        {p.notes || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            aria-label={`Edit ${p.name}`}
                            className="p-1 rounded-md text-neutral-400 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                            title="Edit Problem"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDSAProblem(p.id)}
                            aria-label={`Delete ${p.name}`}
                            className="p-1 rounded-md text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                            title="Delete Problem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dsa-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 id="dsa-modal-title" className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {editingProblem ? 'Edit DSA Problem' : 'Log New DSA Problem'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Problem Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Subarray Sum Equals K"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    {topics.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={e =>
                      setFormData({ ...formData, difficulty: e.target.value as Difficulty })
                    }
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => {
                      const nextStatus = e.target.value as ProblemStatus;
                      setFormData({
                        ...formData,
                        status: nextStatus,
                        dateAttempted:
                          nextStatus === 'Not Started'
                            ? ''
                            : formData.dateAttempted || getLocalDateStr()
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Attempted">Attempted</option>
                    <option value="Solved">Solved</option>
                    <option value="Revised">Revised</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Date Solved / Attempted
                  </label>
                  <input
                    type="date"
                    value={formData.dateAttempted}
                    onChange={e => setFormData({ ...formData, dateAttempted: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  LeetCode URL
                </label>
                <input
                  type="url"
                  value={formData.leetCodeUrl}
                  onChange={e => setFormData({ ...formData, leetCodeUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Time Complexity
                  </label>
                  <input
                    type="text"
                    value={formData.timeComplexity}
                    onChange={e => setFormData({ ...formData, timeComplexity: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                    placeholder="O(N)"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Space Complexity
                  </label>
                  <input
                    type="text"
                    value={formData.spaceComplexity}
                    onChange={e => setFormData({ ...formData, spaceComplexity: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                    placeholder="O(1)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Spaced-Repetition Revisit Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.revisitDate}
                  onChange={e => setFormData({ ...formData, revisitDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Personal Solution Notes / Edge Cases
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Use complement hashmap, check for negative nums, zero edge case..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
                >
                  {editingProblem ? 'Update Problem' : 'Save Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
