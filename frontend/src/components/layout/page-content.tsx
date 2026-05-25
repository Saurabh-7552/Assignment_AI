import { cn } from '@/lib/utils';

interface PageContentProps {
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
}

export function PageContent({ children, muted, className }: PageContentProps) {
  return (
    <div
      className={cn(
        'page-content',
        muted && 'page-content--muted',
        className
      )}
    >
      {children}
    </div>
  );
}
