import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssignmentStatus } from '@/types';

interface GenerationBannerProps {
  status: AssignmentStatus;
  errorMessage?: string;
}

export function GenerationBanner({ status, errorMessage }: GenerationBannerProps) {
  if (status === 'completed') return null;

  if (status === 'failed') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/90 p-4 sm:p-5',
          'shadow-[0_1px_3px_rgba(15,23,42,0.04)]'
        )}
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <p className="text-sm leading-relaxed text-red-800">
          {errorMessage ?? 'Generation failed. Please retry.'}
        </p>
      </div>
    );
  }

  if (status === 'queued' || status === 'generating') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-2xl border border-violet-200/80 bg-violet-50/90 p-4 sm:p-5',
          'shadow-[0_1px_3px_rgba(15,23,42,0.04)]'
        )}
      >
        {status === 'generating' ? (
          <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-violet-600" />
        ) : (
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
        )}
        <p className="text-sm leading-relaxed text-violet-900">
          {status === 'queued'
            ? 'Your assignment is queued for AI generation…'
            : 'AI is generating your question paper…'}
        </p>
      </div>
    );
  }

  return null;
}
