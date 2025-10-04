// lib/types/interview.types.ts
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type SessionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface InterviewTemplate {
  id: string;
  title: string;
  jobRole: string;
  skills: string[];
  jobDescription?: string;
  rounds: InterviewRound[];
}

export interface InterviewRound {
  id: string;
  name: string;
  order: number;
  description?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  difficulty: DifficultyLevel;
  category?: string;
}

export interface InterviewSession {
  id: string;
  templateId: string;
  studentId: string;
  companyId: string;
  status: SessionStatus;
  currentRoundIndex: number;
  currentQuestionIndex: number;
  selectedQuestions: Record<string, {
    easy: string[];
    medium: string[];
    hard: string[];
  }>;
  transcript: TranscriptEntry[];
  overallScore?: number;
  finalReport?: string;
}

export interface TranscriptEntry {
  role: 'interviewer' | 'student';
  text: string;
  timestamp: string;
  audioUrl?: string;
}

export interface Answer {
  id: string;
  questionId: string;
  answerText: string;
  audioUrl?: string;
  score?: number;
  feedback?: string;
  strengths: string[];
  weaknesses: string[];
  followUpQuestions: FollowUpQuestion[];
}

export interface FollowUpQuestion {
  question: string;
  answer: string;
}

export interface FinalReport {
  overallScore: number;
  summary: string;
  detailedFeedback: string;
  recommendations: string[];
}
