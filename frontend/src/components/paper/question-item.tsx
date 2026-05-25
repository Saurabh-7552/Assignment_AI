import { DifficultyLabel } from './difficulty-label';
import type { Question } from '@/types';

export function QuestionItem({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  return (
    <li className="text-sm leading-relaxed text-slate-800 sm:text-[15px]">
      <p>
        <span className="font-medium">{index}. </span>
        <DifficultyLabel difficulty={question.difficulty} />{' '}
        <span>{question.text}</span>{' '}
        <span className="font-medium text-slate-700">[{question.marks} Marks]</span>
      </p>
      {question.type === 'mcq' && question.options && question.options.length > 0 && (
        <ol className="mt-2 list-inside list-[upper-alpha] space-y-1 pl-4 text-slate-700">
          {question.options.map((opt, i) => (
            <li key={i}>{opt}</li>
          ))}
        </ol>
      )}
    </li>
  );
}
