'use client';

import { useState } from 'react';
import { Assignment, Priority } from '@/types';
import { useCourses } from '@/hooks/useCourses';
import { useAssignments } from '@/hooks/useAssignments';
import { getCourseStyle, getPriorityStyle } from '@/lib/constants';
import { formatDate, classifyDeadline, today, addDays } from '@/lib/utils';
import { PriorityBar } from '@/components/ui/Badge';
import PageHeader from '@/components/layout/PageHeader';
import Modal from '@/components/ui/Modal';

type FormData = Omit<Assignment, 'id' | 'createdAt'>;

function AssignmentForm({ initial, courses, onSubmit, onCancel }: {
  initial?: Partial<FormData>;
  courses: ReturnType<typeof useCourses>['courses'];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [courseId, setCourseId] = useState(initial?.courseId ?? '');
  const [deadline, setDeadline] = useState(initial?.deadline ?? today());
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [completed] = useState(initial?.completed ?? false);

  const fieldStyle = {
    width: '100%', height: 44, padding: '0 14px',
    background: 'var(--bg-subtle)', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: 10,
    fontSize: 16, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const,
  };
  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: 'var(--text-sec)', letterSpacing: '0.02em', marginBottom: 6, display: 'block' as const };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (title.trim()) onSubmit({ title: title.trim(), courseId, deadline, priority, description, completed }); }}>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>課題名</label>
        <input style={fieldStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例: レポート第3回" required />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>科目</label>
        <select style={{ ...fieldStyle, appearance: 'auto' } as React.CSSProperties} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">— 選択 —</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>締め切り</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {([
            { days: 0, label: '今日' },
            { days: 1, label: '明日' },
            { days: 3, label: '3日後' },
            { days: 7, label: '1週間' },
          ] as { days: number; label: string }[]).map(({ days, label }) => {
            const val = addDays(today(), days);
            const active = deadline === val;
            return (
              <button key={days} type="button" onClick={() => setDeadline(val)} style={{
                height: 40, borderRadius: 8, fontFamily: 'inherit',
                border: `1px solid ${active ? 'var(--text)' : 'var(--border)'}`,
                background: active ? 'var(--text)' : 'var(--surface)',
                color: active ? 'var(--bg)' : 'var(--text-sec)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>{label}</button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-ter)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
          {formatDate(deadline)}
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>優先度</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['high', 'medium', 'low'] as Priority[]).map((p) => {
            const ps = getPriorityStyle(p);
            const active = priority === p;
            return (
              <button key={p} type="button" onClick={() => setPriority(p)} style={{
                flex: 1, height: 44, borderRadius: 10, fontFamily: 'inherit',
                border: `1px solid ${active ? ps.bar : 'var(--border)'}`,
                background: active ? ps.bg : 'var(--surface)',
                color: active ? ps.text : 'var(--text-sec)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <span style={{ width: 4, height: 16, background: ps.bar, borderRadius: 2 }} />
                {ps.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>メモ</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="課題の詳細..." style={{
          width: '100%', padding: '10px 14px', background: 'var(--bg-subtle)', color: 'var(--text)',
          border: '1px solid var(--border)', borderRadius: 10,
          fontSize: 16, fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box',
        }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={onCancel} style={{
          flex: 1, height: 44, borderRadius: 10, border: '1px solid var(--border-strong)',
          background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>キャンセル</button>
        <button type="submit" disabled={!title.trim()} style={{
          flex: 1, height: 44, borderRadius: 10, border: 0,
          background: 'var(--text)', color: 'var(--bg)', fontSize: 14, fontWeight: 600,
          cursor: title.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: title.trim() ? 1 : 0.5,
        }}>保存</button>
      </div>
    </form>
  );
}

export default function AssignmentsPage() {
  const { courses } = useCourses();
  const { assignments, addAssignment, updateAssignment, deleteAssignment, toggleComplete } = useAssignments();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterCourse, setFilterCourse] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [showCompleted, setShowCompleted] = useState(false);

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));
  const editTarget = editId ? assignments.find((a) => a.id === editId) : undefined;

  const filtered = assignments.filter((a) => {
    if (filterCourse && a.courseId !== filterCourse) return false;
    if (filterPriority && a.priority !== filterPriority) return false;
    if (!showCompleted && a.completed) return false;
    if (showCompleted && !a.completed) return false;
    return true;
  }).sort((a, b) => a.deadline.localeCompare(b.deadline));

  const sections = showCompleted ? [
    { key: 'completed', label: '完了済み', items: filtered, color: 'var(--ok)' },
  ] : [
    { key: 'overdue', label: '期限超過', items: filtered.filter((a) => classifyDeadline(a.deadline) === 'overdue'), color: 'var(--danger)' },
    { key: 'today',   label: '今日まで', items: filtered.filter((a) => classifyDeadline(a.deadline) === 'today'),   color: 'var(--warn)' },
    { key: 'week',    label: '今週中',   items: filtered.filter((a) => classifyDeadline(a.deadline) === 'week'),    color: 'var(--accent-600)' },
    { key: 'later',   label: 'それ以降', items: filtered.filter((a) => classifyDeadline(a.deadline) === 'later'),   color: 'var(--text-sec)' },
  ];

  const chipBtn = (active: boolean, color?: string) => ({
    height: 32, padding: '0 12px', borderRadius: 999, fontFamily: 'inherit',
    border: `1px solid ${active ? (color || 'var(--text)') : 'var(--border)'}`,
    background: active ? (color ? `${color}18` : 'var(--text)') : 'var(--surface)',
    color: active ? (color || 'var(--bg)') : 'var(--text-sec)',
    fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
  } as React.CSSProperties);

  return (
    <>
      <PageHeader
        title="課題"
        subtitle={`${filtered.length} 件`}
        action={
          <button onClick={() => setShowAdd(true)} style={{
            width: 40, height: 40, borderRadius: '50%', border: 0,
            background: 'var(--text)', color: 'var(--bg)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        }
      />

      {/* Filter chips */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} style={{
          height: 32, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 999,
          background: 'var(--surface)', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit',
          fontWeight: 500, outline: 'none', flexShrink: 0,
        }}>
          <option value="">全科目</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {([['', '全優先度'], ['high', '高'], ['medium', '中'], ['low', '低']] as [Priority | '', string][]).map(([v, l]) => (
          <button key={v} onClick={() => setFilterPriority(v)} style={chipBtn(filterPriority === v)}>{l}</button>
        ))}
        <button onClick={() => setShowCompleted(!showCompleted)} style={{
          ...chipBtn(showCompleted, 'var(--ok)'),
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          完了
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {sections.every((s) => s.items.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-ter)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>該当する課題はありません</div>
          </div>
        ) : sections.map((section) => {
          if (section.items.length === 0) return null;
          return (
            <div key={section.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '0 4px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: section.color }} />
                <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '0.02em' }}>{section.label}</h3>
                <span style={{ fontSize: 11, color: 'var(--text-ter)', fontWeight: 600 }}>{section.items.length}件</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.items.map((a) => {
                  const course = courseMap[a.courseId];
                  const cs = course ? getCourseStyle(course.color) : null;
                  const cat = classifyDeadline(a.deadline);
                  return (
                    <div key={a.id} style={{
                      display: 'flex', background: 'var(--surface)',
                      border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
                    }}>
                      <PriorityBar priority={a.priority} />
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <button onClick={() => toggleComplete(a.id)} style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                          border: `1.5px solid ${a.completed ? 'var(--ok)' : 'var(--border-strong)'}`,
                          background: a.completed ? 'var(--ok)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}>
                          {a.completed && (
                            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }} onClick={() => setEditId(a.id)}>
                          <div style={{
                            fontSize: 15, fontWeight: 700, color: 'var(--text)',
                            textDecoration: a.completed ? 'line-through' : 'none',
                            marginBottom: 4, lineHeight: 1.3,
                          }}>{a.title}</div>
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
                          </div>
                          {a.description && (
                            <p style={{ fontSize: 12, color: 'var(--text-ter)', margin: '8px 0 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{a.description}</p>
                          )}
                        </div>
                        <button onClick={() => { if (confirm('削除しますか？')) deleteAssignment(a.id); }} style={{
                          background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--text-ter)', padding: 4,
                        }}>
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="課題を追加">
        <AssignmentForm courses={courses} onSubmit={(data) => { addAssignment(data); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal open={!!editTarget} onClose={() => setEditId(null)} title="課題を編集">
        {editTarget && (
          <AssignmentForm
            initial={editTarget}
            courses={courses}
            onSubmit={(data) => { updateAssignment(editTarget.id, data); setEditId(null); }}
            onCancel={() => setEditId(null)}
          />
        )}
      </Modal>
    </>
  );
}
