import { Priority } from '@/types';
import { getPriorityStyle } from '@/lib/constants';

export function PriorityBadge({ priority }: { priority: Priority }) {
  const ps = getPriorityStyle(priority);
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
      color: ps.text, padding: '1px 5px', borderRadius: 3,
      background: ps.bg,
    }}>{ps.label}</span>
  );
}

export function PriorityBar({ priority }: { priority: Priority }) {
  const ps = getPriorityStyle(priority);
  return (
    <div style={{ width: 4, alignSelf: 'stretch', background: ps.bar, borderRadius: 2, flexShrink: 0 }} />
  );
}

export function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'accent' | 'danger' | 'warn' | 'ok' }) {
  const tones = {
    neutral: { bg: 'var(--bg-subtle)',  color: 'var(--text-sec)' },
    accent:  { bg: 'var(--accent-50)',  color: 'var(--accent-600)' },
    danger:  { bg: 'var(--danger-bg)',  color: 'var(--danger)' },
    warn:    { bg: 'var(--warn-bg)',    color: 'var(--warn)' },
    ok:      { bg: 'var(--ok-bg)',      color: 'var(--ok)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999,
      background: t.bg, color: t.color,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      lineHeight: 1.4, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}
