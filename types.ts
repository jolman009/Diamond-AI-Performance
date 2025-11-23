export enum UserRole {
  PLAYER = 'PLAYER',
  COACH = 'COACH',
  PARENT = 'PARENT',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  ELITE = 'ELITE',
}

export interface UserProfile {
  name: string;
  role: UserRole;
  age: number;
  skillLevel: SkillLevel;
  positions: string[];
  goals: string[];
}

export interface AnalysisResult {
  id: string;
  date: string;
  videoName: string;
  feedback: string; // Markdown content
  drills: Drill[];
  score: number; // 1-100
}

export interface Drill {
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  category: string;
  videoUrl?: string; // Placeholder for video link
  ageGroup: 'JUNIOR' | 'SENIOR' | 'ALL';
}

export interface StatPoint {
  date: string;
  value: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name ref
  unlocked: boolean;
  xpValue: number;
}

export interface FeedbackPoint {
  timestamp: number; // seconds
  text: string;
  x?: number; // 0-100% position from left
  y?: number; // 0-100% position from top
}

export interface VideoEntry {
  id: string;
  thumbnail: string;
  date: string;
  title: string;
  score: number;
  tags: string[];
  url?: string;
  feedbackPoints?: FeedbackPoint[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string or simple text for demo
  time: string;
  type: 'TRAINING' | 'GAME' | 'LESSON';
}

export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  TRAINING = 'TRAINING',
  RECRUITING = 'RECRUITING',
  MENTAL = 'MENTAL',
}