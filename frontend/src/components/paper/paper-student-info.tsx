interface PaperStudentInfoProps {
  grade?: string;
}

export function PaperStudentInfo({ grade }: PaperStudentInfoProps) {
  const classLabel = grade ?? '________';

  return (
    <div className="mt-6 space-y-3 text-sm text-slate-800">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-semibold">Name:</span>
        <span className="min-w-[200px] flex-1 border-b border-slate-300" />
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-semibold">Roll Number:</span>
        <span className="min-w-[160px] flex-1 border-b border-slate-300" />
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-semibold">Class:</span>
        <span>{classLabel}</span>
        <span className="font-semibold">Section:</span>
        <span className="min-w-[120px] flex-1 border-b border-slate-300" />
      </div>
    </div>
  );
}
