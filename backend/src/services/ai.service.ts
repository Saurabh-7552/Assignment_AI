import { getGroqClient, getGroqModel } from '../config/groq';
import { buildUserPrompt, buildRetryPrompt, SYSTEM_PROMPT } from '../ai/prompts';
import { parseQuestionPaper } from '../ai/parser';
import type { AssignmentInput, QuestionPaper } from '../types';

const MAX_TOKENS = 8192;
const TEMPERATURE = 0.4;

export class AiServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AiServiceError';
  }
}

/**
 * Call Groq (OpenAI-compatible API) and return a validated QuestionPaper.
 */
export async function generateQuestionPaper(
  input: AssignmentInput,
  retryErrorSummary?: string
): Promise<QuestionPaper> {
  const client = getGroqClient();
  const model = getGroqModel();

  const userContent = retryErrorSummary
    ? buildRetryPrompt(input, retryErrorSummary)
    : buildUserPrompt(input);

  try {
    const completion = await client.chat.completions.create({
      model,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      throw new AiServiceError('Empty response from Groq');
    }

    return parseQuestionPaper(raw, input);
  } catch (err) {
    if (err instanceof AiServiceError) throw err;
    const message = err instanceof Error ? err.message : 'Groq API request failed';
    throw new AiServiceError(message, err);
  }
}
