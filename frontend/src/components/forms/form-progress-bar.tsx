import { cn } from '@/lib/utils';

interface FormProgressBarProps {
  step?: number;
  totalSteps?: number;
  className?: string;
}

export function FormProgressBar({
  step = 1,
  totalSteps = 2,
  className,
}: FormProgressBarProps) {
  const progress = Math.min(100, (step / totalSteps) * 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-800 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
