'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Assignment } from '@/types';
import { useAssignmentStore } from '@/store/assignment-store';
import { useAssignmentSocket } from './use-socket';

export function useAssignment(id: string) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const patchAssignment = useAssignmentStore((s) => s.patchAssignment);

  useAssignmentSocket(id);

  const storeAssignment = useAssignmentStore((s) =>
    s.assignments.find((a) => a.id === id)
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getAssignment(id)
      .then((data) => {
        if (!cancelled) {
          setAssignment(data);
          patchAssignment(id, data);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, patchAssignment]);

  const merged = useMemo(() => {
    if (!assignment) return storeAssignment ?? null;
    if (!storeAssignment) return assignment;
    return { ...assignment, ...storeAssignment };
  }, [assignment, storeAssignment]);

  const isPending =
    merged?.status === 'queued' || merged?.status === 'generating';

  useEffect(() => {
    if (!isPending) return;
    let cancelled = false;
    const poll = () => {
      api
        .getAssignment(id)
        .then((data) => {
          if (!cancelled) {
            setAssignment(data);
            patchAssignment(id, data);
          }
        })
        .catch(() => {});
    };
    const interval = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, isPending, patchAssignment]);

  return { assignment: merged, loading, error };
}
