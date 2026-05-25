import { AssignmentModel } from '../models/assignment.model';
import { generateQuestionPaper as generateFromGroq, AiServiceError } from './ai.service';
import {
  notifyAssignmentCompleted,
  notifyAssignmentFailed,
  notifyAssignmentStatus,
} from '../socket/assignment-events.bridge';

const MAX_PARSE_RETRIES = 2;

export async function generateQuestionPaper(assignmentId: string): Promise<void> {
  const doc = await AssignmentModel.findById(assignmentId);
  if (!doc) {
    console.error(`Assignment ${assignmentId} not found`);
    return;
  }

  if (doc.status === 'completed') {
    return;
  }

  doc.status = 'generating';
  doc.errorMessage = undefined;
  await doc.save();
  notifyAssignmentStatus(assignmentId, 'generating');

  let lastError = '';

  for (let attempt = 0; attempt <= MAX_PARSE_RETRIES; attempt++) {
    try {
      const paper = await generateFromGroq(
        doc.input,
        attempt > 0 ? lastError : undefined
      );

      doc.status = 'completed';
      doc.questionPaper = paper;
      doc.errorMessage = undefined;
      await doc.save();

      notifyAssignmentCompleted(assignmentId, paper);
      return;
    } catch (err) {
      lastError =
        err instanceof AiServiceError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Unknown error';
      console.error(`Generation attempt ${attempt + 1} failed:`, lastError);
    }
  }

  doc.status = 'failed';
  doc.errorMessage = 'Failed to generate a valid question paper. Please try again.';
  await doc.save();
  notifyAssignmentFailed(assignmentId, doc.errorMessage);
}
