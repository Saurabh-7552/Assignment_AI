import mongoose, { Schema, Document } from 'mongoose';
import type { AssignmentInput, AssignmentStatus } from '../types';
import type { QuestionPaper } from '../types';

export interface AssignmentDocument extends Document {
  input: AssignmentInput;
  status: AssignmentStatus;
  questionPaper?: QuestionPaper;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const difficultyMixSchema = new Schema(
  {
    easy: { type: Number, required: true },
    medium: { type: Number, required: true },
    hard: { type: Number, required: true },
  },
  { _id: false }
);

const assignmentInputSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String },
    topics: { type: [String], required: true },
    durationMinutes: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    questionCount: { type: Number, required: true },
    difficultyMix: { type: difficultyMixSchema, required: true },
    instructions: { type: String },
  },
  { _id: false }
);

const assignmentSchema = new Schema<AssignmentDocument>(
  {
    input: { type: assignmentInputSchema, required: true },
    status: {
      type: String,
      enum: ['draft', 'queued', 'generating', 'completed', 'failed'],
      default: 'queued',
    },
    questionPaper: { type: Schema.Types.Mixed },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const AssignmentModel = mongoose.model<AssignmentDocument>(
  'Assignment',
  assignmentSchema
);
