import { Badge } from '@/components/ui/badge';
import type { AssignmentStatus } from '@/types';

const config: Record<
  AssignmentStatus,
  { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'accent' }
> = {
  draft: { label: 'Draft', variant: 'secondary' },
  queued: { label: 'Queued', variant: 'warning' },
  generating: { label: 'Generating', variant: 'accent' },
  completed: { label: 'Completed', variant: 'success' },
  failed: { label: 'Failed', variant: 'destructive' },
};

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
