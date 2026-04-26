'use client';

import Link from 'next/link';
import { useCourses } from '@/hooks/useCourses';
import { useAssignments } from '@/hooks/useAssignments';
import { getCourseStyle } from '@/lib/constants';
import PageHeader from '@/components/layout/PageHeader';

export default function CoursesPage() {
  const { courses } = useCourses();
  const { assignments } = useAssignments();

  const aCount: Record<string, number> = {};
  assignments.forEach((a) => {
    if (!a.completed) aCount[a.courseId] = (aCount[a.courseId] || 0) + 1;
  });

  return (
    <>
      <PageHeader title="シラバス" subtitle={`${courses.length} 科目`} />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {courses.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            border: '1.5px dashed var(--border)', borderRadius: 14, color: 'var(--text-ter)',
          }}>
            <p style={{ fontSize: 32, margin: '0 0 8px' }}>📚</p>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>コースがありません</p>
            <Link href="/timetable" style={{ fontSize: 13, color: 'var(--accent-600)', marginTop: 8, display: 'inline-block', textDecoration: 'none', fontWeight: 500 }}>
              時間割でコースを追加 →
            </Link>
          </div>
        ) : (
          courses.map((c) => {
            const cs = getCourseStyle(c.color);
            const count = aCount[c.id] || 0;
            return (
              <Link key={c.id} href={`/courses/syllabus?id=${c.id}`} style={{
                display: 'flex', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
                textDecoration: 'none',
              }}>
                <div style={{ width: 4, background: cs.bar, flexShrink: 0 }} />
                <div style={{ flex: 1, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{c.name}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-sec)' }}>
                      {c.teacher && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" />
                          </svg>
                          {c.teacher}
                        </span>
                      )}
                      {c.room && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          {c.room}
                        </span>
                      )}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                        </svg>
                        週{c.slots.length}回
                      </span>
                    </div>
                  </div>
                  {count > 0 && (
                    <span style={{
                      minWidth: 20, height: 20, padding: '0 6px',
                      borderRadius: 10, background: 'var(--danger)', color: '#fff',
                      fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{count}</span>
                  )}
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--text-ter)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
