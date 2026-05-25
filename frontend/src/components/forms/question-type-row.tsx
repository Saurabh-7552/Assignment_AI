'use client';

import { X, ChevronDown } from 'lucide-react';
import { StepperInput } from './stepper-input';
import { cn } from '@/lib/utils';

export type QuestionTypeOption = 'mcq' | 'short' | 'long';

const TYPE_LABELS: Record<QuestionTypeOption, string> = {
  mcq: 'Multiple Choice Questions',
  short: 'Short Questions',
  long: 'Long Questions',
};

export interface QuestionTypeRowData {
  id: string;
  type: QuestionTypeOption;
  count: number;
  marks: number;
}

interface QuestionTypeRowProps {
  row: QuestionTypeRowData;
  onChange: (row: QuestionTypeRowData) => void;
  onRemove: () => void;
  canRemove: boolean;
  variant?: 'table' | 'card';
}

export function QuestionTypeRow({
  row,
  onChange,
  onRemove,
  canRemove,
  variant = 'table',
}: QuestionTypeRowProps) {
  if (variant === 'card') {
    return (
      <div className="surface-card p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={row.type}
              onChange={(e) =>
                onChange({ ...row, type: e.target.value as QuestionTypeOption })
              }
              className="appearance-none bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
            >
              {(Object.keys(TYPE_LABELS) as QuestionTypeOption[]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Remove question type"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">No. of Questions</p>
            <StepperInput
              value={row.count}
              onChange={(count) => onChange({ ...row, count })}
              min={1}
              max={50}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Marks</p>
            <StepperInput
              value={row.marks}
              onChange={(marks) => onChange({ ...row, marks })}
              min={1}
              max={100}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-center gap-3 border-b border-slate-100 py-4 last:border-0 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4">
      <div className="flex items-center gap-2">
        <select
          value={row.type}
          onChange={(e) =>
            onChange({ ...row, type: e.target.value as QuestionTypeOption })
          }
          className={cn(
            'h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-sm font-medium text-slate-800',
            'focus:outline-none focus:ring-2 focus:ring-slate-300/50'
          )}
        >
          {(Object.keys(TYPE_LABELS) as QuestionTypeOption[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-slate-400 hover:text-slate-600 sm:hidden"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-xs font-medium text-slate-500 sm:hidden">Questions</span>
        <StepperInput value={row.count} onChange={(count) => onChange({ ...row, count })} min={1} max={50} />
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-xs font-medium text-slate-500 sm:hidden">Marks</span>
        <StepperInput value={row.marks} onChange={(marks) => onChange({ ...row, marks })} min={1} max={100} />
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hidden text-slate-400 hover:text-slate-600 sm:flex sm:justify-center"
          aria-label="Remove question type"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function getDefaultQuestionRows(): QuestionTypeRowData[] {
  return [
    { id: '1', type: 'mcq', count: 10, marks: 1 },
    { id: '2', type: 'short', count: 5, marks: 2 },
  ];
}
