'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight, Mic, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadZone } from './file-upload-zone';
import { FormProgressBar } from './form-progress-bar';
import {
  QuestionTypeRow,
  getDefaultQuestionRows,
  type QuestionTypeRowData,
  type QuestionTypeOption,
} from './question-type-row';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function newRowId() {
  return Math.random().toString(36).slice(2, 9);
}

export function AssignmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [topicsText, setTopicsText] = useState('');
  const [questionRows, setQuestionRows] = useState<QuestionTypeRowData[]>(
    getDefaultQuestionRows
  );

  const { totalQuestions, totalMarks } = useMemo(() => {
    const totalQuestions = questionRows.reduce((s, r) => s + r.count, 0);
    const totalMarks = questionRows.reduce((s, r) => s + r.count * r.marks, 0);
    return { totalQuestions, totalMarks };
  }, [questionRows]);

  function updateRow(id: string, row: QuestionTypeRowData) {
    setQuestionRows((rows) => rows.map((r) => (r.id === id ? row : r)));
  }

  function removeRow(id: string) {
    setQuestionRows((rows) => rows.filter((r) => r.id !== id));
  }

  function addRow() {
    const used = new Set(questionRows.map((r) => r.type));
    const nextType = (['mcq', 'short', 'long'] as QuestionTypeOption[]).find(
      (t) => !used.has(t)
    );
    if (!nextType) {
      toast.error('All question types already added');
      return;
    }
    setQuestionRows((rows) => [
      ...rows,
      { id: newRowId(), type: nextType, count: 5, marks: 2 },
    ]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const topics = topicsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (topics.length === 0) {
      toast.error('Add at least one topic');
      return;
    }

    if (totalQuestions < 1) {
      toast.error('Add at least one question');
      return;
    }

    setLoading(true);
    try {
      const assignment = await api.createAssignment({
        title: form.get('title') as string,
        subject: form.get('subject') as string,
        grade: (form.get('grade') as string) || undefined,
        topics,
        durationMinutes: Number(form.get('durationMinutes')),
        totalMarks,
        questionCount: totalQuestions,
        difficultyMix: {
          easy: Number(form.get('easy')),
          medium: Number(form.get('medium')),
          hard: Number(form.get('hard')),
        },
        instructions: (form.get('instructions') as string) || undefined,
      });
      toast.success('Assignment created — generating questions…');
      router.push(`/assignments/${assignment.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="mb-6 lg:hidden">
        <FormProgressBar step={1} totalSteps={2} />
      </div>

      <div className="surface-card sm:rounded-3xl">
        <div className="border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-7">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            Assignment Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Basic information about your assignment
          </p>
        </div>

        <div className="space-y-8 px-5 py-6 sm:space-y-10 sm:px-8 sm:py-8">
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Quiz on Electricity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required placeholder="Physics" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">
                Grade <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <Input id="grade" name="grade" placeholder="Grade 10" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="topics">
                Topics <span className="font-normal text-slate-400">(comma-separated)</span>
              </Label>
              <Input
                id="topics"
                value={topicsText}
                onChange={(e) => setTopicsText(e.target.value)}
                required
                placeholder="Electricity, Circuits, Ohm's Law"
              />
            </div>
          </div>

          <FileUploadZone />

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <div className="relative">
              <Input id="dueDate" name="dueDate" placeholder="DD-MM-YYYY" className="pr-10" />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4 sm:pb-2">
              <span className="text-sm font-semibold text-slate-800">Question Type</span>
              <span className="text-center text-sm font-semibold text-slate-800">
                No. of Questions
              </span>
              <span className="text-center text-sm font-semibold text-slate-800">Marks</span>
              <span className="w-6" />
            </div>

            <div className="space-y-3 sm:space-y-0">
              {questionRows.map((row) => (
                <div key={row.id}>
                  <div className="sm:hidden">
                    <QuestionTypeRow
                      row={row}
                      onChange={(r) => updateRow(row.id, r)}
                      onRemove={() => removeRow(row.id)}
                      canRemove={questionRows.length > 1}
                      variant="card"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <QuestionTypeRow
                      row={row}
                      onChange={(r) => updateRow(row.id, r)}
                      onRemove={() => removeRow(row.id)}
                      canRemove={questionRows.length > 1}
                      variant="table"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                <Plus className="h-3.5 w-3.5" />
              </span>
              Add Question Type
            </button>

            <div className="flex flex-col gap-1 pt-2 text-right text-sm sm:flex-row sm:justify-end sm:gap-6">
              <p className="font-semibold text-slate-800">
                Total Questions:{' '}
                <span className="font-bold text-slate-900">{totalQuestions}</span>
              </p>
              <p className="font-semibold text-slate-800">
                Total Marks:{' '}
                <span className="font-bold text-slate-900">{totalMarks}</span>
              </p>
            </div>
          </div>

          <input type="hidden" name="durationMinutes" value={60} />
          <input type="hidden" name="easy" value={30} />
          <input type="hidden" name="medium" value={50} />
          <input type="hidden" name="hard" value={20} />

          <div className="space-y-2">
            <Label htmlFor="instructions">
              Additional Information{' '}
              <span className="font-normal text-slate-400">(For better output)</span>
            </Label>
            <div className="relative">
              <Textarea
                id="instructions"
                name="instructions"
                rows={5}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="min-h-[120px] resize-none pr-12"
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Voice input"
                tabIndex={-1}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Button
          type="button"
          variant="secondary"
          className="h-12 flex-1 rounded-full border-slate-300 text-base font-medium sm:max-w-[200px]"
          asChild
        >
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button
          type="submit"
          variant="dark"
          disabled={loading}
          className="h-12 flex-1 rounded-full text-base font-medium sm:max-w-[200px]"
        >
          {loading ? 'Creating…' : 'Next'}
          {!loading && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
