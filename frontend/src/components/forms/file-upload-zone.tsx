'use client';

import { useRef, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FileUploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200/80',
          'bg-slate-50/80 px-6 py-10 text-center transition-all duration-200',
          'hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_2px_12px_rgba(15,23,42,0.04)]'
        )}
      >
        <CloudUpload className="mb-3 h-10 w-10 text-slate-400" strokeWidth={1.5} />
        <p className="text-sm font-medium text-slate-700">
          Choose a file or drag & drop it here
        </p>
        <p className="mt-1 text-xs text-slate-400">JPEG, PNG, up to 10MB</p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 rounded-full border-slate-200 px-5"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,application/pdf"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>
      <p className="text-xs text-slate-500">
        Upload images of your preferred document/image
        {fileName && (
          <span className="ml-1 font-medium text-slate-600">· {fileName}</span>
        )}
      </p>
    </div>
  );
}
