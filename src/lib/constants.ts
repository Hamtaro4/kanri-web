import { Day, Period } from '@/types';

export const DAYS: { key: Day; label: string; full: string }[] = [
  { key: 'mon', label: '月', full: '月曜' },
  { key: 'tue', label: '火', full: '火曜' },
  { key: 'wed', label: '水', full: '水曜' },
  { key: 'thu', label: '木', full: '木曜' },
  { key: 'fri', label: '金', full: '金曜' },
  { key: 'sat', label: '土', full: '土曜' },
];

export const PERIODS: { period: Period; start: string; end: string }[] = [
  { period: 1, start: '09:00', end: '10:30' },
  { period: 2, start: '10:35', end: '12:05' },
  { period: 3, start: '12:35', end: '14:05' },
  { period: 4, start: '14:10', end: '15:40' },
  { period: 5, start: '15:45', end: '17:15' },
  { period: 6, start: '17:20', end: '18:50' },
];

export const LUNCH_AFTER_PERIOD: Period = 2;

// Course color hues for oklch computation
export const COURSE_COLOR_HUES: Record<string, number> = {
  blue:   230,
  green:  160,
  purple: 280,
  red:    10,
  orange: 35,
  pink:   340,
  teal:   190,
  yellow: 70,
};

export const COURSE_COLOR_KEYS = Object.keys(COURSE_COLOR_HUES);

// Returns CSS color strings using light-dark() for automatic dark mode support.
// Requires `color-scheme: light dark` on :root (set in globals.css).
export function getCourseStyle(colorKey: string) {
  const hue = COURSE_COLOR_HUES[colorKey] ?? COURSE_COLOR_HUES.blue;
  return {
    solid:      `light-dark(oklch(0.55 0.16 ${hue}), oklch(0.65 0.16 ${hue}))`,
    bar:        `light-dark(oklch(0.55 0.16 ${hue}), oklch(0.65 0.16 ${hue}))`,
    tint:       `light-dark(oklch(0.96 0.03 ${hue}), oklch(0.18 0.04 ${hue}))`,
    tintStrong: `light-dark(oklch(0.92 0.05 ${hue}), oklch(0.22 0.05 ${hue}))`,
    text:       `light-dark(oklch(0.35 0.13 ${hue}), oklch(0.82 0.10 ${hue}))`,
    border:     `light-dark(oklch(0.85 0.06 ${hue}), oklch(0.30 0.06 ${hue}))`,
  };
}

// Returns priority color styles (uses CSS vars for dark mode compatibility)
export function getPriorityStyle(priority: string) {
  if (priority === 'high')   return { bar: 'var(--danger)', text: 'var(--danger)', label: '高', bg: 'var(--danger-bg)' };
  if (priority === 'medium') return { bar: 'var(--warn)',   text: 'var(--warn)',   label: '中', bg: 'var(--warn-bg)' };
  return { bar: 'var(--text-ter)', text: 'var(--text-sec)', label: '低', bg: 'var(--bg-subtle)' };
}

export const STORAGE_KEYS = {
  courses:     'kanri_courses',
  templates:   'kanri_templates',
  assignments: 'kanri_assignments',
} as const;

export const TODAY_DAY_MAP: Record<number, Day | null> = {
  0: null,
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};
