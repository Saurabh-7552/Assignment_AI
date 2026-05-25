import { AssignmentModel, AssignmentDocument } from '../models/assignment.model';
import type { Assignment, AssignmentStatus, CreateAssignmentBody } from '../types';
import { AppError } from '../middleware/error-handler';

function toAssignment(doc: AssignmentDocument): Assignment {
  return {
    id: doc._id.toString(),
    input: doc.input,
    status: doc.status,
    questionPaper: doc.questionPaper,
    errorMessage: doc.errorMessage,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function createAssignment(body: CreateAssignmentBody): Promise<Assignment> {
  const input = {
    title: body.title,
    subject: body.subject,
    grade: body.grade,
    topics: body.topics,
    durationMinutes: body.durationMinutes,
    totalMarks: body.totalMarks,
    questionCount: body.questionCount,
    difficultyMix: body.difficultyMix,
    instructions: body.instructions,
  };

  const doc = await AssignmentModel.create({
    input,
    status: 'queued' as AssignmentStatus,
  });

  return toAssignment(doc);
}

export async function listAssignments(): Promise<Assignment[]> {
  const docs = await AssignmentModel.find().sort({ createdAt: -1 }).exec();
  return docs.map(toAssignment);
}

export async function getAssignmentById(id: string): Promise<Assignment> {
  const doc = await AssignmentModel.findById(id);
  if (!doc) {
    throw new AppError(404, 'Assignment not found');
  }
  return toAssignment(doc);
}

export async function updateAssignmentStatus(
  id: string,
  status: AssignmentStatus,
  extra?: { questionPaper?: Assignment['questionPaper']; errorMessage?: string }
): Promise<Assignment> {
  const doc = await AssignmentModel.findByIdAndUpdate(
    id,
    {
      status,
      ...(extra?.questionPaper !== undefined && { questionPaper: extra.questionPaper }),
      ...(extra?.errorMessage !== undefined && { errorMessage: extra.errorMessage }),
    },
    { new: true }
  );
  if (!doc) {
    throw new AppError(404, 'Assignment not found');
  }
  return toAssignment(doc);
}

export async function retryAssignment(id: string): Promise<Assignment> {
  const doc = await AssignmentModel.findById(id);
  if (!doc) {
    throw new AppError(404, 'Assignment not found');
  }
  if (doc.status !== 'failed') {
    throw new AppError(400, 'Only failed assignments can be retried');
  }
  doc.status = 'queued';
  doc.errorMessage = undefined;
  await doc.save();
  return toAssignment(doc);
}
