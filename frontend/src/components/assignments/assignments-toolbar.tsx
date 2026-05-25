'use client';

import { Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssignmentStatus } from '@/types';

interface AssignmentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: AssignmentStatus | 'all';
  onStatusFilterChange: (value: AssignmentStatus | 'all') => void;
}

export function AssignmentsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: AssignmentsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center overflow-hidden rounded-full border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-shadow focus-within:border-slate-300 focus-within:shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
        <div className="relative shrink-0 border-r border-slate-100">
          <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as AssignmentStatus | 'all')
            }
            className={cn(
              'h-11 appearance-none bg-transparent pl-11 pr-8 text-sm font-medium text-slate-700',
              'cursor-pointer focus:outline-none rounded-l-full'
            )}
            aria-label="Filter assignments"
          >
            <option value="all">Filter By</option>
            <option value="completed">Completed</option>
            <option value="generating">Generating</option>
            <option value="queued">Queued</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search Assignment"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full bg-transparent pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
