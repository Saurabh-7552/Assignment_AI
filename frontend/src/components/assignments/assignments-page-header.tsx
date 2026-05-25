interface AssignmentsPageHeaderProps {
  count?: number;
}

export function AssignmentsPageHeader({ count }: AssignmentsPageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
        <h2 className="text-page-title">
          Assignments
          {count !== undefined && count > 0 && (
            <span className="ml-2 text-lg font-medium text-slate-400">({count})</span>
          )}
        </h2>
      </div>
      <p className="text-caption mt-2 pl-5 sm:pl-5">
        Manage and create assignments for your classes.
      </p>
    </div>
  );
}
