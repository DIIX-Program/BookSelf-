
export enum UnderstandingLevel {
  NEEDS_REVIEW = 'NEEDS_REVIEW',
  PARTIAL = 'PARTIAL',
  WELL_UNDERSTOOD = 'WELL_UNDERSTOOD'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Feedback {
  gaps: string[];
  suggestions: string[];
  reasoningScore: number;
  clarityFeedback: string;
}

export interface KnowledgePage {
  id: string;
  title: string;
  content: string;
  summaryDraft?: string;
  lastUpdated: string; // ISO Date
  retention: number; // 0-100 percentage
  understanding: UnderstandingLevel;
  feedback?: Feedback;
  prerequisites: string[];
  quiz?: QuizQuestion[];
  chapterId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  bookId: string;
  lessonIds: string[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  isPrerequisiteMissing: boolean;
}

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  colorTheme: string;
  pageIds: string[];
}

export interface Book {
  id: string;
  owner: string; // username
  ownerDisplayName?: string;
  title: string;
  description: string;
  coverImage?: string;
  chapters: Chapter[];
  isPublic: boolean;
  allowCloning: boolean;
  likes: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  photoURL: string;
  isSetupComplete: boolean;
  bio?: string;
}

export interface LearnerBook extends Book {
  pages: KnowledgePage[];
  roadmaps: Roadmap[];
}

export interface LearnerState {
  books: Book[];
  allPages: Record<string, KnowledgePage>;
  collections: string[]; // IDs of liked books
  language: 'en' | 'vi';
}
