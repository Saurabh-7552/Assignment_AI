import type { AssignmentInput } from '../types';
import {
  groqResponseSchema,
  questionPaperSchema,
  normalizeGroqToQuestionPaper,
  type ValidatedQuestionPaper,
} from './schemas';

export function extractJsonFromText(text: string): unknown {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    return JSON.parse(jsonStr);
  } catch {
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(jsonStr.slice(start, end + 1));
    }
    throw new Error('Response is not valid JSON');
  }
}

/**
 * Parse raw LLM text: prefer Groq schema, fallback to full question paper schema.
 */
export function parseQuestionPaper(
  raw: string,
  assignmentInput: AssignmentInput
): ValidatedQuestionPaper {
  const parsed = extractJsonFromText(raw);

  const groqResult = groqResponseSchema.safeParse(parsed);
  if (groqResult.success) {
    return normalizeGroqToQuestionPaper(groqResult.data, assignmentInput);
  }

  const fullResult = questionPaperSchema.safeParse(parsed);
  if (fullResult.success) {
    return fullResult.data;
  }

  const groqErrors = groqResult.error.errors.map((e) => e.message).join('; ');
  const fullErrors = fullResult.error.errors.map((e) => e.message).join('; ');
  throw new Error(
    `Invalid question paper structure. Groq format: ${groqErrors}. Full format: ${fullErrors}`
  );
}
