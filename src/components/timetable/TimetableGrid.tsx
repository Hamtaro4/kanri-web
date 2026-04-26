'use client';

import { Course, ScheduleSlot, Day, Period, Assignment } from '@/types';
import { DAYS, PERIODS, LUNCH_AFTER_PERIOD, getCourseStyle, TODAY_DAY_MAP } from '@/lib/constants';

interface TimetableGridProps {
  courses: Course[];
  assignments: Assignment[];
  onCellClick: (slot: ScheduleSlot) => void;
}

export default function TimetableGrid({ courses, assignments, onCellClick }: TimetableGridProps) {
  const todayDow = new Date().getDay();
  const todayDay = TODAY_DAY_MAP[todayDow];

  const assignCountByCourse: Record<string, number> = {};
  assignments.forEach((a) => {
    if (!a.completed) assignCountByCourse[a.courseId] = (assignCountByCourse[a.courseId] || 0) + 1;
  });

  const getCourse = (day: Day, period: Period) =>
    courses.find((c) => c.slots.some((s) => s.day === day && s.period === period));

  const DAY_COL_W = 100;
  const PERIOD_COL_W = 56;

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <div style={{ minWidth: PERIOD_COL_W + DAY_COL_W * DAYS.length, paddingRight: 16 }}>

        {/* Legend */}
        <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-ter)', fontWeight: 600 }}>
            {courses.length} 科目 · {courses.reduce((n, c) => n + c.slots.length, 0)} コマ
          </span>
          {todayDay && (
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-ter)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-600)', display: 'inline-block' }} />
              今日
            </span>
          )}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
          <div style={{ width: PERIOD_COL_W, flexShrink: 0 }} />
          {DAYS.map((d) => {
            const isToday = d.key === todayDay;
            return (
              <div key={d.key} style={{
                width: DAY_COL_W, flexShrink: 0,
                textAlign: 'center', padding: '4px 0 8px',
                borderBottom: `1px solid ${isToday ? 'var(--accent-600)' : 'transparent'}`,
              }}>
                <div style={{
                  display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  padding: isToday ? '4px 12px' : '4px 0',
                  background: isToday ? 'var(--accent-600)' : 'transparent',
                  color: isToday ? '#fff' : 'var(--text-sec)',
                  borderRadius: 999,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{d.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rows */}
        {PERIODS.map(({ period, start, end }) => (
          <>
            <div key={period} style={{ display: 'flex', minHeight: 78 }}>
              {/* Period label */}
              <div style={{
                width: PERIOD_COL_W, flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '4px 0',
              }}>
                <div style={{
                  fontSize: 22, fontWeight: 800, color: 'var(--text)',
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.04em', lineHeight: 1,
                }}>{period}</div>
                <div style={{ fontSize: 9, color: 'var(--text-ter)', marginTop: 4, textAlign: 'center', lineHeight: 1.3, fontVariantNumeric: 'tabular-nums' }}>
                  {start}<br />{end}
                </div>
              </div>

              {/* Day cells */}
              {DAYS.map((d) => {
                const course = getCourse(d.key, period);
                const cs = course ? getCourseStyle(course.color) : null;
                const isToday = d.key === todayDay;
                const aCount = course ? (assignCountByCourse[course.id] || 0) : 0;
                return (
                  <div key={d.key} style={{
                    width: DAY_COL_W, flexShrink: 0, padding: '3px',
                    background: isToday
                      ? 'rgba(0,0,0,0.015)'
                      : 'transparent',
                  }}>
                    <button
                      onClick={() => onCellClick({ day: d.key, period })}
                      style={{
                        width: '100%', height: '100%', minHeight: 70,
                        background: course ? cs!.tint : 'transparent',
                        border: course
                          ? `1px solid ${cs!.border}`
                          : `1px dashed var(--border)`,
                        borderLeft: course
                          ? `3px solid ${cs!.bar}`
                          : `1px dashed var(--border)`,
                        borderRadius: 8, padding: course ? '8px 8px' : 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: course ? 'flex-start' : 'center',
                        justifyContent: course ? 'space-between' : 'center',
                        textAlign: 'left', cursor: 'pointer',
                        position: 'relative', fontFamily: 'inherit', overflow: 'hidden',
                      }}
                    >
                      {course ? (
                        <>
                          <div style={{
                            fontSize: 12, fontWeight: 700, color: cs!.text,
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            wordBreak: 'break-all',
                          }}>{course.name}</div>
                          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 10, color: cs!.text, opacity: 0.7, fontWeight: 500 }}>
                              {course.room}
                            </span>
                            {aCount > 0 && (
                              <span style={{
                                minWidth: 16, height: 16, padding: '0 4px',
                                borderRadius: 8, background: 'var(--danger)', color: '#fff',
                                fontSize: 10, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>{aCount}</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-ter)', fontSize: 18, opacity: 0.4 }}>+</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Lunch break */}
            {period === LUNCH_AFTER_PERIOD && (
              <div key="lunch" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '6px 0', margin: '2px 4px',
                background: 'var(--bg-subtle)', borderRadius: 6,
              }}>
                <span style={{ fontSize: 10, color: 'var(--text-ter)', fontWeight: 600, letterSpacing: '0.1em' }}>
                  昼休み · 12:05–12:35
                </span>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
