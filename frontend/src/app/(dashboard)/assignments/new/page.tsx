'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { PageContent } from '@/components/layout/page-content';
import { useMobileMenu } from '@/components/layout/dashboard-shell';
import { AssignmentForm } from '@/components/forms/assignment-form';
import { FormProgressBar } from '@/components/forms/form-progress-bar';
import { Button } from '@/components/ui/button';

export default function NewAssignmentPage() {
  const { openMobileMenu } = useMobileMenu();

  return (
    <>
      <DashboardHeader
        variant="app"
        title="Assignment"
        showBack
        backHref="/dashboard"
        onMenuClick={openMobileMenu}
      />

      <div className="border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-xl" asChild>
            <Link href="/dashboard">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </Link>
          </Button>
          <h1 className="flex-1 text-center text-base font-semibold text-slate-900">
            Create Assignment
          </h1>
          <div className="w-9" aria-hidden />
        </div>
      </div>

      <PageContent muted className="pb-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-6 hidden lg:block sm:mb-8">
            <FormProgressBar step={1} totalSteps={2} />
          </div>
          <AssignmentForm />
        </div>
      </PageContent>
    </>
  );
}
