'use client';

import { useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useSyllabus } from '@/hooks/useSyllabus';
import { getCourseStyle } from '@/lib/constants';
import Modal from '@/components/ui/Modal';
import PageHeader from '@/components/layout/PageHeader';

function SyllabusEntryForm({ initial, onSubmit, onDelete, onCancel }: {
  initial?: { id?: string; weekNumber?: number; topic?: string; description?: string };
  onSubmit: (data: { weekNumber: number; topic: string; description: string }) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [weekNumber, setWeekNumber] = useState(initial?.weekNumber ?? 1);
  const [topic, setTopic] = useState(initial?.topic ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const isEdit = !!initial?.id;

  const fieldStyle = {
    width: '100%', height: 44, padding: '0 14px',
    background: 'var(--bg-subtle)', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: 10,
    fontSize: 16, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const,
  };
  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: 'var(--text-sec)', letterSpacing: '0.02em', marginBottom: 6, display: 'block' as const };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (topic.trim()) onSubmit({ weekNumber: Number(weekNumber), topic: topic.trim(), description: description.trim() }); }}>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>週</label>
        <input style={fieldStyle} type="number" min={1} max={30} value={weekNumber} onChange={(e) => setWeekNumber(Number(e.target.value))} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>トピック</label>
        <input style={fieldStyle} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="例: 行列の演算" required />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>内容・メモ</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
          placeholder="授業の内容や課題..." style={{
          width: '100%', padding: '10px 14px', background: 'var(--bg-subtle)', color: 'var(--text)',
          border: '1px solid var(--border)', borderRadius: 10,
          fontSize: 16, fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box',
        }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {isEdit && onDelete && (
          <button type="button" onClick={onDelete} style={{
            height: 44, padding: '0 14px', borderRadius: 10, border: '1px solid var(--danger-bg)',
            background: 'transparent', color: 'var(--danger)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
            削除
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button type="button" onClick={onCancel} style={{
          height: 44, padding: '0 16px', borderRadius: 10, border: '1px solid var(--border-strong)',
          background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>キャンセル</button>
        <button type="submit" style={{
          height: 44, padding: '0 16px', borderRadius: 10, border: 0,
          background: 'var(--text)', color: 'var(--bg)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>{isEdit ? '保存' : '追加'}</button>
      </div>
    </form>
  );
}

export default function SyllabusPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { courses } = useCourses();
  const { getEntries, addEntry, updateEntry, deleteEntry } = useSyllabus();
  const course = courses.find((c) => c.id === courseId);
  const [showAdd, setShowAdd] = useState(false);
  const [editEntryId, setEditEntryId] = useState<string | null>(null);

  if (!course) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-ter)' }}>
        <p>コースが見つかりません</p>
      </div>
    );
  }

  const cs = getCourseStyle(course.color);
  const sorted = getEntries(courseId);
  const editEntry = editEntryId ? sorted.find((e) => e.id === editEntryId) : undefined;

  const nextWeek = () => {
    const used = new Set(sorted.map((e) => e.weekNumber));
    for (let i = 1; i <= 15; i++) if (!used.has(i)) return i;
    return sorted.length + 1;
  };

  return (
    <>
      <PageHeader
        title={course.name}
        subtitle="シラバス"
        back={{ label: 'シラバス', onClick: () => router.push('/courses') }}
        action={
          <button onClick={() => setShowAdd(true)} style={{
            background: 'transparent', border: 0, fontSize: 13, fontWeight: 600,
            color: 'var(--accent-600)', cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 3,
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            週を追加
          </button>
        }
      />

      <div style={{ padding: '0 16px' }}>
        {/* Course info chip */}
        <div style={{
          background: cs.tint, border: `1px solid ${cs.border}`,
          borderLeft: `4px solid ${cs.bar}`,
          borderRadius: 12, padding: '14px 16px', marginBottom: 18,
        }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: cs.text }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>担当</div>
              <div style={{ fontWeight: 600 }}>{course.teacher || '—'}</div>
            </div>
            <div style={{ width: 1, background: cs.border }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>教室</div>
              <div style={{ fontWeight: 600 }}>{course.room || '—'}</div>
            </div>
            <div style={{ width: 1, background: cs.border }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>週</div>
              <div style={{ fontWeight: 600 }}>{sorted.length}/15</div>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px', marginBottom: 12 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-ter)', margin: 0 }}>週ごとの内容</h2>
        </div>

        {sorted.length === 0 ? (
          <div onClick={() => setShowAdd(true)} style={{
            border: '1.5px dashed var(--border)', borderRadius: 12,
            padding: '32px 16px', textAlign: 'center', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 13, color: 'var(--text-sec)', fontWeight: 600, marginBottom: 4 }}>シラバスがまだありません</div>
            <div style={{ fontSize: 12, color: 'var(--text-ter)' }}>タップして1週目を追加</div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.map((entry, idx) => {
                const isCurrent = idx === 0;
                return (
                  <div key={entry.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    {/* Circle */}
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: isCurrent ? cs.bar : 'var(--surface)',
                      border: `1.5px solid ${isCurrent ? cs.bar : 'var(--border-strong)'}`,
                      color: isCurrent ? '#fff' : 'var(--text-sec)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                      position: 'relative', zIndex: 1,
                    }}>{entry.weekNumber}</div>
                    {/* Card */}
                    <div onClick={() => setEditEntryId(entry.id)} style={{
                      flex: 1, background: 'var(--surface)', cursor: 'pointer',
                      border: `1px solid ${isCurrent ? cs.border : 'var(--border)'}`,
                      borderRadius: 12, padding: '12px 14px', marginBottom: 2,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', flex: 1 }}>{entry.topic}</div>
                        {isCurrent && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 8px', borderRadius: 999,
                            background: 'var(--accent-50)', color: 'var(--accent-600)',
                            fontSize: 11, fontWeight: 600,
                          }}>今週</span>
                        )}
                      </div>
                      {entry.description && (
                        <p style={{ fontSize: 12, color: 'var(--text-sec)', margin: 0, lineHeight: 1.5 }}>{entry.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="週を追加">
        <SyllabusEntryForm
          initial={{ weekNumber: nextWeek() }}
          onSubmit={(data) => { addEntry(courseId, data); setShowAdd(false); }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>
      <Modal open={!!editEntry} onClose={() => setEditEntryId(null)} title="週を編集">
        {editEntry && (
          <SyllabusEntryForm
            initial={editEntry}
            onSubmit={(data) => { updateEntry(courseId, editEntry.id, data); setEditEntryId(null); }}
            onDelete={() => { deleteEntry(courseId, editEntry.id); setEditEntryId(null); }}
            onCancel={() => setEditEntryId(null)}
          />
        )}
      </Modal>
    </>
  );
}
