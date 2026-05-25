'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  ClipboardList,
  Sparkles,
  Library,
  Settings,
  Wand2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAssignmentStore } from '@/store/assignment-store';

const secondaryNav = [
  { label: "AI Teacher's Toolkit", icon: Wand2 },
  { label: 'My Library', icon: Library },
];

const navLinkBase =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const assignmentCount = useAssignmentStore((s) => s.assignments.length);

  const isAssignmentsActive =
    pathname === '/dashboard' || pathname.startsWith('/assignments');

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-slate-100 bg-white">
      <div className="px-5 pb-4 pt-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          onClick={onNavigate}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">AssignAI</span>
        </Link>
      </div>

      <div className="px-4 pb-5">
        <Button
          asChild
          variant="dark"
          className="h-11 w-full rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_4px_14px_rgba(251,146,60,0.2)] hover:shadow-[0_6px_20px_rgba(251,146,60,0.28)]"
        >
          <Link href="/assignments/new" onClick={onNavigate}>
            <Sparkles className="h-4 w-4 text-orange-300" />
            Create Assignment
          </Link>
        </Button>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={cn(navLinkBase, 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}
        >
          <Home className="h-[18px] w-[18px] shrink-0" />
          Home
        </Link>

        <span
          className={cn(navLinkBase, 'cursor-default text-slate-400')}
          aria-disabled
        >
          <Users className="h-[18px] w-[18px] shrink-0 opacity-60" />
          My Groups
        </span>

        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={cn(
            navLinkBase,
            isAssignmentsActive
              ? 'bg-slate-100 text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          <span className="flex flex-1 items-center gap-3">
            <ClipboardList className="h-[18px] w-[18px] shrink-0" />
            Assignments
          </span>
          {assignmentCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-orange-500 px-1.5 text-xs font-semibold text-white">
              {assignmentCount > 99 ? '99+' : assignmentCount}
            </span>
          )}
        </Link>

        {secondaryNav.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className={cn(navLinkBase, 'cursor-default text-slate-400')}
            aria-disabled
          >
            <Icon className="h-[18px] w-[18px] shrink-0 opacity-60" />
            {label}
          </span>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-slate-100 p-3">
        <button
          type="button"
          className={cn(navLinkBase, 'w-full text-slate-600 hover:bg-slate-50 hover:text-slate-900')}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          Settings
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 transition-colors hover:bg-slate-100/80">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-xs font-semibold text-white shadow-sm">
            AS
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">AssignAI Workspace</p>
            <p className="truncate text-xs text-slate-500">Assessment Creator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
