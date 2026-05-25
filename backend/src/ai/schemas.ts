import { z } from 'zod';
import type { AssignmentInput } from '../types';

/** Groq LLM response shape */
export const groqQuestionSchema = z.object({
  question: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number().positive(),
  type: z.enum(['mcq', 'short', 'long']).optional(),
  options: z.array(z.string()).optional(),
  modelAnswer: z.string().optional(),
});

export const groqSectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().optional(),
  questions: z.array(groqQuestionSchema).min(1),
});

export const groqResponseSchema = z.object({
  sections: z.array(groqSectionSchema).min(1),
});

export type GroqResponse = z.infer<typeof groqResponseSchema>;

/** Canonical question paper (API contract) */
const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['mcq', 'short', 'long']),
  text: z.string(),
  options: z.array(z.string()).optional(),
  marks: z.number().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  modelAnswer: z.string().optional(),
});

const sectionSchema = z.object({
  title: z.string(),
  instructions: z.string().optional(),
  questions: z.array(questionSchema).min(1),
});

export const questionPaperSchema = z.object({
  title: z.string(),
  metadata: z.object({
    subject: z.string(),
    grade: z.string().optional(),
    durationMinutes: z.number().positive(),
    totalMarks: z.number().positive(),
  }),
  sections: z.array(sectionSchema).min(1),
});

export type ValidatedQuestionPaper = z.infer<typeof questionPaperSchema>;

function inferQuestionType(
  sectionTitle: string,
  question: z.infer<typeof groqQuestionSchema>
): 'mcq' | 'short' | 'long' {
  if (question.type) return question.type;
  const title = sectionTitle.toLowerCase();
  if (title.includes('mcq') || title.includes('multiple choice')) return 'mcq';
  if (title.includes('long') || title.includes('essay')) return 'long';
  if (question.options && question.options.length >= 2) return 'mcq';
  return 'short';
}

export function normalizeGroqToQuestionPaper(
  groq: GroqResponse,
  input: AssignmentInput
): ValidatedQuestionPaper {
  let questionIndex = 0;

  const sections = groq.sections.map((section) => ({
    title: section.title,
    instructions: section.instruction?.trim() || undefined,
    questions: section.questions.map((q) => {
      questionIndex += 1;
      const type = inferQuestionType(section.title, q);
      return {
        id: `q${questionIndex}`,
        type,
        text: q.question,
        marks: q.marks,
        difficulty: q.difficulty,
        options: type === 'mcq' ? q.options ?? [] : undefined,
        modelAnswer: q.modelAnswer,
      };
    }),
  }));

  const paper = {
    title: input.title,
    metadata: {
      subject: input.subject,
      grade: input.grade,
      durationMinutes: input.durationMinutes,
      totalMarks: input.totalMarks,
    },
    sections,
  };

  const result = questionPaperSchema.safeParse(paper);
  if (!result.success) {
    throw new Error(
      `Normalized paper failed validation: ${result.error.errors.map((e) => e.message).join('; ')}`
    );
  }
  return result.data;
}
