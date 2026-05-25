import { AssignmentCard } from './assignment-card';
import type { Assignment } from '@/types';

export function AssignmentList({ assignments }: { assignments: Assignment[] }) {
  if (assignments.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-500 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        No assignments match your search or filter.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
      {assignments.map((a) => (
        <AssignmentCard key={a.id} assignment={a} />
      ))}
    </div>
  );
}
