'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function StepperInput({
  value,
  onChange,
  min = 0,
  max = 999,
  className,
}: StepperInputProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5',
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-white disabled:opacity-40"
        aria-label="Decrease"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[2rem] px-2 text-center text-sm font-semibold text-slate-900">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-white disabled:opacity-40"
        aria-label="Increase"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
