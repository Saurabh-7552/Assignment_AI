import { Queue } from 'bullmq';
import { bullConnection } from './connection';

export const ASSIGNMENT_QUEUE_NAME = 'assignment-generation';
export const GENERATE_JOB_NAME = 'generate-paper';

export interface GenerateJobData {
  assignmentId: string;
}

export const assignmentQueue = new Queue<GenerateJobData>(ASSIGNMENT_QUEUE_NAME, {
  connection: bullConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export async function enqueueGeneration(assignmentId: string): Promise<void> {
  await assignmentQueue.add(GENERATE_JOB_NAME, { assignmentId });
}
