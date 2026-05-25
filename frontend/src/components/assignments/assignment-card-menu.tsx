'use client';

import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface AssignmentCardMenuProps {
  assignmentId: string;
}

export function AssignmentCardMenu({ assignmentId }: AssignmentCardMenuProps) {
  const router = useRouter();

  return (
    <DropdownMenu
      trigger={
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Assignment options"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      }
    >
      <DropdownMenuItem
        onClick={() => router.push(`/assignments/${assignmentId}`)}
      >
        View Assignment
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => toast.info('Delete is not available in this MVP')}
      >
        Delete
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
