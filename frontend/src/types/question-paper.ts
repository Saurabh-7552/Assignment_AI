import type { Difficulty, QuestionType } from './assignment';

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
