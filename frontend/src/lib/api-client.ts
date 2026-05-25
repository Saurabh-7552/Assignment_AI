import type { Assignment, CreateAssignmentBody } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'Request failed');
  }

  return res.json();
}

export const api = {
  listAssignments: () => request<Assignment[]>('/assignments'),

  getAssignment: (id: string) => request<Assignment>(`/assignments/${id}`),

  createAssignment: (body: CreateAssignmentBody) =>
    request<Assignment>('/assignments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  retryAssignment: (id: string) =>
    request<Assignment>(`/assignments/${id}/retry`, { method: 'POST' }),

  getPdfUrl: (id: string) => `${API_URL}/assignments/${id}/pdf`,
};
