import { create } from 'zustand';
import type { Assignment, AssignmentStatus, QuestionPaper } from '@/types';
import { api } from '@/lib/api-client';

interface AssignmentStore {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  patchAssignment: (id: string, patch: Partial<Assignment>) => void;
  updateStatus: (id: string, status: AssignmentStatus) => void;
  setCompleted: (id: string, questionPaper: QuestionPaper) => void;
  setFailed: (id: string, errorMessage: string) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],
  loading: false,
  error: null,

  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const assignments = await api.listAssignments();
      set({ assignments, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to load',
        loading: false,
      });
    }
  },

  patchAssignment: (id, patch) => {
    set({
      assignments: get().assignments.map((a) =>
        a.id === id ? { ...a, ...patch } : a
      ),
    });
  },

  updateStatus: (id, status) => {
    get().patchAssignment(id, { status });
  },

  setCompleted: (id, questionPaper) => {
    get().patchAssignment(id, { status: 'completed', questionPaper, errorMessage: undefined });
  },

  setFailed: (id, errorMessage) => {
    get().patchAssignment(id, { status: 'failed', errorMessage });
  },
}));
