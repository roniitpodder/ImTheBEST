import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType
} from '../firebase';
import {
  DailyTask,
  DSAProblem,
  BackendModule,
  Project,
  Note,
  WeeklyAssessment,
  UserProfile
} from '../types';
import { generate252Roadmap } from '../data/roadmapData';
import { INITIAL_DSA_PROBLEMS } from '../data/dsaInitialData';
import { BACKEND_MODULES } from '../data/backendModules';
import { INITIAL_PROJECTS } from '../data/initialProjects';
import { SAMPLE_WEEKLY_TESTS } from '../data/sampleTests';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isLocal?: boolean;
}

interface RoadmapProgressDoc {
  ownerId: string;
  dayNumber: number;
  dsaCompleted: boolean;
  backendCompleted: boolean;
  revisionCompleted: boolean;
  githubPushed: boolean;
  isCompleted: boolean;
  userNotes: string;
  completedAt: string;
}

interface LocalWorkspaceData {
  userProfile: UserProfile;
  roadmapProgressMap: Record<string, RoadmapProgressDoc>;
  dsaProblems: DSAProblem[];
  backendLessonState: Record<string, boolean>;
  projects: Project[];
  notes: Note[];
  weeklyTestResults: Record<string, { completed: boolean; score: number }>;
}

interface AppContextType {
  user: AppUser | null;
  isCloudMode: boolean;
  authLoading: boolean;
  dataLoading: boolean;
  authError: string | null;
  syncError: string | null;
  clearSyncError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInLocalProfile: (name: string, email: string) => void;
  signOutUser: () => Promise<void>;
  theme: 'dark' | 'light';
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  roadmapTasks: DailyTask[];
  toggleTaskCompletion: (dayNumber: number, taskType: 'dsa' | 'backend' | 'revision') => Promise<void>;
  toggleDayComplete: (dayNumber: number) => Promise<void>;
  updateUserNotes: (dayNumber: number, notes: string) => Promise<void>;
  dsaProblems: DSAProblem[];
  addDSAProblem: (problem: Omit<DSAProblem, 'id'>) => Promise<{ ok: boolean; error?: string }>;
  updateDSAProblem: (id: string, updated: Partial<DSAProblem>) => Promise<void>;
  deleteDSAProblem: (id: string) => Promise<void>;
  backendModules: BackendModule[];
  toggleLessonCompletion: (moduleId: string, lessonId: string) => Promise<void>;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => Promise<string | null>;
  updateNote: (id: string, updated: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  weeklyTests: WeeklyAssessment[];
  submitTestScore: (testId: string, score: number) => Promise<void>;
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => Promise<boolean>;
  resetAllProgress: () => Promise<void>;
  currentStreak: number;
  longestStreak: number;
  totalStudyHours: number;
  overallCompletionPct: number;
  completedDaysCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Software Engineer',
  degree: 'B.Tech in Computer Science Engineering',
  targetRole: 'Software Engineer / Backend Engineer',
  targetCompanies: ['Apple', 'Google', 'Microsoft', 'Amazon', 'Meta'],
  primaryLanguage: 'Java',
  framework: 'Spring Boot',
  database: 'PostgreSQL',
  dailyHours: 3,
  roadmapDays: 252
};

const LOCAL_SESSION_KEY = 'imthebest_local_session_v1';
const localDataKey = (uid: string) => `imthebest_local_workspace_v1_${uid}`;

const clip = (val: string | undefined, max: number): string => (val || '').slice(0, max);

const sanitizeId = (raw: string | undefined, fallbackPrefix: string, index: number): string => {
  const cleaned = (raw || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  return cleaned || `${fallbackPrefix}-${Date.now()}-${index}`;
};

const VALID_DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard']);
const VALID_PROBLEM_STATUSES = new Set(['Not Started', 'Attempted', 'Solved', 'Revised']);
const VALID_PROJECT_STATUSES = new Set(['Planned', 'In Progress', 'Completed']);
const VALID_NOTE_CATEGORIES = new Set([
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
]);

export const getLocalDateStr = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseLocalDateDays = (dateStr: string): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;
  const utcMs = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Math.floor(utcMs / 86400000);
};

const createInitialLocalData = (name: string): LocalWorkspaceData => ({
  userProfile: { ...DEFAULT_PROFILE, name: clip(name, 100) || DEFAULT_PROFILE.name },
  roadmapProgressMap: {},
  dsaProblems: INITIAL_DSA_PROBLEMS.map(p => ({ ...p, status: 'Not Started', dateAttempted: '' })),
  backendLessonState: {},
  projects: INITIAL_PROJECTS.map(proj => ({
    ...proj,
    status: 'Planned',
    milestones: proj.milestones.map(m => ({ ...m, completed: false }))
  })),
  notes: [],
  weeklyTestResults: {}
});

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme preference: system | light | dark (persisted cleanly)
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem('imthebest_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    return 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const theme: 'dark' | 'light' =
    themePreference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : themePreference;

  useEffect(() => {
    localStorage.setItem('imthebest_theme', themePreference);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, themePreference]);

  const setThemePreference = (pref: ThemePreference) => setThemePreferenceState(pref);
  const toggleTheme = () => setThemePreferenceState(theme === 'dark' ? 'light' : 'dark');

  // Auth & Sync State
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Per-User State
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [roadmapProgressMap, setRoadmapProgressMap] = useState<Record<string, RoadmapProgressDoc>>({});
  const [dsaProblems, setDsaProblems] = useState<DSAProblem[]>([]);
  const [backendLessonState, setBackendLessonState] = useState<Record<string, boolean>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [weeklyTestResults, setWeeklyTestResults] = useState<
    Record<string, { completed: boolean; score: number }>
  >({});

  const baseRoadmap = useMemo(() => generate252Roadmap(), []);
  const clearSyncError = () => setSyncError(null);

  const reportError = (error: unknown, operationType: OperationType, path: string | null) => {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes('permission') || message.toLowerCase().includes('insufficient')) {
      try {
        handleFirestoreError(error, operationType, path);
      } catch (wrapped) {
        setSyncError(
          'Database permission check failed. Please verify your session and Firestore rules.'
        );
        console.error(wrapped);
      }
    } else {
      setSyncError(`Sync warning: ${message}`);
    }
  };

  // Persist local workspace helper (only when in Local Workspace Mode)
  const saveLocalWorkspace = (uid: string, data: LocalWorkspaceData) => {
    try {
      localStorage.setItem(localDataKey(uid), JSON.stringify(data));
    } catch {
      setSyncError('Unable to write to browser storage (storage quota may be full).');
    }
  };

  const loadLocalWorkspace = (uid: string, name: string): LocalWorkspaceData => {
    try {
      const raw = localStorage.getItem(localDataKey(uid));
      if (raw) {
        return JSON.parse(raw) as LocalWorkspaceData;
      }
    } catch {
      // fall through to fresh workspace
    }
    const fresh = createInitialLocalData(name);
    saveLocalWorkspace(uid, fresh);
    return fresh;
  };

