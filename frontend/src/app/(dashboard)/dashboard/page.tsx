'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { PageContent } from '@/components/layout/page-content';
import { useMobileMenu } from '@/components/layout/dashboard-shell';
import { EmptyState } from '@/components/assignments/empty-state';
import { AssignmentList } from '@/components/assignments/assignment-list';
import { AssignmentsPageHeader } from '@/components/assignments/assignments-page-header';
import { AssignmentsToolbar } from '@/components/assignments/assignments-toolbar';
import { PageSkeleton } from '@/components/feedback/page-skeleton';
import { AlertMessage } from '@/components/feedback/alert-message';
import { CreateAssignmentFab } from '@/components/layout/create-assignment-fab';
import { useAssignmentStore } from '@/store/assignment-store';
import { useSocketSubscriptions } from '@/hooks/use-socket';
import type { AssignmentStatus } from '@/types';

export default function DashboardPage() {
  const { assignments, loading, error, fetchAssignments } = useAssignmentStore();
  const { openMobileMenu } = useMobileMenu();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all');

  const inProgressIds = useMemo(
    () =>
      assignments
        .filter((a) => a.status === 'queued' || a.status === 'generating')
        .map((a) => a.id),
    [assignments]
  );

  useSocketSubscriptions(inProgressIds);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filteredAssignments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignments.filter((a) => {
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesSearch =
        !q ||
        a.input.title.toLowerCase().includes(q) ||
        a.input.subject.toLowerCase().includes(q) ||
        a.input.topics.some((t) => t.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [assignments, search, statusFilter]);

  const isEmpty = !loading && !error && assignments.length === 0;
  const hasList = !loading && !error && assignments.length > 0;

  return (
    <>
      <DashboardHeader variant="app" title="Assignment" onMenuClick={openMobileMenu} />

      <PageContent muted={!isEmpty} className={isEmpty ? '!bg-white pb-0' : 'pb-28 sm:pb-32'}>
        {loading && <PageSkeleton />}
        {error && <AlertMessage>{error}</AlertMessage>}

        {isEmpty && <EmptyState />}

        {hasList && (
          <>
            <AssignmentsPageHeader count={assignments.length} />
            <div className="mb-6 sm:mb-8">
              <AssignmentsToolbar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </div>
            <AssignmentList assignments={filteredAssignments} />

            <div className="pointer-events-none fixed bottom-8 left-1/2 z-30 hidden -translate-x-1/2 lg:block">
              <div className="pointer-events-auto">
                <CreateAssignmentFab variant="pill" />
              </div>
            </div>
            <div className="fixed bottom-20 right-4 z-30 lg:hidden">
              <CreateAssignmentFab variant="circle" />
            </div>
          </>
        )}
      </PageContent>
    </>
  );
}
