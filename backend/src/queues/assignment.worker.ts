import 'dotenv/config';
import { Worker } from 'bullmq';
import { connectDb } from '../config/db';
import { bullConnection } from './connection';
import {
  ASSIGNMENT_QUEUE_NAME,
  GENERATE_JOB_NAME,
  GenerateJobData,
} from './assignment.queue';
import { generateQuestionPaper } from '../services/generation.service';
import { updateAssignmentStatus } from '../services/assignment.service';
import { notifyAssignmentFailed } from '../socket/assignment-events.bridge';
async function startWorker(): Promise<void> {
  await connectDb();

  const worker = new Worker<GenerateJobData>(
    ASSIGNMENT_QUEUE_NAME,
    async (job) => {
      if (job.name !== GENERATE_JOB_NAME) return;
      try {
        await generateQuestionPaper(job.data.assignmentId);
      } catch (err) {
        console.error('Unhandled generation error:', err);
        throw err;
      }
    },
    { connection: bullConnection }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed for assignment ${job.data.assignmentId}`);
  });

  worker.on('failed', async (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
    if (job?.data?.assignmentId) {
      const msg = 'Generation failed unexpectedly. Please try again.';
      await updateAssignmentStatus(job.data.assignmentId, 'failed', { errorMessage: msg });
      notifyAssignmentFailed(job.data.assignmentId, msg);
    }
  });

  console.log('Assignment generation worker started');
}

startWorker().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
