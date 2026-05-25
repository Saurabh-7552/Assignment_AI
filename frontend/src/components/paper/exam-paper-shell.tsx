import { cn } from '@/lib/utils';

interface ExamPaperShellProps {
  banner?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ExamPaperShell({ banner, children, className }: ExamPaperShellProps) {
  return (
    <div className={cn('mx-auto w-full max-w-4xl space-y-4 sm:space-y-5', className)}>
      {banner}
      <div
        className={cn(
          'rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]',
          'sm:rounded-3xl print:border-slate-300 print:shadow-none'
        )}
      >
        <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 print:px-8 print:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
