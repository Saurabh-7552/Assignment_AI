import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as assignmentService from '../services/assignment.service';
import { enqueueGeneration } from '../queues/assignment.queue';
import { generatePdfBuffer } from '../services/pdf.service';
import { notifyAssignmentStatus } from '../socket/assignment-events.bridge';

const createSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  grade: z.string().optional(),
  topics: z.array(z.string().min(1)).min(1),
  durationMinutes: z.number().positive(),
  totalMarks: z.number().positive(),
  questionCount: z.number().int().positive().max(50),
  difficultyMix: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  }),
  instructions: z.string().optional(),
});

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createSchema.parse(req.body);
    const assignment = await assignmentService.createAssignment(body);
    await enqueueGeneration(assignment.id);
    notifyAssignmentStatus(assignment.id, 'queued');
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
}

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const assignments = await assignmentService.listAssignments();
    res.json(assignments);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const assignment = await assignmentService.getAssignmentById(String(req.params.id));
    res.json(assignment);
  } catch (err) {
    next(err);
  }
}

export async function downloadPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const assignment = await assignmentService.getAssignmentById(String(req.params.id));
    if (!assignment.questionPaper) {
      res.status(400).json({ error: 'Question paper not ready' });
      return;
    }
    const buffer = await generatePdfBuffer(assignment.questionPaper);
    const filename = `${assignment.input.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

export async function retry(req: Request, res: Response, next: NextFunction) {
  try {
    const assignment = await assignmentService.retryAssignment(String(req.params.id));
    await enqueueGeneration(assignment.id);
    notifyAssignmentStatus(assignment.id, 'queued');
    res.json(assignment);
  } catch (err) {
    next(err);
  }
}
