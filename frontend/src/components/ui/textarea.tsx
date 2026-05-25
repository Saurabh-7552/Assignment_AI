import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm text-slate-900',
      'placeholder:text-slate-400 transition-all duration-200',
      'focus-visible:border-slate-300 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/20',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
