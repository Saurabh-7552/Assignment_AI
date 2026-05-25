import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl animate-pulse space-y-5 sm:space-y-6">
      <Skeleton className="h-14 rounded-2xl" />
      <Skeleton className="h-10 max-w-md rounded-full" />
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-36 rounded-2xl sm:h-40" />
        ))}
      </div>
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Skeleton className="h-1.5 rounded-full" />
      <Skeleton className="h-[520px] rounded-2xl sm:rounded-3xl" />
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>
    </div>
  );
}

export function PaperPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-[480px] rounded-2xl sm:rounded-3xl" />
    </div>
  );
}