  const applyLocalWorkspaceToState = (data: LocalWorkspaceData) => {
    setUserProfile(data.userProfile || DEFAULT_PROFILE);
    setRoadmapProgressMap(data.roadmapProgressMap || {});
    setDsaProblems(Array.isArray(data.dsaProblems) ? data.dsaProblems : []);
    setBackendLessonState(data.backendLessonState || {});
    setProjects(Array.isArray(data.projects) ? data.projects : []);
    setNotes(Array.isArray(data.notes) ? data.notes : []);
    setWeeklyTestResults(data.weeklyTestResults || {});
  };

  // Sync current state snapshot to localStorage when using local workspace mode
  const persistLocalSnapshot = (overrides: Partial<LocalWorkspaceData>) => {
    if (!user?.isLocal) return;
    const next: LocalWorkspaceData = {
      userProfile: overrides.userProfile ?? userProfile,
      roadmapProgressMap: overrides.roadmapProgressMap ?? roadmapProgressMap,
      dsaProblems: overrides.dsaProblems ?? dsaProblems,
      backendLessonState: overrides.backendLessonState ?? backendLessonState,
      projects: overrides.projects ?? projects,
      notes: overrides.notes ?? notes,
      weeklyTestResults: overrides.weeklyTestResults ?? weeklyTestResults
    };
    saveLocalWorkspace(user.uid, next);
  };

