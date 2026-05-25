// Inlined from shared/types — these types were previously imported from
// outside the backend root directory, which is unavailable during Railway builds.

// --- assignment types ---

export type AssignmentStatus =
  | 'draft'
  | 'queued'
  | 'generating'
  | 'completed'
  | 'failed';

export type QuestionType = 'mcq' | 'short' | 'long';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AssignmentInput {
  title: string;
  subject: string;
  grade?: string;
  topics: string[];
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  difficultyMix: {
    easy: number;
    medium: number;
    hard: number;
  };
  instructions?: string;
}

export interface Assignment {
  id: string;
  input: AssignmentInput;
  status: AssignmentStatus;
  questionPaper?: QuestionPaper;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentBody {
  title: string;
  subject: string;
  grade?: string;
  topics: string[];
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  difficultyMix: {
    easy: number;
    medium: number;
    hard: number;
  };
  instructions?: string;
}

// --- question-paper types ---

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  marks: number;
  difficulty: Difficulty;
  modelAnswer?: string;
}

export interface PaperSection {
  title: string;
  instructions?: string;
  questions: Question[];
}

export interface QuestionPaperMetadata {
  subject: string;
  grade?: string;
  durationMinutes: number;
  totalMarks: number;
}

export interface QuestionPaper {
  title: string;
  metadata: QuestionPaperMetadata;
  sections: PaperSection[];
}

// --- socket-events types ---

export const SOCKET_EVENTS = {
  JOIN: 'assignment:join',
  STATUS: 'assignment:status',
  COMPLETED: 'assignment:completed',
  FAILED: 'assignment:failed',
} as const;

export interface AssignmentJoinPayload {
  assignmentId: string;
}

export interface AssignmentStatusPayload {
  assignmentId: string;
  status: AssignmentStatus;
}

export interface AssignmentCompletedPayload {
  assignmentId: string;
  questionPaper: QuestionPaper;
}

export interface AssignmentFailedPayload {
  assignmentId: string;
  errorMessage: string;
}
