import type { AssignmentStatus } from './assignment';
import type { QuestionPaper } from './question-paper';

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