  // Auth Actions
  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setAuthError(
        'Firebase credentials are not configured in this environment. Use Local Workspace Mode below or add VITE_FIREBASE_* environment variables.'
      );
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/unauthorized-domain') {
        setAuthError(
          `Domain "${window.location.hostname}" is not yet authorized in Firebase Auth. Add it in Firebase Console → Authentication → Settings → Authorized domains.`
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed before completing.');
      } else {
        setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
      }
    }
  };

  const signInLocalProfile = (name: string, email: string) => {
    setAuthError(null);
    const cleanEmail = (email || 'local@imthebest.dev').trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0] || 'Candidate').trim();
    const uid = `local-${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
    const localUser: AppUser = {
      uid,
      displayName: cleanName,
      email: cleanEmail,
      photoURL: null,
      isLocal: true
    };
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(localUser));
    setUser(localUser);
    const data = loadLocalWorkspace(uid, cleanName);
    applyLocalWorkspaceToState(data);
    setAuthLoading(false);
    setDataLoading(false);
  };

  const signOutUser = async () => {
    setSyncError(null);
    if (user?.isLocal || !auth) {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      setUser(null);
      setUserProfile(DEFAULT_PROFILE);
      setRoadmapProgressMap({});
      setDsaProblems([]);
      setBackendLessonState({});
      setProjects([]);
      setNotes([]);
      setWeeklyTestResults({});
      return;
    }
    await signOut(auth);
  };

  // Initialize brand-new Cloud user document & 0%-progress starter collections
  const initializeNewUserWorkspace = async (currentUser: AppUser) => {
    const firestore = db;
    if (!firestore) return;
    const uid = currentUser.uid;
    const userRef = doc(firestore, 'users', uid);

    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const batch = writeBatch(firestore);
        const initialName = clip(
          currentUser.displayName || currentUser.email?.split('@')[0] || 'Candidate',
          100
        );
        const initialEmail = clip(currentUser.email || 'user@example.com', 320);

        batch.set(userRef, {
          uid,
          email: initialEmail,
          name: initialName,
          degree: DEFAULT_PROFILE.degree,
          targetRole: DEFAULT_PROFILE.targetRole,
          targetCompanies: DEFAULT_PROFILE.targetCompanies,
          primaryLanguage: DEFAULT_PROFILE.primaryLanguage,
          framework: DEFAULT_PROFILE.framework,
          database: DEFAULT_PROFILE.database,
          dailyHours: DEFAULT_PROFILE.dailyHours,
          roadmapDays: DEFAULT_PROFILE.roadmapDays,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        INITIAL_DSA_PROBLEMS.forEach(p => {
          const pRef = doc(firestore, 'users', uid, 'dsaProblems', p.id);
          batch.set(pRef, {
            ownerId: uid,
            name: clip(p.name, 200),
            topic: clip(p.topic, 100),
            difficulty: p.difficulty,
            leetCodeUrl: clip(p.leetCodeUrl, 500),
            status: 'Not Started',
            timeComplexity: clip(p.timeComplexity, 100),
            spaceComplexity: clip(p.spaceComplexity, 100),
            notes: clip(p.notes, 5000),
            revisitDate: '',
            dateAttempted: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });

        INITIAL_PROJECTS.forEach(proj => {
          const projRef = doc(firestore, 'users', uid, 'projects', proj.id);
          batch.set(projRef, {
            ownerId: uid,
            title: clip(proj.title, 200),
            description: clip(proj.description, 2000),
            techStack: proj.techStack.slice(0, 20),
            startDate: clip(proj.startDate, 30),
            deadline: clip(proj.deadline, 30),
            status: 'Planned',
            githubUrl: clip(proj.githubUrl, 500),
            liveUrl: clip(proj.liveUrl, 500),
            milestones: proj.milestones.slice(0, 30).map(m => ({ ...m, completed: false })),
            notes: clip(proj.notes, 5000),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });

        await batch.commit();
      }
    } catch (error) {
      reportError(error, OperationType.WRITE, `users/${uid}`);
    }
  };

  // Subscribe to Auth State & Workspace Data
  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      // Local Workspace Mode boot
      try {
        const raw = localStorage.getItem(LOCAL_SESSION_KEY);
        if (raw) {
          const localUser = JSON.parse(raw) as AppUser;
          setUser(localUser);
          const data = loadLocalWorkspace(localUser.uid, localUser.displayName || 'Candidate');
          applyLocalWorkspaceToState(data);
        }
      } catch {
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
      setAuthLoading(false);
      setDataLoading(false);
      return;
    }

    let unsubscribes: (() => void)[] = [];
    const firestore = db;

    const unsubAuth = onAuthStateChanged(auth, async fbUser => {
      unsubscribes.forEach(u => u());
      unsubscribes = [];

      if (!fbUser) {
        setUser(null);
        setAuthLoading(false);
        setUserProfile(DEFAULT_PROFILE);
        setRoadmapProgressMap({});
        setDsaProblems([]);
        setBackendLessonState({});
        setProjects([]);
        setNotes([]);
        setWeeklyTestResults({});
        setDataLoading(false);
        return;
      }

      const currentUser: AppUser = {
        uid: fbUser.uid,
        displayName: fbUser.displayName,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        isLocal: false
      };

      setUser(currentUser);
      setAuthLoading(false);
      setDataLoading(true);
      setSyncError(null);

      const uid = currentUser.uid;
      try {
        await initializeNewUserWorkspace(currentUser);
      } finally {
        // Attach listeners even if offline cache is active; each listener resolves loading
      }

      const profilePath = `users/${uid}`;
      const unsubProfile = onSnapshot(
        doc(firestore, 'users', uid),
        snap => {
          if (snap.exists()) {
            const d = snap.data();
            setUserProfile({
              name: d.name || DEFAULT_PROFILE.name,
              degree: d.degree || DEFAULT_PROFILE.degree,
              targetRole: d.targetRole || DEFAULT_PROFILE.targetRole,
              targetCompanies: Array.isArray(d.targetCompanies)
                ? d.targetCompanies
                : DEFAULT_PROFILE.targetCompanies,
              primaryLanguage: d.primaryLanguage || DEFAULT_PROFILE.primaryLanguage,
              framework: d.framework || DEFAULT_PROFILE.framework,
              database: d.database || DEFAULT_PROFILE.database,
              dailyHours: typeof d.dailyHours === 'number' ? d.dailyHours : 3,
              roadmapDays: typeof d.roadmapDays === 'number' ? d.roadmapDays : 252
            });
          }
          setDataLoading(false);
        },
        error => {
          setDataLoading(false);
          reportError(error, OperationType.GET, profilePath);
        }
      );

      const roadmapPath = `users/${uid}/roadmapProgress`;
      const unsubRoadmap = onSnapshot(
        query(collection(firestore, 'users', uid, 'roadmapProgress'), where('ownerId', '==', uid)),
        snap => {
          const map: Record<string, RoadmapProgressDoc> = {};
          snap.forEach(docSnap => {
            map[docSnap.id] = docSnap.data() as RoadmapProgressDoc;
          });
          setRoadmapProgressMap(map);
        },
        error => reportError(error, OperationType.GET, roadmapPath)
      );

      const dsaPath = `users/${uid}/dsaProblems`;
      const unsubDsa = onSnapshot(
        query(collection(firestore, 'users', uid, 'dsaProblems'), where('ownerId', '==', uid)),
        snap => {
          const list: DSAProblem[] = [];
          snap.forEach(docSnap => {
            const d = docSnap.data();
            list.push({
              id: docSnap.id,
              name: d.name,
              topic: d.topic,
              difficulty: d.difficulty,
              leetCodeUrl: d.leetCodeUrl || '',
              status: d.status,
              timeComplexity: d.timeComplexity || '',
              spaceComplexity: d.spaceComplexity || '',
              notes: d.notes || '',
              revisitDate: d.revisitDate || '',
              dateAttempted: d.dateAttempted || ''
            });
          });
          list.sort((a, b) => a.id.localeCompare(b.id));
          setDsaProblems(list);
        },
        error => reportError(error, OperationType.GET, dsaPath)
      );

      const backendPath = `users/${uid}/backendLessons`;
      const unsubBackend = onSnapshot(
        query(collection(firestore, 'users', uid, 'backendLessons'), where('ownerId', '==', uid)),
        snap => {
          const map: Record<string, boolean> = {};
          snap.forEach(docSnap => {
            const d = docSnap.data();
            map[docSnap.id] = Boolean(d.completed);
          });
          setBackendLessonState(map);
        },
        error => reportError(error, OperationType.GET, backendPath)
      );

      const projectsPath = `users/${uid}/projects`;
      const unsubProjects = onSnapshot(
        query(collection(firestore, 'users', uid, 'projects'), where('ownerId', '==', uid)),
        snap => {
          const list: Project[] = [];
          snap.forEach(docSnap => {
            const d = docSnap.data();
            list.push({
              id: docSnap.id,
              title: d.title,
              description: d.description || '',
              techStack: Array.isArray(d.techStack) ? d.techStack : [],
              startDate: d.startDate || '',
              deadline: d.deadline || '',
              status: d.status || 'Planned',
              githubUrl: d.githubUrl || '',
              liveUrl: d.liveUrl || '',
              milestones: Array.isArray(d.milestones) ? d.milestones : [],
              notes: d.notes || ''
            });
          });
          list.sort((a, b) => a.title.localeCompare(b.title));
          setProjects(list);
        },
        error => reportError(error, OperationType.GET, projectsPath)
      );

      const notesPath = `users/${uid}/notes`;
      const unsubNotes = onSnapshot(
        query(collection(firestore, 'users', uid, 'notes'), where('ownerId', '==', uid)),
        snap => {
          const list: Note[] = [];
          snap.forEach(docSnap => {
            const d = docSnap.data();
            const updatedAtDate = d.updatedAt?.toDate
              ? getLocalDateStr(d.updatedAt.toDate())
              : getLocalDateStr();
            list.push({
              id: docSnap.id,
              title: d.title,
              category: d.category,
              content: d.content || '',
              isPinned: Boolean(d.isPinned),
              updatedAt: updatedAtDate
            });
          });
          setNotes(list);
        },
        error => reportError(error, OperationType.GET, notesPath)
      );

      const testsPath = `users/${uid}/weeklyTests`;
      const unsubTests = onSnapshot(
        query(collection(firestore, 'users', uid, 'weeklyTests'), where('ownerId', '==', uid)),
        snap => {
          const map: Record<string, { completed: boolean; score: number }> = {};
          snap.forEach(docSnap => {
            const d = docSnap.data();
            map[docSnap.id] = {
              completed: Boolean(d.completed),
              score: typeof d.score === 'number' ? d.score : 0
            };
          });
          setWeeklyTestResults(map);
        },
        error => reportError(error, OperationType.GET, testsPath)
      );

      unsubscribes = [
        unsubProfile,
        unsubRoadmap,
        unsubDsa,
        unsubBackend,
        unsubProjects,
        unsubNotes,
        unsubTests
      ];
    });

    return () => {
      unsubAuth();
      unsubscribes.forEach(u => u());
    };
  }, []);

  // Merge base 252-day curriculum with user's true progress
  const roadmapTasks: DailyTask[] = useMemo(() => {
    return baseRoadmap.map(day => {
      const prog = roadmapProgressMap[day.id];
      if (!prog) return day;
      return {
        ...day,
        dsa: { ...day.dsa, completed: prog.dsaCompleted },
        backend: { ...day.backend, completed: prog.backendCompleted },
        revision: {
          ...day.revision,
          completed: prog.revisionCompleted,
          githubPushed: prog.githubPushed
        },
        isCompleted: prog.isCompleted,
        userNotes: prog.userNotes,
        completedAt: prog.completedAt || undefined
      };
    });
  }, [baseRoadmap, roadmapProgressMap]);

  const backendModules: BackendModule[] = useMemo(() => {
    return BACKEND_MODULES.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(lesson => ({
        ...lesson,
        completed: Boolean(backendLessonState[lesson.id])
      }))
    }));
  }, [backendLessonState]);

  const weeklyTests: WeeklyAssessment[] = useMemo(() => {
    return SAMPLE_WEEKLY_TESTS.map(test => {
      const res = weeklyTestResults[test.id];
      if (!res) return test;
      return {
        ...test,
        completed: res.completed,
        score: res.score
      };
    });
  }, [weeklyTestResults]);

  // Profile Update
  const updateUserProfile = async (patch: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const merged: UserProfile = {
      ...userProfile,
      ...patch,
      name: clip((patch.name ?? userProfile.name).trim() || DEFAULT_PROFILE.name, 100),
      degree: clip(patch.degree ?? userProfile.degree, 150),
      targetRole: clip(patch.targetRole ?? userProfile.targetRole, 150),
      targetCompanies: (patch.targetCompanies ?? userProfile.targetCompanies).slice(0, 15),
      primaryLanguage: clip(patch.primaryLanguage ?? userProfile.primaryLanguage, 60) || 'Java',
      framework: clip(patch.framework ?? userProfile.framework, 60) || 'Spring Boot',
      database: clip(patch.database ?? userProfile.database, 60) || 'PostgreSQL',
      dailyHours: Math.min(24, Math.max(1, Number(patch.dailyHours ?? userProfile.dailyHours) || 3))
    };

    if (user.isLocal || !db) {
      setUserProfile(merged);
      persistLocalSnapshot({ userProfile: merged });
      return true;
    }

    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: merged.name,
        degree: merged.degree,
        targetRole: merged.targetRole,
        targetCompanies: merged.targetCompanies,
        primaryLanguage: merged.primaryLanguage,
        framework: merged.framework,
        database: merged.database,
        dailyHours: merged.dailyHours,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      reportError(error, OperationType.UPDATE, path);
      return false;
    }
  };

  // Persist a roadmap day document
  const persistRoadmapDay = async (
    dayNumber: number,
    nextState: {
      dsaCompleted: boolean;
      backendCompleted: boolean;
      revisionCompleted: boolean;
      githubPushed: boolean;
      userNotes: string;
      completedAt: string;
    }
  ) => {
    if (!user) return;
    const dayId = `day-${dayNumber}`;
    const isCompleted =
      nextState.dsaCompleted && nextState.backendCompleted && nextState.revisionCompleted;
    const resolvedCompletedAt = isCompleted
      ? nextState.completedAt || getLocalDateStr()
      : '';

    if (user.isLocal || !db) {
      const nextMap: Record<string, RoadmapProgressDoc> = {
        ...roadmapProgressMap,
        [dayId]: {
          ownerId: user.uid,
          dayNumber,
          dsaCompleted: nextState.dsaCompleted,
          backendCompleted: nextState.backendCompleted,
          revisionCompleted: nextState.revisionCompleted,
          githubPushed: nextState.githubPushed,
          isCompleted,
          userNotes: clip(nextState.userNotes, 5000),
          completedAt: resolvedCompletedAt
        }
      };
      setRoadmapProgressMap(nextMap);
      persistLocalSnapshot({ roadmapProgressMap: nextMap });
      return;
    }

    const path = `users/${user.uid}/roadmapProgress/${dayId}`;
    const docRef = doc(db, 'users', user.uid, 'roadmapProgress', dayId);

    try {
      const existingSnap = await getDoc(docRef);
      if (!existingSnap.exists()) {
        await setDoc(docRef, {
          ownerId: user.uid,
          dayNumber,
          dsaCompleted: nextState.dsaCompleted,
          backendCompleted: nextState.backendCompleted,
          revisionCompleted: nextState.revisionCompleted,
          githubPushed: nextState.githubPushed,
          isCompleted,
          userNotes: clip(nextState.userNotes, 5000),
          completedAt: resolvedCompletedAt,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(docRef, {
          dsaCompleted: nextState.dsaCompleted,
          backendCompleted: nextState.backendCompleted,
          revisionCompleted: nextState.revisionCompleted,
          githubPushed: nextState.githubPushed,
          isCompleted,
          userNotes: clip(nextState.userNotes, 5000),
          completedAt: resolvedCompletedAt,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      reportError(error, OperationType.WRITE, path);
    }
  };

  const toggleTaskCompletion = async (
    dayNumber: number,
    taskType: 'dsa' | 'backend' | 'revision'
  ) => {
    const current = roadmapTasks.find(d => d.dayNumber === dayNumber);
    if (!current) return;

    const dsaCompleted = taskType === 'dsa' ? !current.dsa.completed : current.dsa.completed;
    const backendCompleted =
      taskType === 'backend' ? !current.backend.completed : current.backend.completed;
    const revisionCompleted =
      taskType === 'revision' ? !current.revision.completed : current.revision.completed;
    const isCompleted = dsaCompleted && backendCompleted && revisionCompleted;

    await persistRoadmapDay(dayNumber, {
      dsaCompleted,
      backendCompleted,
      revisionCompleted,
      githubPushed: revisionCompleted,
      userNotes: current.userNotes || '',
      completedAt: isCompleted ? current.completedAt || getLocalDateStr() : ''
    });
  };

  const toggleDayComplete = async (dayNumber: number) => {
    const current = roadmapTasks.find(d => d.dayNumber === dayNumber);
    if (!current) return;

    const target = !current.isCompleted;
    await persistRoadmapDay(dayNumber, {
      dsaCompleted: target,
      backendCompleted: target,
      revisionCompleted: target,
      githubPushed: target,
      userNotes: current.userNotes || '',
      completedAt: target ? getLocalDateStr() : ''
    });
  };

  const updateUserNotes = async (dayNumber: number, notesStr: string) => {
    const current = roadmapTasks.find(d => d.dayNumber === dayNumber);
    if (!current) return;

    await persistRoadmapDay(dayNumber, {
      dsaCompleted: current.dsa.completed,
      backendCompleted: current.backend.completed,
      revisionCompleted: current.revision.completed,
      githubPushed: current.revision.githubPushed,
      userNotes: notesStr,
      completedAt: current.completedAt || ''
    });
  };

  // DSA CRUD (with duplicate prevention + solving date tracking)
  const addDSAProblem = async (
    problem: Omit<DSAProblem, 'id'>
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user) return { ok: false, error: 'You must be signed in.' };
    const trimmedName = problem.name.trim();
    if (!trimmedName) return { ok: false, error: 'Problem name is required.' };

    const duplicate = dsaProblems.some(
      p => p.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      return {
        ok: false,
        error: `"${trimmedName}" is already in your DSA tracker.`
      };
    }

    const resolvedDate =
      problem.status === 'Not Started'
        ? ''
        : clip(problem.dateAttempted || getLocalDateStr(), 30);

    const newProblem: DSAProblem = {
      id: `dsa-${Date.now()}`,
      name: clip(trimmedName, 200),
      topic: clip(problem.topic, 100) || 'Arrays & Hashing',
      difficulty: problem.difficulty,
      leetCodeUrl: clip(problem.leetCodeUrl, 500),
      status: problem.status,
      timeComplexity: clip(problem.timeComplexity, 100),
      spaceComplexity: clip(problem.spaceComplexity, 100),
      notes: clip(problem.notes, 5000),
      revisitDate: clip(problem.revisitDate, 30),
      dateAttempted: resolvedDate
    };

    if (user.isLocal || !db) {
      const next = [...dsaProblems, newProblem];
      setDsaProblems(next);
      persistLocalSnapshot({ dsaProblems: next });
      return { ok: true };
    }

    const path = `users/${user.uid}/dsaProblems/${newProblem.id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'dsaProblems', newProblem.id), {
        ownerId: user.uid,
        name: newProblem.name,
        topic: newProblem.topic,
        difficulty: newProblem.difficulty,
        leetCodeUrl: newProblem.leetCodeUrl,
        status: newProblem.status,
        timeComplexity: newProblem.timeComplexity,
        spaceComplexity: newProblem.spaceComplexity,
        notes: newProblem.notes,
        revisitDate: newProblem.revisitDate || '',
        dateAttempted: newProblem.dateAttempted,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { ok: true };
    } catch (error) {
      reportError(error, OperationType.CREATE, path);
      return { ok: false, error: 'Failed to save DSA problem.' };
    }
  };

  const updateDSAProblem = async (id: string, updated: Partial<DSAProblem>) => {
    if (!user) return;
    const existing = dsaProblems.find(p => p.id === id);
    if (!existing) return;
    const merged = { ...existing, ...updated };

    const resolvedDate =
      merged.status === 'Not Started'
        ? ''
        : updated.dateAttempted !== undefined
        ? clip(updated.dateAttempted, 30)
        : merged.dateAttempted || getLocalDateStr();

    const cleanMerged: DSAProblem = {
      ...merged,
      name: clip(merged.name, 200),
      topic: clip(merged.topic, 100),
      leetCodeUrl: clip(merged.leetCodeUrl, 500),
      timeComplexity: clip(merged.timeComplexity, 100),
      spaceComplexity: clip(merged.spaceComplexity, 100),
      notes: clip(merged.notes, 5000),
      revisitDate: clip(merged.revisitDate, 30),
      dateAttempted: resolvedDate
    };

    if (user.isLocal || !db) {
      const next = dsaProblems.map(p => (p.id === id ? cleanMerged : p));
      setDsaProblems(next);
      persistLocalSnapshot({ dsaProblems: next });
      return;
    }

    const path = `users/${user.uid}/dsaProblems/${id}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'dsaProblems', id), {
        name: cleanMerged.name,
        topic: cleanMerged.topic,
        difficulty: cleanMerged.difficulty,
        leetCodeUrl: cleanMerged.leetCodeUrl,
        status: cleanMerged.status,
        timeComplexity: cleanMerged.timeComplexity,
        spaceComplexity: cleanMerged.spaceComplexity,
        notes: cleanMerged.notes,
        revisitDate: cleanMerged.revisitDate || '',
        dateAttempted: cleanMerged.dateAttempted,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      reportError(error, OperationType.UPDATE, path);
    }
  };

  const deleteDSAProblem = async (id: string) => {
    if (!user) return;
    if (user.isLocal || !db) {
      const next = dsaProblems.filter(p => p.id !== id);
      setDsaProblems(next);
      persistLocalSnapshot({ dsaProblems: next });
      return;
    }

    const path = `users/${user.uid}/dsaProblems/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'dsaProblems', id));
    } catch (error) {
      reportError(error, OperationType.DELETE, path);
    }
  };

  // Backend Lessons toggle
  const toggleLessonCompletion = async (moduleId: string, lessonId: string) => {
    if (!user) return;
    const nextCompleted = !Boolean(backendLessonState[lessonId]);

    if (user.isLocal || !db) {
      const next = { ...backendLessonState, [lessonId]: nextCompleted };
      setBackendLessonState(next);
      persistLocalSnapshot({ backendLessonState: next });
      return;
    }

    const path = `users/${user.uid}/backendLessons/${lessonId}`;
    const docRef = doc(db, 'users', user.uid, 'backendLessons', lessonId);

    try {
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, {
          ownerId: user.uid,
          moduleId: clip(moduleId, 60),
          lessonId: clip(lessonId, 60),
          completed: nextCompleted,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(docRef, {
          completed: nextCompleted,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      reportError(error, OperationType.WRITE, path);
    }
  };

  // Projects CRUD
  const addProject = async (proj: Omit<Project, 'id'>) => {
    if (!user) return;
    const id = `proj-${Date.now()}`;
    const newProj: Project = {
      id,
      title: clip(proj.title, 200) || 'Untitled Project',
      description: clip(proj.description, 2000),
      techStack: (proj.techStack || []).slice(0, 20),
      startDate: clip(proj.startDate, 30),
      deadline: clip(proj.deadline, 30),
      status: proj.status,
      githubUrl: clip(proj.githubUrl, 500),
      liveUrl: clip(proj.liveUrl, 500),
      milestones: (proj.milestones || []).slice(0, 30),
      notes: clip(proj.notes, 5000)
    };

    if (user.isLocal || !db) {
      const next = [...projects, newProj];
      setProjects(next);
      persistLocalSnapshot({ projects: next });
      return;
    }

    const path = `users/${user.uid}/projects/${id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'projects', id), {
        ownerId: user.uid,
        title: newProj.title,
        description: newProj.description,
        techStack: newProj.techStack,
        startDate: newProj.startDate,
        deadline: newProj.deadline,
        status: newProj.status,
        githubUrl: newProj.githubUrl || '',
        liveUrl: newProj.liveUrl || '',
        milestones: newProj.milestones,
        notes: newProj.notes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      reportError(error, OperationType.CREATE, path);
    }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    if (!user) return;
    const existing = projects.find(p => p.id === id);
    if (!existing) return;
    const merged: Project = {
      ...existing,
      ...updated,
      title: clip((updated.title ?? existing.title) || 'Untitled Project', 200),
      description: clip(updated.description ?? existing.description, 2000),
      techStack: (updated.techStack ?? existing.techStack ?? []).slice(0, 20),
      startDate: clip(updated.startDate ?? existing.startDate, 30),
      deadline: clip(updated.deadline ?? existing.deadline, 30),
      githubUrl: clip(updated.githubUrl ?? existing.githubUrl, 500),
      liveUrl: clip(updated.liveUrl ?? existing.liveUrl, 500),
      milestones: (updated.milestones ?? existing.milestones ?? []).slice(0, 30),
      notes: clip(updated.notes ?? existing.notes, 5000)
    };

    if (user.isLocal || !db) {
      const next = projects.map(p => (p.id === id ? merged : p));
      setProjects(next);
      persistLocalSnapshot({ projects: next });
      return;
    }

    const path = `users/${user.uid}/projects/${id}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'projects', id), {
        title: merged.title,
        description: merged.description,
        techStack: merged.techStack,
        startDate: merged.startDate,
        deadline: merged.deadline,
        status: merged.status,
        githubUrl: merged.githubUrl || '',
        liveUrl: merged.liveUrl || '',
        milestones: merged.milestones,
        notes: merged.notes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      reportError(error, OperationType.UPDATE, path);
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;
    if (user.isLocal || !db) {
      const next = projects.filter(p => p.id !== id);
      setProjects(next);
      persistLocalSnapshot({ projects: next });
      return;
    }

    const path = `users/${user.uid}/projects/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'projects', id));
    } catch (error) {
      reportError(error, OperationType.DELETE, path);
    }
  };

  const toggleMilestone = async (projectId: string, milestoneId: string) => {
    const existing = projects.find(p => p.id === projectId);
    if (!existing) return;
    const nextMilestones = existing.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = nextMilestones.filter(m => m.completed).length;
    let nextStatus: Project['status'] = existing.status;
    if (nextMilestones.length > 0) {
      if (completedCount === nextMilestones.length) nextStatus = 'Completed';
      else if (completedCount > 0) nextStatus = 'In Progress';
      else nextStatus = 'Planned';
    }
    await updateProject(projectId, { milestones: nextMilestones, status: nextStatus });
  };

  // Notes CRUD
  const addNote = async (note: Omit<Note, 'id' | 'updatedAt'>): Promise<string | null> => {
    if (!user) return null;
    const id = `note-${Date.now()}`;
    const newNote: Note = {
      id,
      title: clip(note.title, 200) || 'Untitled Note',
      category: note.category,
      content: clip(note.content, 50000),
      isPinned: Boolean(note.isPinned),
      updatedAt: getLocalDateStr()
    };

    if (user.isLocal || !db) {
      const next = [newNote, ...notes];
      setNotes(next);
      persistLocalSnapshot({ notes: next });
      return id;
    }

    const path = `users/${user.uid}/notes/${id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'notes', id), {
        ownerId: user.uid,
        title: newNote.title,
        category: newNote.category,
        content: newNote.content,
        isPinned: newNote.isPinned,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return id;
    } catch (error) {
      reportError(error, OperationType.CREATE, path);
      return null;
    }
  };

  const updateNote = async (id: string, updated: Partial<Note>) => {
    if (!user) return;
    const existing = notes.find(n => n.id === id);
    if (!existing) return;
    const merged: Note = {
      ...existing,
      ...updated,
      title: clip((updated.title ?? existing.title) || 'Untitled Note', 200),
      content: clip(updated.content ?? existing.content, 50000),
      isPinned: Boolean(updated.isPinned ?? existing.isPinned),
      updatedAt: getLocalDateStr()
    };

    if (user.isLocal || !db) {
      const next = notes.map(n => (n.id === id ? merged : n));
      setNotes(next);
      persistLocalSnapshot({ notes: next });
      return;
    }

    const path = `users/${user.uid}/notes/${id}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'notes', id), {
        title: merged.title,
        category: merged.category,
        content: merged.content,
        isPinned: merged.isPinned,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      reportError(error, OperationType.UPDATE, path);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    if (user.isLocal || !db) {
      const next = notes.filter(n => n.id !== id);
      setNotes(next);
      persistLocalSnapshot({ notes: next });
      return;
    }

    const path = `users/${user.uid}/notes/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
    } catch (error) {
      reportError(error, OperationType.DELETE, path);
    }
  };

  // Weekly Test score submission
  const submitTestScore = async (testId: string, score: number) => {
    if (!user) return;
    const meta = SAMPLE_WEEKLY_TESTS.find(t => t.id === testId);
    const weekNumber = meta ? meta.weekNumber : 1;
    const safeScore = Math.min(100, Math.max(0, Math.round(score)));

    if (user.isLocal || !db) {
      const next = {
        ...weeklyTestResults,
        [testId]: { completed: true, score: safeScore }
      };
      setWeeklyTestResults(next);
      persistLocalSnapshot({ weeklyTestResults: next });
      return;
    }

    const path = `users/${user.uid}/weeklyTests/${testId}`;
    const docRef = doc(db, 'users', user.uid, 'weeklyTests', testId);

    try {
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, {
          ownerId: user.uid,
          testId: clip(testId, 60),
          weekNumber,
          completed: true,
          score: safeScore,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(docRef, {
          completed: true,
          score: safeScore,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      reportError(error, OperationType.WRITE, path);
    }
  };

  // Export JSON backup
  const exportDataJSON = () => {
    const bundle = {
      version: '2.1.0',
      exportedAt: new Date().toISOString(),
      accountEmail: user?.email || '',
      userProfile,
      roadmapTasks,
      dsaProblems,
      backendModules,
      projects,
      notes,
      weeklyTests
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imthebest-backup-${getLocalDateStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Full Round-Trip JSON Import (Roadmap, DSA, Backend, Projects, Notes, Weekly Tests, Profile)
  const importDataJSON = async (jsonStr: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') return false;

      if (user.isLocal || !db) {
        const nextRoadmap = { ...roadmapProgressMap };
        if (Array.isArray(data.roadmapTasks)) {
          for (const day of data.roadmapTasks as DailyTask[]) {
            if (
              day.dsa?.completed ||
              day.backend?.completed ||
              day.revision?.completed ||
              day.userNotes
            ) {
              nextRoadmap[day.id] = {
                ownerId: user.uid,
                dayNumber: day.dayNumber,
                dsaCompleted: Boolean(day.dsa?.completed),
                backendCompleted: Boolean(day.backend?.completed),
                revisionCompleted: Boolean(day.revision?.completed),
                githubPushed: Boolean(day.revision?.githubPushed),
                isCompleted: Boolean(day.isCompleted),
                userNotes: clip(day.userNotes, 5000),
                completedAt: clip(day.completedAt, 30)
              };
            }
          }
        }

        const nextBackend: Record<string, boolean> = { ...backendLessonState };
        if (Array.isArray(data.backendModules)) {
          for (const mod of data.backendModules as BackendModule[]) {
            for (const lesson of mod.lessons || []) {
              if (lesson.completed) nextBackend[lesson.id] = true;
            }
          }
        }

        const nextTests = { ...weeklyTestResults };
        if (Array.isArray(data.weeklyTests)) {
          for (const t of data.weeklyTests as WeeklyAssessment[]) {
            if (t.completed) {
              nextTests[t.id] = {
                completed: true,
                score: Math.min(100, Math.max(0, Math.round(t.score || 0)))
              };
            }
          }
        }

        const nextProfile = data.userProfile
          ? { ...userProfile, ...data.userProfile }
          : userProfile;
        const nextDsa = Array.isArray(data.dsaProblems) ? data.dsaProblems : dsaProblems;
        const nextProjects = Array.isArray(data.projects) ? data.projects : projects;
        const nextNotes = Array.isArray(data.notes) ? data.notes : notes;

        setUserProfile(nextProfile);
        setRoadmapProgressMap(nextRoadmap);
        setDsaProblems(nextDsa);
        setBackendLessonState(nextBackend);
        setProjects(nextProjects);
        setNotes(nextNotes);
        setWeeklyTestResults(nextTests);

        saveLocalWorkspace(user.uid, {
          userProfile: nextProfile,
          roadmapProgressMap: nextRoadmap,
          dsaProblems: nextDsa,
          backendLessonState: nextBackend,
          projects: nextProjects,
          notes: nextNotes,
          weeklyTestResults: nextTests
        });
        return true;
      }

      const uid = user.uid;
      const firestore = db;

      if (data.userProfile) {
        await updateUserProfile(data.userProfile);
      }

      let batch = writeBatch(firestore);
      let ops = 0;

      const commitIfFull = async () => {
        if (ops >= 440) {
          await batch.commit();
          batch = writeBatch(firestore);
          ops = 0;
        }
      };

      if (Array.isArray(data.roadmapTasks)) {
        for (const day of data.roadmapTasks as DailyTask[]) {
          if (day.dsa?.completed || day.backend?.completed || day.revision?.completed || day.userNotes) {
            const ref = doc(firestore, 'users', uid, 'roadmapProgress', day.id);
            if (roadmapProgressMap[day.id]) {
              batch.update(ref, {
                dsaCompleted: Boolean(day.dsa?.completed),
                backendCompleted: Boolean(day.backend?.completed),
                revisionCompleted: Boolean(day.revision?.completed),
                githubPushed: Boolean(day.revision?.githubPushed),
                isCompleted: Boolean(day.isCompleted),
                userNotes: clip(day.userNotes, 5000),
                completedAt: clip(day.completedAt, 30),
                updatedAt: serverTimestamp()
              });
            } else {
              batch.set(ref, {
                ownerId: uid,
                dayNumber: day.dayNumber,
                dsaCompleted: Boolean(day.dsa?.completed),
                backendCompleted: Boolean(day.backend?.completed),
                revisionCompleted: Boolean(day.revision?.completed),
                githubPushed: Boolean(day.revision?.githubPushed),
                isCompleted: Boolean(day.isCompleted),
                userNotes: clip(day.userNotes, 5000),
                completedAt: clip(day.completedAt, 30),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            }
            ops++;
            await commitIfFull();
          }
        }
      }

      if (Array.isArray(data.dsaProblems)) {
        const existingDsaIds = new Set(dsaProblems.map(item => item.id));
        let idx = 0;
        for (const p of data.dsaProblems as DSAProblem[]) {
          const safeId = sanitizeId(p.id, 'dsa', idx++);
          const safeDiff = VALID_DIFFICULTIES.has(p.difficulty) ? p.difficulty : 'Medium';
          const safeStatus = VALID_PROBLEM_STATUSES.has(p.status) ? p.status : 'Not Started';
          const ref = doc(firestore, 'users', uid, 'dsaProblems', safeId);
          if (existingDsaIds.has(safeId)) {
            batch.update(ref, {
              name: clip(p.name, 200) || 'Untitled Problem',
              topic: clip(p.topic, 100) || 'Arrays & Hashing',
              difficulty: safeDiff,
              leetCodeUrl: clip(p.leetCodeUrl, 500),
              status: safeStatus,
              timeComplexity: clip(p.timeComplexity, 100),
              spaceComplexity: clip(p.spaceComplexity, 100),
              notes: clip(p.notes, 5000),
              revisitDate: clip(p.revisitDate, 30),
              dateAttempted: clip(p.dateAttempted, 30),
              updatedAt: serverTimestamp()
            });
          } else {
            batch.set(ref, {
              ownerId: uid,
              name: clip(p.name, 200) || 'Untitled Problem',
              topic: clip(p.topic, 100) || 'Arrays & Hashing',
              difficulty: safeDiff,
              leetCodeUrl: clip(p.leetCodeUrl, 500),
              status: safeStatus,
              timeComplexity: clip(p.timeComplexity, 100),
              spaceComplexity: clip(p.spaceComplexity, 100),
              notes: clip(p.notes, 5000),
              revisitDate: clip(p.revisitDate, 30),
              dateAttempted: clip(p.dateAttempted, 30),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          ops++;
          await commitIfFull();
        }
      }

      if (Array.isArray(data.backendModules)) {
        let idx = 0;
        for (const mod of data.backendModules as BackendModule[]) {
          for (const lesson of mod.lessons || []) {
            if (lesson.completed || backendLessonState[lesson.id] !== undefined) {
              const safeLessonId = sanitizeId(lesson.id, 'lesson', idx++);
              const ref = doc(firestore, 'users', uid, 'backendLessons', safeLessonId);
              if (backendLessonState[safeLessonId] !== undefined) {
                batch.update(ref, {
                  completed: Boolean(lesson.completed),
                  updatedAt: serverTimestamp()
                });
              } else {
                batch.set(ref, {
                  ownerId: uid,
                  moduleId: clip(mod.id, 60) || 'mod-1',
                  lessonId: clip(lesson.id, 60) || safeLessonId.slice(0, 60),
                  completed: Boolean(lesson.completed),
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                });
              }
              ops++;
              await commitIfFull();
            }
          }
        }
      }

      if (Array.isArray(data.projects)) {
        const existingProjIds = new Set(projects.map(item => item.id));
        let idx = 0;
        for (const proj of data.projects as Project[]) {
          const safeId = sanitizeId(proj.id, 'proj', idx++);
          const safeStatus = VALID_PROJECT_STATUSES.has(proj.status) ? proj.status : 'Planned';
          const ref = doc(firestore, 'users', uid, 'projects', safeId);
          if (existingProjIds.has(safeId)) {
            batch.update(ref, {
              title: clip(proj.title, 200) || 'Untitled Project',
              description: clip(proj.description, 2000),
              techStack: (proj.techStack || []).slice(0, 20),
              startDate: clip(proj.startDate, 30),
              deadline: clip(proj.deadline, 30),
              status: safeStatus,
              githubUrl: clip(proj.githubUrl, 500),
              liveUrl: clip(proj.liveUrl, 500),
              milestones: (proj.milestones || []).slice(0, 30),
              notes: clip(proj.notes, 5000),
              updatedAt: serverTimestamp()
            });
          } else {
            batch.set(ref, {
              ownerId: uid,
              title: clip(proj.title, 200) || 'Untitled Project',
              description: clip(proj.description, 2000),
              techStack: (proj.techStack || []).slice(0, 20),
              startDate: clip(proj.startDate, 30),
              deadline: clip(proj.deadline, 30),
              status: safeStatus,
              githubUrl: clip(proj.githubUrl, 500),
              liveUrl: clip(proj.liveUrl, 500),
              milestones: (proj.milestones || []).slice(0, 30),
              notes: clip(proj.notes, 5000),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          ops++;
          await commitIfFull();
        }
      }

      if (Array.isArray(data.notes)) {
        const existingNoteIds = new Set(notes.map(item => item.id));
        let idx = 0;
        for (const n of data.notes as Note[]) {
          const safeId = sanitizeId(n.id, 'note', idx++);
          const safeCat = VALID_NOTE_CATEGORIES.has(n.category) ? n.category : 'Java';
          const ref = doc(firestore, 'users', uid, 'notes', safeId);
          if (existingNoteIds.has(safeId)) {
            batch.update(ref, {
              title: clip(n.title, 200) || 'Untitled Note',
              category: safeCat,
              content: clip(n.content, 50000),
              isPinned: Boolean(n.isPinned),
              updatedAt: serverTimestamp()
            });
          } else {
            batch.set(ref, {
              ownerId: uid,
              title: clip(n.title, 200) || 'Untitled Note',
              category: safeCat,
              content: clip(n.content, 50000),
              isPinned: Boolean(n.isPinned),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          ops++;
          await commitIfFull();
        }
      }

      if (Array.isArray(data.weeklyTests)) {
        let idx = 0;
        for (const t of data.weeklyTests as WeeklyAssessment[]) {
          if (t.completed) {
            const safeId = sanitizeId(t.id, 'test', idx++);
            const ref = doc(firestore, 'users', uid, 'weeklyTests', safeId);
            const safeScore = Math.min(100, Math.max(0, Math.round(t.score || 0)));
            const safeWeek = Math.min(52, Math.max(1, Math.round(t.weekNumber || 1)));
            if (weeklyTestResults[safeId]) {
              batch.update(ref, {
                completed: true,
                score: safeScore,
                updatedAt: serverTimestamp()
              });
            } else {
              batch.set(ref, {
                ownerId: uid,
                testId: clip(safeId, 60),
                weekNumber: safeWeek,
                completed: true,
                score: safeScore,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            }
            ops++;
            await commitIfFull();
          }
        }
      }

      if (ops > 0) {
        await batch.commit();
      }
      return true;
    } catch (err) {
      console.error('Import parse error:', err);
      return false;
    }
  };

  // Reset current user's personal progress back to clean 0%
  const resetAllProgress = async () => {
    if (!user) return;
    if (user.isLocal || !db) {
      const fresh = createInitialLocalData(userProfile.name);
      fresh.userProfile = userProfile;
      applyLocalWorkspaceToState(fresh);
      saveLocalWorkspace(user.uid, fresh);
      return;
    }

    const firestore = db;
    if (!firestore) return;

    const uid = user.uid;
    try {
      const subcollections = [
        'roadmapProgress',
        'dsaProblems',
        'backendLessons',
        'projects',
        'notes',
        'weeklyTests'
      ];

      let deleteBatch = writeBatch(firestore);
      let deleteCount = 0;

      for (const sub of subcollections) {
        const snap = await getDocs(
          query(collection(firestore, 'users', uid, sub), where('ownerId', '==', uid))
        );
        for (const d of snap.docs) {
          deleteBatch.delete(d.ref);
          deleteCount++;
          if (deleteCount >= 450) {
            await deleteBatch.commit();
            deleteBatch = writeBatch(firestore);
            deleteCount = 0;
          }
        }
      }
      if (deleteCount > 0) {
        await deleteBatch.commit();
      }

      const seedBatch = writeBatch(firestore);
      INITIAL_DSA_PROBLEMS.forEach(p => {
        const pRef = doc(firestore, 'users', uid, 'dsaProblems', p.id);
        seedBatch.set(pRef, {
          ownerId: uid,
          name: clip(p.name, 200),
          topic: clip(p.topic, 100),
          difficulty: p.difficulty,
          leetCodeUrl: clip(p.leetCodeUrl, 500),
          status: 'Not Started',
          timeComplexity: clip(p.timeComplexity, 100),
          spaceComplexity: clip(p.spaceComplexity, 100),
          notes: clip(p.notes, 5000),
          revisitDate: '',
          dateAttempted: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      INITIAL_PROJECTS.forEach(proj => {
        const projRef = doc(firestore, 'users', uid, 'projects', proj.id);
        seedBatch.set(projRef, {
          ownerId: uid,
          title: clip(proj.title, 200),
          description: clip(proj.description, 2000),
          techStack: proj.techStack.slice(0, 20),
          startDate: clip(proj.startDate, 30),
          deadline: clip(proj.deadline, 30),
          status: 'Planned',
          githubUrl: clip(proj.githubUrl, 500),
          liveUrl: clip(proj.liveUrl, 500),
          milestones: proj.milestones.slice(0, 30).map(m => ({ ...m, completed: false })),
          notes: clip(proj.notes, 5000),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await seedBatch.commit();
    } catch (error) {
      reportError(error, OperationType.WRITE, `users/${uid}`);
    }
  };

  // True Calculated Metrics (zero hardcoded defaults)
  const completedDaysCount = useMemo(
    () => roadmapTasks.filter(t => t.isCompleted).length,
    [roadmapTasks]
  );

  const totalTasksCount = roadmapTasks.length * 3; // 252 * 3 = 756 tasks

  const completedTasksCount = useMemo(() => {
    return roadmapTasks.reduce((acc, day) => {
      let c = 0;
      if (day.dsa.completed) c++;
      if (day.backend.completed) c++;
      if (day.revision.completed) c++;
      return acc + c;
    }, 0);
  }, [roadmapTasks]);

  const overallCompletionPct = useMemo(() => {
    if (completedDaysCount === 0) return 0;
    if (completedDaysCount === roadmapTasks.length) return 100;
    return Number(((completedDaysCount / roadmapTasks.length) * 100).toFixed(1));
  }, [completedDaysCount, roadmapTasks.length]);

  const totalStudyHours = useMemo(() => {
    const mins = roadmapTasks.reduce((acc, curr) => {
      let m = 0;
      if (curr.dsa.completed) m += curr.dsa.duration;
      if (curr.backend.completed) m += curr.backend.duration;
      if (curr.revision.completed) m += curr.revision.duration;
      return acc + m;
    }, 0);
    return Math.round((mins / 60) * 10) / 10;
  }, [roadmapTasks]);

  // True activity-date streak calculation using actual logged YYYY-MM-DD dates
  const { currentStreak, longestStreak } = useMemo(() => {
    const dayNumbersSet = new Set<number>();
    roadmapTasks.forEach(t => {
      if (t.isCompleted && t.completedAt) {
        const parsed = parseLocalDateDays(t.completedAt);
        if (parsed !== null) dayNumbersSet.add(parsed);
      }
    });

    const sortedDates = Array.from(dayNumbersSet).sort((a, b) => a - b);
    if (sortedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let maxRun = 1;
    let run = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      if (sortedDates[i] - sortedDates[i - 1] === 1) {
        run++;
        if (run > maxRun) maxRun = run;
      } else {
        run = 1;
      }
    }

    const todayNum = parseLocalDateDays(getLocalDateStr())!;
    const latestNum = sortedDates[sortedDates.length - 1];
    let currentRun = 0;

    if (todayNum - latestNum <= 1) {
      currentRun = 1;
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        if (sortedDates[i + 1] - sortedDates[i] === 1) {
          currentRun++;
        } else {
          break;
        }
      }
    }

    return { currentStreak: currentRun, longestStreak: maxRun };
  }, [roadmapTasks]);

  return (
    <AppContext.Provider
      value={{
        user,
        isCloudMode: isFirebaseConfigured && !user?.isLocal,
        authLoading,
        dataLoading,
        authError,
        syncError,
        clearSyncError,
        signInWithGoogle,
        signInLocalProfile,
        signOutUser,
        theme,
        themePreference,
        setThemePreference,
        toggleTheme,
        userProfile,
        updateUserProfile,
        roadmapTasks,
        toggleTaskCompletion,
        toggleDayComplete,
        updateUserNotes,
        dsaProblems,
        addDSAProblem,
        updateDSAProblem,
        deleteDSAProblem,
        backendModules,
        toggleLessonCompletion,
        projects,
        addProject,
        updateProject,
        deleteProject,
        toggleMilestone,
        notes,
        addNote,
        updateNote,
        deleteNote,
        weeklyTests,
        submitTestScore,
        exportDataJSON,
        importDataJSON,
        resetAllProgress,
        currentStreak,
        longestStreak,
        totalStudyHours,
        overallCompletionPct,
        completedDaysCount,
        completedTasksCount,
        totalTasksCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
