import Redis from 'ioredis';
import { getRedis } from '../config/redis';
import type { AssignmentStatus, QuestionPaper } from '../types';
import {
  emitAssignmentCompleted,
  emitAssignmentFailed,
  emitAssignmentStatus,
} from './events';

const CHANNEL = 'assignai:assignment-events';

export type AssignmentEvent =
  | { type: 'status'; assignmentId: string; status: AssignmentStatus }
  | { type: 'completed'; assignmentId: string; questionPaper: QuestionPaper }
  | { type: 'failed'; assignmentId: string; errorMessage: string };

export async function publishAssignmentEvent(event: AssignmentEvent): Promise<void> {
  await getRedis().publish(CHANNEL, JSON.stringify(event));
}

export function notifyAssignmentStatus(
  assignmentId: string,
  status: AssignmentStatus
): void {
  void publishAssignmentEvent({ type: 'status', assignmentId, status });
}

export function notifyAssignmentCompleted(
  assignmentId: string,
  questionPaper: QuestionPaper
): void {
  void publishAssignmentEvent({ type: 'completed', assignmentId, questionPaper });
}

export function notifyAssignmentFailed(
  assignmentId: string,
  errorMessage: string
): void {
  void publishAssignmentEvent({ type: 'failed', assignmentId, errorMessage });
}

function dispatchAssignmentEvent(event: AssignmentEvent): void {
  switch (event.type) {
    case 'status':
      emitAssignmentStatus(event.assignmentId, event.status);
      break;
    case 'completed':
      emitAssignmentCompleted(event.assignmentId, event.questionPaper);
      break;
    case 'failed':
      emitAssignmentFailed(event.assignmentId, event.errorMessage);
      break;
  }
}

export function startAssignmentEventBridge(): Redis {
  const sub = getRedis().duplicate();
  sub.subscribe(CHANNEL);
  sub.on('message', (_channel, message) => {
    try {
      dispatchAssignmentEvent(JSON.parse(message) as AssignmentEvent);
    } catch (err) {
      console.error('Assignment event bridge parse error:', err);
    }
  });
  return sub;
}
