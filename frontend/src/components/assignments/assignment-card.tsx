'use client';

import Link from 'next/link';
import { formatDisplayDate, getDisplayDueDate, cn } from '@/lib/utils';
import { AssignmentCardMenu } from './assignment-card-menu';
import { StatusBadge } from '@/components/feedback/status-badge';
import type { Assignment } from '@/types';

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const assignedDate = formatDisplayDate(assignment.createdAt);
  const dueDate = getDisplayDueDate(assignment.createdAt);

  return (
    <article
      className={cn(
        'surface-card surface-card--interactive group flex flex-col p-5 sm:p-6'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/assignments/${assignment.id}`}
          className="min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30 focus-visible:ring-offset-2"
        >
          <h3 className="text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-slate-950 sm:text-[17px]">
            {assignment.input.title}
          </h3>
        </Link>
        <div className="shrink-0">
          <AssignmentCardMenu assignmentId={assignment.id} />
        </div>
      </div>

      <div className="mt-3">
        <StatusBadge status={assignment.status} />
      </div>

      <div className="mt-5 flex flex-col gap-1.5 border-t border-slate-100 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-slate-600">
          <span className="font-semibold text-slate-800">Assigned on:</span>{' '}
          <span className="text-slate-500">{assignedDate}</span>
        </p>
        <p className="text-slate-600 sm:text-right">
          <span className="font-semibold text-slate-800">Due:</span>{' '}
          <span className="text-slate-500">{dueDate}</span>
        </p>
      </div>
    </article>
  );
}
