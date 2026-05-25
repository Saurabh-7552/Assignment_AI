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
  questionPaper?: import('./question-paper').QuestionPaper;
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
