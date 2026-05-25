import puppeteer from 'puppeteer';
import type { QuestionPaper } from '../types';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderQuestion(
  q: QuestionPaper['sections'][0]['questions'][0],
  index: number
): string {
  const options =
    q.type === 'mcq' && q.options
      ? `<ol type="A">${q.options.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ol>`
      : '';

  return `
    <div class="question">
      <p><strong>Q${index}.</strong> ${escapeHtml(q.text)} <span class="meta">[${q.marks} marks · ${q.difficulty}]</span></p>
      ${options}
    </div>
  `;
}

export function buildPaperHtml(paper: QuestionPaper): string {
  const sections = paper.sections
    .map(
      (section) => `
      <div class="section">
        <h2>${escapeHtml(section.title)}</h2>
        ${section.instructions ? `<p class="instructions">${escapeHtml(section.instructions)}</p>` : ''}
        ${section.questions.map((q, i) => renderQuestion(q, i + 1)).join('')}
      </div>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; padding: 40px; color: #111; }
    h1 { text-align: center; margin-bottom: 8px; }
    .meta-header { text-align: center; color: #555; margin-bottom: 32px; }
    h2 { border-bottom: 2px solid #7c3aed; padding-bottom: 4px; margin-top: 28px; }
    .section { margin-bottom: 24px; }
    .question { margin: 16px 0; }
    .meta { color: #666; font-size: 0.85em; }
    .instructions { font-style: italic; color: #444; }
  </style>
</head>
<body>
  <h1>${escapeHtml(paper.title)}</h1>
  <p class="meta-header">
    ${escapeHtml(paper.metadata.subject)}
    ${paper.metadata.grade ? ` · ${escapeHtml(paper.metadata.grade)}` : ''}
    · ${paper.metadata.durationMinutes} min · ${paper.metadata.totalMarks} marks
  </p>
  ${sections}
</body>
</html>`;
}

export async function generatePdfBuffer(paper: QuestionPaper): Promise<Buffer> {
  const html = buildPaperHtml(paper);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
