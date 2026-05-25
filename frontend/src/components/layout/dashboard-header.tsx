'use client';

import Link from 'next/link';
import { Menu, ChevronLeft, LayoutGrid, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
  action?: React.ReactNode;
  variant?: 'default' | 'app';
  showBack?: boolean;
  backHref?: string;
}

const iconBtn =
  'h-9 w-9 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900';

export function DashboardHeader({
  title,
  description,
  onMenuClick,
  action,
  variant = 'default',
  showBack = false,
  backHref = '/dashboard',
}: DashboardHeaderProps) {
  if (variant === 'app') {
    return (
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconBtn, 'lg:hidden')}
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {showBack && (
            <Button variant="ghost" size="icon" className={iconBtn} asChild>
              <Link href={backHref}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <div className="flex min-w-0 items-center gap-2">
            <LayoutGrid className="hidden h-5 w-5 shrink-0 text-slate-400 sm:block" />
            <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {action}
          <Button variant="ghost" size="icon" className={cn(iconBtn, 'relative')} aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </Button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 py-1.5 pl-1.5 pr-2 transition-all duration-200 hover:border-slate-200 hover:bg-slate-100 sm:pl-2 sm:pr-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-medium text-white">
              JD
            </div>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">John Doe</span>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-col gap-4 border-b border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
      <div className="flex items-start gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="icon" className={cn(iconBtn, 'lg:hidden')} onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-page-title">{title}</h1>
          {description && <p className="text-caption mt-1.5">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
