import React, { useEffect, useState } from 'react';
import { getLocalDateStr, useApp } from '../../context/AppContext';
import { Project } from '../../types';
import {
  Plus,
  Github,
  ExternalLink,
  CheckSquare,
  Square,
  Trash2,
  Edit2,
  X,
  Calendar,
  FolderGit2
} from 'lucide-react';

type ProjectStatusFilter = 'All' | Project['status'];

export const ProjectsView: React.FC = () => {
  const { projects, toggleMilestone, addProject, updateProject, deleteProject } = useApp();

  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: 'Spring Boot 3, Java 21, PostgreSQL',
    startDate: getLocalDateStr(),
    deadline: '',
    status: 'Planned' as Project['status'],
    githubUrl: '',
    liveUrl: '',
    notes: '',
    milestonesText:
      'Domain Model and Architecture Design\nCore REST / Kafka Pipeline Implementation\nComprehensive Integration Test Suite\nDockerization and Cloud Deployment'
  });

  useEffect(() => {
    if (!showAddModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAddModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAddModal]);

  const filteredProjects =
    statusFilter === 'All'
      ? projects
      : projects.filter(p => p.status === statusFilter);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: 'Spring Boot 3, Java 21, PostgreSQL',
      startDate: getLocalDateStr(),
      deadline: '',
      status: 'In Progress',
      githubUrl: '',
      liveUrl: '',
      notes: '',
      milestonesText:
        'Domain Model and Architecture Design\nCore Business Logic & API\nUnit and Integration Tests\nDockerfile & Documentation'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      description: proj.description,
      techStack: proj.techStack.join(', '),
      startDate: proj.startDate,
      deadline: proj.deadline,
      status: proj.status,
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      notes: proj.notes,
      milestonesText: proj.milestones.map(m => m.title).join('\n')
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const milestones = formData.milestonesText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((t, idx) => {
        const matchedByTitle = editingProject?.milestones.find(m => m.title === t);
        const existingMilestone = matchedByTitle || editingProject?.milestones[idx];
        return {
          id: existingMilestone ? existingMilestone.id : `m-${Date.now()}-${idx}`,
          title: t,
          completed: existingMilestone ? existingMilestone.completed : false
        };
      });

    const projectPayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      techStack: formData.techStack
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      startDate: formData.startDate,
      deadline: formData.deadline,
      status: formData.status,
      githubUrl: formData.githubUrl.trim(),
      liveUrl: formData.liveUrl.trim(),
      notes: formData.notes.trim(),
      milestones
    };

    if (editingProject) {
      await updateProject(editingProject.id, projectPayload);
    } else {
      await addProject(projectPayload);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
              Industry Portfolio & Capstone Projects
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
              {projects.filter(p => p.status === 'Completed').length} / {projects.length} Completed
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Build real, production-ready distributed backends with verifiable GitHub repositories and architectural milestones.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Planned', 'In Progress', 'Completed'] as ProjectStatusFilter[]).map(st => {
          const count =
            st === 'All' ? projects.length : projects.filter(p => p.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#18181B] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
          <FolderGit2 className="w-8 h-8 mx-auto text-neutral-400" />
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            No projects in “{statusFilter}” status yet.
          </p>
          <div className="flex justify-center gap-2">
            {statusFilter !== 'All' && (
              <button
                onClick={() => setStatusFilter('All')}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold cursor-pointer"
              >
                Show All Projects
              </button>
            )}
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(proj => {
            const completedCount = proj.milestones.filter(m => m.completed).length;
            const totalMilestones = proj.milestones.length;
            const pct =
              totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

            return (
              <div
                key={proj.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Status bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        proj.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                          : proj.status === 'In Progress'
                          ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {proj.status} • {pct}% ({completedCount}/{totalMilestones})
                    </span>

                    <div className="flex items-center space-x-2">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${proj.title} GitHub repository`}
                          className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${proj.title} live deployment`}
                          className="p-1 rounded text-neutral-500 hover:text-blue-600"
                          title="Live Deployment"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        aria-label={`Edit ${proj.title}`}
                        className="p-1 rounded text-neutral-400 hover:text-blue-600 cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        aria-label={`Delete ${proj.title}`}
                        className="p-1 rounded text-neutral-400 hover:text-red-600 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-3">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    {proj.description}
                  </p>

                  {(proj.startDate || proj.deadline) && (
                    <div className="flex items-center space-x-3 mt-2.5 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {proj.startDate ? `Start: ${proj.startDate}` : ''}
                        {proj.startDate && proj.deadline ? ' • ' : ''}
                        {proj.deadline ? `Target: ${proj.deadline}` : ''}
                      </span>
                    </div>
                  )}

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.techStack.map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 dark:bg-[#202025] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Milestones checklist */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
                      Milestones Checklist
                    </span>
                    {proj.milestones.map(m => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => toggleMilestone(proj.id, m.id)}
                        className="w-full flex items-center space-x-2 text-xs cursor-pointer hover:opacity-85 select-none text-left"
                      >
                        {m.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-300 dark:text-neutral-700 shrink-0" />
                        )}
                        <span
                          className={`text-xs ${
                            m.completed
                              ? 'line-through text-neutral-400'
                              : 'text-neutral-900 dark:text-neutral-100 font-medium'
                          }`}
                        >
                          {m.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {proj.notes && (
                  <div className="mt-4 p-3 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 italic">
                    {proj.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 id="project-modal-title" className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {editingProject ? 'Edit Project' : 'Add New Portfolio Project'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Description & Architecture
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as Project['status'] })
                    }
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Live Demo / Cloud URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Milestones (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.milestonesText}
                  onChange={e => setFormData({ ...formData, milestonesText: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Key Architectural Takeaways / Interview Pitch
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  placeholder="e.g. Demonstrates idempotency and Redis distributed locks under high concurrency"
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
                  {editingProject ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
