'use client';

import { use } from 'react';
import Link from 'next/link';
import { Plus, RefreshCw } from 'lucide-react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { PageContent } from '@/components/layout/page-content';
import { useMobileMenu } from '@/components/layout/dashboard-shell';
import { GenerationBanner } from '@/components/feedback/generation-banner';
import { PaperView } from '@/components/paper/paper-view';
import { PaperAiBanner } from '@/components/paper/paper-ai-banner';
import { ExamPaperShell } from '@/components/paper/exam-paper-shell';
import { PaperPageSkeleton } from '@/components/feedback/page-skeleton';
import { AlertMessage } from '@/components/feedback/alert-message';
import { Button } from '@/components/ui/button';
import { useAssignment } from '@/hooks/use-assignment';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export default function AssignmentPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { assignment, loading, error } = useAssignment(id);
  const { openMobileMenu } = useMobileMenu();

  async function handleRetry() {
    try {
      await api.retryAssignment(id);
      toast.success('Retry queued');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Retry failed');
    }
  }

  const aiMessage =
    assignment?.questionPaper && assignment?.input
      ? `Here is your customized question paper for ${assignment.input.subject}${
          assignment.input.grade ? ` (${assignment.input.grade})` : ''
        } on: ${assignment.input.topics.slice(0, 3).join(', ')}${
          assignment.input.topics.length > 3 ? '…' : ''
        }.`
      : 'Your generated question paper will appear below when ready.';

  return (
    <>
      <DashboardHeader
        variant="app"
        title="Assignment"
        showBack
        backHref="/dashboard"
        onMenuClick={openMobileMenu}
        action={
          <Button asChild variant="dark" size="sm" className="hidden rounded-xl sm:inline-flex">
            <Link href="/assignments/new">
              <Plus className="h-4 w-4" />
              Create New
            </Link>
          </Button>
        }
      />

      <PageContent muted>
        {loading && <PaperPageSkeleton />}
        {error && <AlertMessage>{error}</AlertMessage>}

        {assignment && (
          <div className="mx-auto w-full max-w-4xl space-y-5">
            {(assignment.status === 'queued' ||
              assignment.status === 'generating' ||
              assignment.status === 'failed') && (
              <GenerationBanner
                status={assignment.status}
                errorMessage={assignment.errorMessage}
              />
            )}

            {assignment.status === 'failed' && (
              <div className="flex justify-center">
                <Button variant="destructive" onClick={handleRetry} className="rounded-full">
                  <RefreshCw className="h-4 w-4" />
                  Retry Generation
                </Button>
              </div>
            )}

            {assignment.status === 'completed' && assignment.questionPaper && (
              <ExamPaperShell
                banner={
                  <PaperAiBanner message={aiMessage} pdfUrl={api.getPdfUrl(id)} />
                }
              >
                <PaperView paper={assignment.questionPaper} />
              </ExamPaperShell>
            )}

            {(assignment.status === 'queued' || assignment.status === 'generating') && (
              <div className="surface-card py-16 text-center">
                <p className="text-caption">Your exam paper will appear here when generation completes.</p>
              </div>
            )}
          </div>
        )}
      </PageContent>
    </>
  );
}
