/**
 * Shared UI class tokens for visual consistency across the app.
 */
export const ui = {
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  },
  shadow: {
    card: 'shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
    elevated: 'shadow-[0_4px_24px_rgba(15,23,42,0.06)]',
    shell: 'shadow-[0_8px_30px_rgba(15,23,42,0.06)]',
  },
  transition: 'transition-all duration-200 ease-out',
  border: 'border border-slate-200/80',
  text: {
    heading: 'text-slate-900 font-semibold tracking-tight',
    body: 'text-slate-600',
    muted: 'text-slate-500',
    label: 'text-sm font-semibold text-slate-800',
  },
  surface: {
    card: 'bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
    muted: 'bg-slate-50/90',
    input: 'bg-slate-50/60 border-slate-200 focus-visible:bg-white',
  },
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/25 focus-visible:ring-offset-2',
  hover: {
    card: 'hover:border-slate-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]',
    ghost: 'hover:bg-slate-100',
  },
} as const;
