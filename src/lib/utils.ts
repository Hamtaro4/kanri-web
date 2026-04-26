export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function isOverdue(deadline: string): boolean {
  return deadline < today();
}

export function isDueToday(deadline: string): boolean {
  return deadline === today();
}

export function isDueThisWeek(deadline: string): boolean {
  const t = today();
  const weekEnd = addDays(t, 7);
  return deadline > t && deadline <= weekEnd;
}

export function classifyDeadline(deadline: string): 'overdue' | 'today' | 'week' | 'later' {
  if (isOverdue(deadline)) return 'overdue';
  if (isDueToday(deadline)) return 'today';
  if (isDueThisWeek(deadline)) return 'week';
  return 'later';
}
