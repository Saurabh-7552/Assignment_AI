import { cn } from '@/lib/utils';

interface AlertMessageProps {
  children: React.ReactNode;
  variant?: 'error' | 'info';
  className?: string;
}

export function AlertMessage({
  children,
  variant = 'error',
  className,
}: AlertMessageProps) {
  return (
    <p
      className={cn(
        'rounded-2xl border p-4 text-sm leading-relaxed shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
        variant === 'error' && 'border-red-200/80 bg-red-50 text-red-700',
        variant === 'info' && 'border-slate-200/80 bg-slate-50 text-slate-600',
        className
      )}
    >
      {children}
    </p>
  );
}
