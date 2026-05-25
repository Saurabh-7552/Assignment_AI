'use client';

import { createContext, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { MobileBottomNav } from './mobile-bottom-nav';
import { cn } from '@/lib/utils';

interface MobileMenuContextValue {
  openMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextValue | null>(null);

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) throw new Error('useMobileMenu must be used within DashboardShell');
  return ctx;
}

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const showMobileNav =
    pathname === '/dashboard' || pathname.startsWith('/assignments');

  return (
    <MobileMenuContext.Provider value={{ openMobileMenu: () => setMobileOpen(true) }}>
      <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
        <div
          className={cn(
            'mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1440px] overflow-hidden',
            'rounded-2xl border border-slate-200/60 bg-white sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl md:min-h-[calc(100vh-3rem)]',
            'shadow-[0_8px_30px_rgba(15,23,42,0.06)]'
          )}
        >
          <div className="hidden shrink-0 lg:flex">
            <Sidebar />
          </div>

          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileOpen(false)}
                aria-hidden
              />
              <div className="absolute left-0 top-0 h-full shadow-2xl">
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          <main
            className={cn(
              'flex min-w-0 flex-1 flex-col bg-white',
              showMobileNav && 'pb-[4.5rem] lg:pb-0'
            )}
          >
            {children}
          </main>
        </div>
      </div>
      {showMobileNav && <MobileBottomNav />}
    </MobileMenuContext.Provider>
  );
}
