export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Not Started' | 'Attempted' | 'Solved' | 'Revised';

export interface DailyTask {
  id: string;
  dayNumber: number;
  month: number;
  week: number;
  title: string;
  dsa: {
    title: string;
    description: string;
    duration: number; // in mins (default 75)
    completed: boolean;
    resource: string;
    notes?: string;
  };
  backend: {
    title: string;
    description: string;
    duration: number; // in mins (default 90)
    completed: boolean;
    resource: string;
    notes?: string;
  };
  revision: {
    title: string;
    description: string;
    duration: number; // in mins (default 15)
    completed: boolean;
    githubPushed: boolean;
    notes?: string;
  };
  userNotes?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface DSAProblem {
  id: string;
  name: string;
  topic: string;
  difficulty: Difficulty;
  leetCodeUrl: string;
  status: ProblemStatus;
  timeComplexity: string;
  spaceComplexity: string;
  notes: string;
  revisitDate?: string;
  dateAttempted: string;
}

export interface BackendLesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  documentationUrl: string;
}

export interface BackendModule {
  id: string;
  title: string;
  description: string;
  lessons: BackendLesson[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  startDate: string;
  deadline: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  githubUrl?: string;
  liveUrl?: string;
  milestones: ProjectMilestone[];
  notes: string;
}

export interface Note {
  id: string;
  title: string;
  category:
    | 'Java'
    | 'DSA'
    | 'Spring Boot'
    | 'SQL'
    | 'DBMS'
    | 'OS'
    | 'Computer Networks'
    | 'System Design'
    | 'Projects'
    | 'Interview Preparation';
  content: string;
  isPinned: boolean;
  updatedAt: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  explanation: string;
}

export interface WeeklyAssessment {
  id: string;
  weekNumber: number;
  monthNumber: number;
  title: string;
  completed: boolean;
  score: number;
  totalMarks: number;
  questions: Question[];
  codingTask: string;
}

export interface UserProfile {
  name: string;
  degree: string;
  targetRole: string;
  targetCompanies: string[];
  primaryLanguage: string;
  framework: string;
  database: string;
  dailyHours: number;
  roadmapDays: number;
}
