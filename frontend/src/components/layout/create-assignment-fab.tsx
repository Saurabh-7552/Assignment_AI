'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateAssignmentFabProps {
  className?: string;
  variant?: 'pill' | 'circle';
}

export function CreateAssignmentFab({
  className,
  variant = 'pill',
}: CreateAssignmentFabProps) {
  if (variant === 'circle') {
    return (
      <Link
        href="/assignments/new"
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full bg-white',
          'shadow-[0_4px_20px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80',
          'transition-all duration-200 hover:scale-105 hover:shadow-[0_8px_28px_rgba(15,23,42,0.14)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50',
          className
        )}
        aria-label="Create assignment"
      >
        <Plus className="h-6 w-6 text-orange-500" strokeWidth={2.5} />
      </Link>
    );
  }

  return (
    <Link
      href="/assignments/new"
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white',
        'shadow-[0_4px_20px_rgba(15,23,42,0.2)] transition-all duration-200',
        'hover:bg-slate-800 hover:shadow-[0_8px_28px_rgba(15,23,42,0.22)] active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2',
        className
      )}
    >
      <Plus className="h-4 w-4" />
      Create Assignment
    </Link>
  );
}
