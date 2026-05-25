import { QuestionItem } from './question-item';
import type { PaperSection } from '@/types';

interface SectionBlockProps {
  section: PaperSection;
  sectionLabel: string;
  startQuestionIndex: number;
}

export function SectionBlock({
  section,
  sectionLabel,
  startQuestionIndex,
}: SectionBlockProps) {
  const titleLower = section.title.toLowerCase();
  const showSubheading =
    !titleLower.startsWith(sectionLabel.toLowerCase()) &&
    section.title.trim() !== sectionLabel.trim();

  return (
    <section className="mt-10 first:mt-8">
      <h2 className="mb-5 text-center text-base font-bold text-slate-900 sm:text-lg">
        {sectionLabel}
      </h2>
      {showSubheading && (
        <div className="mb-4 text-left">
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">{section.title}</h3>
        </div>
      )}
      {section.instructions && (
        <p className="mb-5 text-sm italic text-slate-600">{section.instructions}</p>
      )}
      <ol className="list-none space-y-4 pl-0">
        {section.questions.map((q, i) => (
          <QuestionItem key={q.id} question={q} index={startQuestionIndex + i} />
        ))}
      </ol>
    </section>
  );
}
