import type { Server } from 'socket.io';
import { SOCKET_EVENTS } from '../types';
import type {
  AssignmentStatusPayload,
  AssignmentCompletedPayload,
  AssignmentFailedPayload,
  AssignmentStatus,
  QuestionPaper,
} from '../types';

let io: Server | null = null;

export function setSocketServer(server: Server): void {
  io = server;
}

function emitToRoom(assignmentId: string, event: string, payload: unknown): void {
  if (!io) return;
  io.to(`assignment:${assignmentId}`).emit(event, payload);
}

export function emitAssignmentStatus(
  assignmentId: string,
  status: AssignmentStatus
): void {
  const payload: AssignmentStatusPayload = { assignmentId, status };
  emitToRoom(assignmentId, SOCKET_EVENTS.STATUS, payload);
}

export function emitAssignmentCompleted(
  assignmentId: string,
  questionPaper: QuestionPaper
): void {
  const payload: AssignmentCompletedPayload = { assignmentId, questionPaper };
  emitToRoom(assignmentId, SOCKET_EVENTS.COMPLETED, payload);
}

export function emitAssignmentFailed(
  assignmentId: string,
  errorMessage: string
): void {
  const payload: AssignmentFailedPayload = { assignmentId, errorMessage };
  emitToRoom(assignmentId, SOCKET_EVENTS.FAILED, payload);
}
