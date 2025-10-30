import { differenceInDays, format, parseISO } from 'date-fns';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
}

export function daysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(d, new Date());
}

export function getPhaseStatus(
  startDate: string,
  endDate: string
): 'upcoming' | 'active' | 'complete' {
  const now = new Date();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'complete';
  return 'active';
}
