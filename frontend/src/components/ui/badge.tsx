import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700',
        secondary: 'bg-slate-100 text-slate-600',
        success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
        warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
        destructive: 'bg-red-50 text-red-700 ring-1 ring-red-100',
        accent: 'bg-violet-50 text-violet-700 ring-1 ring-violet-100',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
