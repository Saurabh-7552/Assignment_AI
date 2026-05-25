'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ClipboardList, Library, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Home', icon: LayoutGrid, match: (p: string) => p === '/dashboard' },
  {
    href: '/dashboard',
    label: 'Assignments',
    icon: ClipboardList,
    match: (p: string) => p.startsWith('/assignments') || p === '/dashboard',
  },
  { href: '#', label: 'Library', icon: Library, match: () => false, disabled: true },
  { href: '#', label: 'AI Toolkit', icon: Sparkles, match: () => false, disabled: true },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl border-t border-slate-800/40 bg-slate-900 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] lg:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around">
        {items.map(({ href, label, icon: Icon, match, disabled }) => {
          const active = match(pathname);
          const content = (
            <>
              {active && (
                <span className="absolute -top-0.5 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-white" />
              )}
              <Icon className={cn('h-5 w-5 transition-colors', active ? 'text-white' : 'text-slate-400')} />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors',
                  active ? 'text-white' : 'text-slate-400'
                )}
              >
                {label}
              </span>
            </>
          );

          return (
            <li key={label} className="relative flex-1">
              {disabled ? (
                <span className="flex flex-col items-center gap-1 py-2 opacity-50">{content}</span>
              ) : (
                <Link
                  href={href}
                  className="relative flex flex-col items-center gap-1 py-2 transition-opacity active:opacity-80"
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
