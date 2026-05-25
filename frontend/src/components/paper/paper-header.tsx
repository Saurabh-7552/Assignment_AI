import type { QuestionPaper } from '@/types';
import { PaperStudentInfo } from './paper-student-info';

export function PaperHeader({ paper }: { paper: QuestionPaper }) {
  return (
    <header className="text-center text-slate-900">
      <h1 className="text-lg font-bold tracking-tight sm:text-xl">{paper.title}</h1>
      <p className="mt-2 text-sm font-medium sm:text-base">
        Subject: <span className="font-semibold">{paper.metadata.subject}</span>
      </p>
      {paper.metadata.grade && (
        <p className="mt-1 text-sm font-medium sm:text-base">
          Class: <span className="font-semibold">{paper.metadata.grade}</span>
        </p>
      )}

      <div className="mt-5 flex flex-col gap-1 text-sm sm:flex-row sm:justify-between sm:text-left">
        <p>
          <span className="font-semibold">Time Allowed:</span>{' '}
          {paper.metadata.durationMinutes} minutes
        </p>
        <p className="sm:text-right">
          <span className="font-semibold">Maximum Marks:</span>{' '}
          {paper.metadata.totalMarks}
        </p>
      </div>

      <p className="mt-4 text-left text-sm italic text-slate-600">
        All questions are compulsory unless stated otherwise.
      </p>

      <PaperStudentInfo grade={paper.metadata.grade} />
    </header>
  );
}
