import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyStateIllustration } from './empty-state-illustration';

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-14 sm:px-8 sm:py-20">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="mb-8 opacity-95">
          <EmptyStateIllustration />
        </div>
        <h2 className="text-page-title">No assignments yet</h2>
        <p className="text-caption mt-3 max-w-md sm:text-[15px]">
          Create your first assignment to start collecting and grading student submissions.
          You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Button
          asChild
          variant="dark"
          size="lg"
          className="mt-8 h-12 rounded-full px-8 text-[15px] shadow-[0_4px_20px_rgba(15,23,42,0.15)]"
        >
          <Link href="/assignments/new">
            <Plus className="h-4 w-4" />
            Create Your First Assignment
          </Link>
        </Button>
      </div>
    </div>
  );
}
