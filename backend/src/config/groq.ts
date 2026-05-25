import OpenAI from 'openai';
import { env } from './env';

let client: OpenAI | null = null;

export function getGroqClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return client;
}

export function getGroqModel(): string {
  return env.GROQ_MODEL;
}
