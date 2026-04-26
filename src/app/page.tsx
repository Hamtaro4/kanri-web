'use client';

import Link from 'next/link';
import { useCourses } from '@/hooks/useCourses';
import { useAssignments } from '@/hooks/useAssignments';
import { DAYS, PERIODS, TODAY_DAY_MAP, getCourseStyle } from '@/lib/constants';
import { formatDate, classifyDeadline } from '@/lib/utils';
import { PriorityBar, Pill, PriorityBadge } from '@/components/ui/Badge';
import PageHeader from '@/components/layout/PageHeader';

export default function DashboardPage() {
  const { courses } = useCourses();
  const { assignments } = useAssignments();

  const todayDow = new Date().getDay();
  const todayDay = TODAY_DAY_MAP[todayDow];
  const todayCourses = todayDay
    ? PERIODS.flatMap(({ period, start, end }) => {
        const course = courses.find((c) => c.slots.some((s) => s.day === todayDay && s.period === period));
        return course ? [{ course, period, start, end }] : [];
      })
    : [];

  const active = assignments.filter((a) => !a.completed);
  const overdue = active.filter((a) => classifyDeadline(a.deadline) === 'overdue');
  const todayDue = active.filter((a) => classifyDeadline(a.deadline) === 'today');
  const weekDue = active.filter((a) => classifyDeadline(a.deadline) === 'week');
  const upcoming = [...overdue, ...todayDue, ...weekDue].slice(0, 4);
  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 11) return 'おはようございます';
    if (h < 18) return 'こんにちは';
    return 'こんばんは';
  })();

  const dayLabel = todayDay ? DAYS.find((d) => d.key === todayDay)?.full + '曜日' : '日曜日';
  const dateLabel = (() => {
    const now = new Date();
    return `${now.getMonth() + 1}月${now.getDate()}日`;
  })();

  return (
    <>
      <PageHeader
        title={dayLabel}
        subtitle={`${greeting} · ${dateLabel}`}
        action={
          <button style={{
            width: 40, height: 40, borderRadius: '50%', border: 0,
            background: 'var(--bg-subtle)', color: 'var(--text-sec)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" />
            </svg>
          </button>
        }
      />

      <div style={{ padding: '4px 16px 8px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Overdue alert */}
        {overdue.length > 0 && (
          <Link href="/assignments" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 12,
            background: 'var(--danger-bg)',
            border: '1px solid #FECACA',
            textDecoration: 'none',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--danger)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4M12 17h.01" /><path d="M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.4 0z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)' }}>期限超過 {overdue.length} 件</div>
              <div style={{ fontSize: 12, color: 'var(--danger)', opacity: 0.85 }}>すぐに確認しましょう</div>
            </div>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        )}

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: '今日', value: todayCourses.length, unit: 'コマ', color: 'var(--accent-600)' },
            { label: '今週', value: weekDue.length + todayDue.length, unit: '件', color: 'var(--warn)' },
            { label: '完了', value: assignments.filter((a) => a.completed).length, unit: '件', color: 'var(--ok)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px 12px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-ter)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: '-0.02em', fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</span>
                <span style={{ fontSize: 11, color: 'var(--text-ter)', fontWeight: 600 }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Today's classes */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px', marginBottom: 10 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-ter)', margin: 0 }}>今日の授業</h2>
            <Link href="/timetable" style={{ background: 'transparent', fontSize: 12, fontWeight: 600, color: 'var(--accent-600)', textDecoration: 'none' }}>時間割 →</Link>
          </div>
          {todayCourses.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '32px 16px', textAlign: 'center', color: 'var(--text-ter)', fontSize: 14 }}>
              今日は授業がありません
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {todayCourses.map(({ course, period, start, end }, idx) => {
                const cs = getCourseStyle(course.color);
                return (
                  <Link key={`${course.id}-${period}`} href={`/courses/syllabus?id=${course.id}`} style={{
                    display: 'flex', gap: 0, background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
                    cursor: 'pointer', textDecoration: 'none',
                  }}>
                    <div style={{ width: 4, background: cs.bar, flexShrink: 0 }} />
                    <div style={{ padding: '12px 14px', flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.04em', lineHeight: 1 }}>{period}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-ter)', letterSpacing: '0.12em', marginTop: 2 }}>限</div>
                      </div>
                      <div style={{ width: 1, height: 36, background: 'var(--border)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {course.name}
                          </span>
                          {idx === 0 && <Pill tone="accent">NOW</Pill>}
                        </div>
                        <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-sec)', fontVariantNumeric: 'tabular-nums' }}>
                          <span>{start}–{end}</span>
                          {course.room && <><span>·</span><span>{course.room}</span></>}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Upcoming assignments */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px', marginBottom: 10 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-ter)', margin: 0 }}>直近の課題</h2>
            <Link href="/assignments" style={{ background: 'transparent', fontSize: 12, fontWeight: 600, color: 'var(--accent-600)', textDecoration: 'none' }}>すべて →</Link>
          </div>
          {upcoming.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '32px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>✓</div>
              <div style={{ color: 'var(--text-ter)', fontSize: 14 }}>未着手の課題はありません</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcoming.map((a) => {
                const course = courseMap[a.courseId];
                const cs = course ? getCourseStyle(course.color) : null;
                const cat = classifyDeadline(a.deadline);
                return (
                  <Link key={a.id} href="/assignments" style={{
                    display: 'flex', background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
                    textDecoration: 'none',
                  }}>
                    <PriorityBar priority={a.priority} />
                    <div style={{ flex: 1, padding: '11px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{a.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {course && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-sec)', fontWeight: 500 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: cs!.solid, display: 'inline-block' }} />
                            {course.name}
                          </span>
                        )}
                        <span style={{
                          fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                          color: cat === 'overdue' ? 'var(--danger)' : cat === 'today' ? 'var(--warn)' : 'var(--text-ter)',
                        }}>
                          {cat === 'overdue' && '期限超過 · '}
                          {cat === 'today' && '本日 · '}
                          {formatDate(a.deadline)}
                        </span>
                        <PriorityBadge priority={a.priority} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
