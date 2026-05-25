import { PaperHeader } from './paper-header';
import { SectionBlock } from './section-block';
import { PaperAnswerKey } from './paper-answer-key';
import type { QuestionPaper } from '@/types';

function getSectionLabel(index: number, title: string): string {
  const match = title.match(/^Section\s+([A-Z])/i);
  if (match) return `Section ${match[1].toUpperCase()}`;
  return `Section ${String.fromCharCode(65 + index)}`;
}

export function PaperView({ paper }: { paper: QuestionPaper }) {
  let questionIndex = 1;

  return (
    <article className="paper-content text-slate-900">
      <PaperHeader paper={paper} />

      {paper.sections.map((section, i) => {
        const start = questionIndex;
        questionIndex += section.questions.length;
        return (
          <SectionBlock
            key={`${section.title}-${i}`}
            section={section}
            sectionLabel={getSectionLabel(i, section.title)}
            startQuestionIndex={start}
          />
        );
      })}

      <p className="mt-10 border-t border-slate-100 pt-8 text-center text-sm font-medium text-slate-500">
        End of Question Paper
      </p>

      <PaperAnswerKey paper={paper} />
    </article>
  );
}
