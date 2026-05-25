import type { QuestionPaper } from '@/types';

interface AnswerEntry {
  number: number;
  answer: string;
}

function collectAnswers(paper: QuestionPaper): AnswerEntry[] {
  const entries: AnswerEntry[] = [];
  let n = 0;
  for (const section of paper.sections) {
    for (const q of section.questions) {
      n += 1;
      if (q.modelAnswer?.trim()) {
        entries.push({ number: n, answer: q.modelAnswer.trim() });
      }
    }
  }
  return entries;
}

export function PaperAnswerKey({ paper }: { paper: QuestionPaper }) {
  const answers = collectAnswers(paper);
  if (answers.length === 0) return null;

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <h3 className="text-base font-bold text-slate-900">Answer Key:</h3>
      <ol className="mt-4 list-none space-y-4 pl-0">
        {answers.map(({ number, answer }) => (
          <li key={number} className="text-sm leading-relaxed text-slate-800">
            <span className="font-semibold">{number}. </span>
            <span className="whitespace-pre-wrap">{answer}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
