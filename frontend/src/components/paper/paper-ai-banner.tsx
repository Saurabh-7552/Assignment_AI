import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaperAiBannerProps {
  message: string;
  pdfUrl?: string;
}

export function PaperAiBanner({ message, pdfUrl }: PaperAiBannerProps) {
  return (
    <div className="rounded-2xl bg-slate-900 px-5 py-5 text-white shadow-[0_4px_20px_rgba(15,23,42,0.12)] sm:rounded-3xl sm:px-6 sm:py-6">
      <p className="text-sm leading-relaxed text-slate-100 sm:text-[15px]">{message}</p>
      {pdfUrl && (
        <Button
          asChild
          variant="secondary"
          className="mt-4 h-10 rounded-full border-0 bg-white px-5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-100"
        >
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
            Download as PDF
          </a>
        </Button>
      )}
    </div>
  );
}
