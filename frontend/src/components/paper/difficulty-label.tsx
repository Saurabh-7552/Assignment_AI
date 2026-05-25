import type { Difficulty } from '@/types';
import { cn } from '@/lib/utils';

const LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Moderate',
  hard: 'Challenging',
};

export function DifficultyLabel({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span className={cn('font-medium text-slate-800', className)}>
      [{LABELS[difficulty]}]
    </span>
  );
}
