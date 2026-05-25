import type { AssignmentInput } from '../types';

const JSON_SCHEMA_HINT = `{
  "sections": [
    {
      "title": "string (section name, e.g. Section A: Multiple Choice)",
      "instruction": "string (optional section instructions)",
      "questions": [
        {
          "question": "string (the question text)",
          "difficulty": "easy | medium | hard",
          "marks": number,
          "type": "mcq | short | long (optional)",
          "options": ["string"] (required when type is mcq, exactly 4 options),
          "modelAnswer": "string (optional)"
        }
      ]
    }
  ]
}`;

export const SYSTEM_PROMPT = `You are an expert academic examiner creating assessment question papers.
You MUST respond with ONLY valid JSON — no markdown, no explanation, no preamble.
The JSON must match this schema exactly:
${JSON_SCHEMA_HINT}

Rules:
- Group questions into logical sections
- Every question must have marks and difficulty
- Total marks across all questions should approximately match the requested total
- MCQ questions must include type "mcq" and exactly 4 options
- Use clear, professional academic language`;

export function buildUserPrompt(input: AssignmentInput): string {
  return `Create a question paper with these specifications:

Title: ${input.title}
Subject: ${input.subject}
${input.grade ? `Grade/Level: ${input.grade}` : ''}
Topics: ${input.topics.join(', ')}
Duration: ${input.durationMinutes} minutes
Total Marks: ${input.totalMarks}
Number of Questions: ${input.questionCount}
Difficulty Distribution: ${input.difficultyMix.easy}% easy, ${input.difficultyMix.medium}% medium, ${input.difficultyMix.hard}% hard
${input.instructions ? `Additional Instructions: ${input.instructions}` : ''}

Output ONLY the JSON object.`;
}

export function buildRetryPrompt(input: AssignmentInput, errorSummary: string): string {
  return `${buildUserPrompt(input)}

Your previous response failed validation: ${errorSummary}
Fix the JSON and output ONLY valid JSON matching the schema.`;
}
