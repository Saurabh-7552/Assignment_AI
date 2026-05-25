import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** DD-MM-YYYY for assignment card display */
export function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/** UI-only due date: assigned date + 1 day */
export function getDisplayDueDate(createdAt: string): string {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + 1);
  return formatDisplayDate(d.toISOString());
}
