import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Note } from '../../types';
import {
  Plus,
  Pin,
  Trash2,
  Search,
  BookOpen,
  Check,
  Copy,
  RotateCcw
} from 'lucide-react';

const CATEGORIES: Note['category'][] = [
  'Java',
  'DSA',
  'Spring Boot',
  'SQL',
  'DBMS',
  'OS',
  'Computer Networks',
  'System Design',
  'Projects',
  'Interview Preparation'
];

export const NotesView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);

  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<Note['category']>('Java');
  const [contentInput, setContentInput] = useState('');
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const activeNote =
    notes.find(n => n.id === activeNoteId) ||
    (notes.length > 0 && activeNoteId === null && !isEditing ? notes[0] : null);

  const filteredNotes = notes.filter(n => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const handleStartNewNote = () => {
    setTitleInput('');
    setCategoryInput('Java');
    setContentInput('');
    setIsEditing(true);
    setActiveNoteId(null);
  };

  const handleSave = async () => {
    if (!titleInput.trim()) return;
    if (activeNote) {
      await updateNote(activeNote.id, {
        title: titleInput.trim(),
        category: categoryInput,
        content: contentInput
      });
      setIsEditing(false);
    } else {
      const createdId = await addNote({
        title: titleInput.trim(),
        category: categoryInput,
        content: contentInput,
        isPinned: false
      });
      if (createdId) {
        setActiveNoteId(createdId);
      }
      setIsEditing(false);
    }
  };

  const handleCopyContent = async () => {
    if (!activeNote) return;
    try {
      await navigator.clipboard.writeText(activeNote.content);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      setCopied(true);
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2000);
    } catch {
      // ignore if clipboard blocked
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
              Technical Knowledge Base & Revision Notes
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
              {notes.length} Notes Stored
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Maintain your personal second brain across Java, Spring Boot, DSA patterns, OS, DBMS, Networks, and System Design.
          </p>
        </div>

        <button
          onClick={handleStartNewNote}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Note list & filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                aria-label="Search notes"
                placeholder="Search notes content..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              aria-label="Filter notes by category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="All">All Topics</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[320px] lg:max-h-[640px] overflow-y-auto pr-1">
            {sortedNotes.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 text-center space-y-2.5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {notes.length === 0
                    ? 'You have not written any revision notes yet.'
                    : 'No notes match your search or topic filter.'}
                </p>
                {notes.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            ) : (
              sortedNotes.map(n => {
                const isSelected = activeNote?.id === n.id;
                const openNote = () => {
                  setActiveNoteId(n.id);
                  setIsEditing(false);
                };
                return (
                  <div
                    key={n.id}
                    role="button"
                    tabIndex={0}
                    onClick={openNote}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openNote();
                      }
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 dark:bg-blue-950/40 dark:border-blue-500 shadow-xs'
                        : 'bg-white dark:bg-[#18181B] border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                        {n.category}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          updateNote(n.id, { isPinned: !n.isPinned });
                        }}
                        aria-label={n.isPinned ? 'Unpin note' : 'Pin note'}
                        className={`cursor-pointer ${
                          n.isPinned ? 'text-amber-400' : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                        title={n.isPinned ? 'Unpin note' : 'Pin note to top'}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1 truncate">
                      {n.title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {n.content}
                    </p>
                    <span className="block text-[10px] text-neutral-400 mt-2">
                      Updated {n.updatedAt}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Viewer / Editor */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs min-h-[520px] flex flex-col justify-between">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note Title..."
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                className="w-full text-xl font-bold bg-transparent border-b border-neutral-200 dark:border-neutral-800 pb-2 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
              />

              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-500 font-medium">Category:</span>
                <select
                  aria-label="Note category"
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value as Note['category'])}
                  className="text-xs p-2 rounded-xl bg-neutral-100 dark:bg-[#202025] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows={16}
                value={contentInput}
                onChange={e => setContentInput(e.target.value)}
                placeholder="Write markdown technical notes, edge cases, formulas, and architecture principles here..."
                className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 font-mono leading-relaxed focus:outline-none focus:border-blue-500"
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!titleInput.trim()}
                  className="px-4 py-2 text-xs rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : activeNote ? (
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 gap-3">
                  <div>
                    <span className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400">
                      {activeNote.category}
                    </span>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {activeNote.title}
                    </h3>
                    <span className="text-[11px] text-neutral-400 mt-0.5 block">
                      Last edited {activeNote.updatedAt}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyContent}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-semibold flex items-center space-x-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTitleInput(activeNote.title);
                        setCategoryInput(activeNote.category);
                        setContentInput(activeNote.content);
                        setIsEditing(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 text-xs font-semibold hover:bg-blue-100 cursor-pointer"
                    >
                      Edit Note
                    </button>
                    <button
                      onClick={async () => {
                        await deleteNote(activeNote.id);
                        setActiveNoteId(null);
                      }}
                      aria-label="Delete note"
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 text-xs text-neutral-800 dark:text-neutral-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {activeNote.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-sm py-16 text-center space-y-3">
              <BookOpen className="w-8 h-8 opacity-50" />
              <span>Select a note from the left or create a new technical document.</span>
              <button
                onClick={handleStartNewNote}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                Create Your First Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
