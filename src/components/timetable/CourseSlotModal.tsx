'use client';

import { useState, useEffect } from 'react';
import { Course, CourseTemplate, ScheduleSlot } from '@/types';
import { DAYS, PERIODS, COURSE_COLOR_KEYS, getCourseStyle } from '@/lib/constants';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';

interface CourseSlotModalProps {
  slot: ScheduleSlot | null;
  course: Course | undefined;
  courses: Course[];
  templates: CourseTemplate[];
  onAddCourse: (data: Pick<Course, 'name' | 'teacher' | 'room' | 'color'>, slot: ScheduleSlot) => void;
  onUpdateCourse: (id: string, data: Pick<Course, 'name' | 'teacher' | 'room' | 'color'>) => void;
  onDeleteCourse: (id: string) => void;
  onAddSlotToCourse: (courseId: string, slot: ScheduleSlot) => void;
  onSaveTemplate: (course: Pick<Course, 'name' | 'teacher' | 'room' | 'color'>) => void;
  onClose: () => void;
}

type View = 'main' | 'form' | 'template' | 'existing';

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {COURSE_COLOR_KEYS.map((c) => {
        const cs = getCourseStyle(c);
        const active = value === c;
        return (
          <button key={c} type="button" onClick={() => onChange(c)} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: cs.solid, border: 0, cursor: 'pointer', position: 'relative',
            outline: active ? '2px solid var(--text)' : 'none', outlineOffset: 2,
          }}>
            {active && (
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function CourseFormBody({
  initial, templates, showTemplate, onShowTemplate, onSubmit, onDelete, onSaveTemplate, onCancel, isEdit,
}: {
  initial?: Partial<Pick<Course, 'name' | 'teacher' | 'room' | 'color'>>;
  templates: CourseTemplate[];
  showTemplate: boolean;
  onShowTemplate: () => void;
  onSubmit: (data: Pick<Course, 'name' | 'teacher' | 'room' | 'color'>) => void;
  onDelete?: () => void;
  onSaveTemplate?: (data: Pick<Course, 'name' | 'teacher' | 'room' | 'color'>) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [teacher, setTeacher] = useState(initial?.teacher ?? '');
  const [room, setRoom] = useState(initial?.room ?? '');
  const [color, setColor] = useState(initial?.color ?? 'blue');

  const fieldStyle = {
    width: '100%', height: 44, padding: '0 14px',
    background: 'var(--bg-subtle)', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: 10,
    fontSize: 16, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const,
  };
  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: 'var(--text-sec)', letterSpacing: '0.02em', marginBottom: 6, display: 'block' as const };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onSubmit({ name: name.trim(), teacher: teacher.trim(), room: room.trim(), color }); }}>
      {!isEdit && templates.length > 0 && (
        <button type="button" onClick={onShowTemplate} style={{
          width: '100%', height: 44, borderRadius: 10, border: '1px solid var(--border-strong)',
          background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit', marginBottom: 14,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          テンプレートから選ぶ
        </button>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>科目名</label>
        <input style={fieldStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 線形代数" required />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>担当教員</label>
        <input style={fieldStyle} value={teacher} onChange={(e) => setTeacher(e.target.value)} placeholder="例: 山田先生" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>教室</label>
        <input style={fieldStyle} value={room} onChange={(e) => setRoom(e.target.value)} placeholder="例: A101" />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>カラー</label>
        <ColorPicker value={color} onChange={setColor} />
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
          background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>キャンセル</button>
        <button type="submit" disabled={!name.trim()} style={{
          height: 44, padding: '0 16px', borderRadius: 10, border: 0,
          background: 'var(--text)', color: 'var(--bg)', fontSize: 14, fontWeight: 600,
          cursor: name.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: name.trim() ? 1 : 0.5,
        }}>{isEdit ? '保存' : '追加'}</button>
      </div>

      {isEdit && onSaveTemplate && (
        <button type="button" onClick={() => onSaveTemplate({ name, teacher, room, color })} style={{
          width: '100%', marginTop: 10, height: 44, borderRadius: 10, border: 0,
          background: 'transparent', color: 'var(--text-sec)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" />
          </svg>
          テンプレートとして保存
        </button>
      )}
    </form>
  );
}

export default function CourseSlotModal({
  slot, course, courses, templates, onAddCourse, onUpdateCourse, onDeleteCourse, onAddSlotToCourse, onSaveTemplate, onClose,
}: CourseSlotModalProps) {
  const [view, setView] = useState<View>('main');

  useEffect(() => { if (slot) setView('main'); }, [slot]);

  if (!slot) return null;

  const dayLabel = DAYS.find((d) => d.key === slot.day)?.full ?? '';
  const periodInfo = PERIODS.find((p) => p.period === slot.period);
  const slotChip = `${dayLabel} · ${slot.period}限 · ${periodInfo?.start}–${periodInfo?.end}`;
  const cs = course ? getCourseStyle(course.color) : null;

  // Courses that don't already have this slot
  const addableCourses = courses.filter(
    (c) => !c.slots.some((s) => s.day === slot.day && s.period === slot.period),
  );

  // Existing courses view
  if (view === 'existing') {
    return (
      <Modal open title="既存の授業から追加" onClose={onClose}>
        <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8, fontSize: 12, color: 'var(--text-sec)', fontVariantNumeric: 'tabular-nums' }}>
          {slotChip}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {addableCourses.map((c) => {
            const cc = getCourseStyle(c.color);
            return (
              <button key={c.id} onClick={() => { onAddSlotToCourse(c.id, slot); onClose(); }} style={{
                display: 'flex', background: 'var(--surface)', padding: 0,
                border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              }}>
                <div style={{ width: 4, background: cc.bar, flexShrink: 0 }} />
                <div style={{ padding: '12px 14px', flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 2 }}>
                    {[c.teacher, c.room].filter(Boolean).join(' · ')}
                    {c.slots.length > 0 && (
                      <span style={{ marginLeft: 6, color: 'var(--text-ter)' }}>
                        週{c.slots.length}コマ
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingRight: 14 }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--text-ter)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={() => setView('main')} style={{
          width: '100%', height: 44, borderRadius: 10, border: 0,
          background: 'transparent', color: 'var(--text-sec)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>戻る</button>
      </Modal>
    );
  }

  // Template selection view
  if (view === 'template') {
    return (
      <Modal open title="テンプレートから" onClose={onClose}>
        <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8, fontSize: 12, color: 'var(--text-sec)', fontVariantNumeric: 'tabular-nums' }}>
          {slotChip}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {templates.map((t) => {
            const tc = getCourseStyle(t.color);
            return (
              <button key={t.id} onClick={() => { onAddCourse({ name: t.name, teacher: t.teacher, room: t.room, color: t.color }, slot); onClose(); }} style={{
                display: 'flex', background: 'var(--surface)', padding: 0,
                border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              }}>
                <div style={{ width: 4, background: tc.bar }} />
                <div style={{ padding: '10px 14px', flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-sec)' }}>{[t.teacher, t.room].filter(Boolean).join(' · ')}</div>
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={() => setView('form')} style={{
          width: '100%', height: 44, borderRadius: 10, border: 0,
          background: 'transparent', color: 'var(--text-sec)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>戻る</button>
      </Modal>
    );
  }

  // Form view (add or edit)
  if (view === 'form' || (view === 'main' && course)) {
    const isEdit = !!course;
    return (
      <Modal open title={isEdit ? 'コース編集' : 'コース追加'} onClose={onClose}>
        <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8, fontSize: 12, color: 'var(--text-sec)', fontVariantNumeric: 'tabular-nums' }}>
          {slotChip}
        </div>
        <CourseFormBody
          initial={course}
          templates={templates}
          showTemplate={false}
          onShowTemplate={() => setView('template')}
          onSubmit={(data) => {
            if (isEdit && course) onUpdateCourse(course.id, data);
            else onAddCourse(data, slot);
            onClose();
          }}
          onDelete={isEdit && course ? () => { if (confirm(`「${course.name}」を削除しますか？`)) { onDeleteCourse(course.id); onClose(); } } : undefined}
          onSaveTemplate={isEdit ? (data) => { onSaveTemplate(data); } : undefined}
          onCancel={onClose}
          isEdit={isEdit}
        />
      </Modal>
    );
  }

  // Empty slot: main view
  return (
    <Modal open title="コースを追加" onClose={onClose}>
      <div style={{ marginBottom: 14, padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8, fontSize: 12, color: 'var(--text-sec)', fontVariantNumeric: 'tabular-nums' }}>
        {slotChip}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {addableCourses.length > 0 && (
          <button onClick={() => setView('existing')} style={{
            width: '100%', height: 52, borderRadius: 12,
            border: '1px solid var(--border-strong)', background: 'var(--surface)',
            color: 'var(--text)', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            既存の授業から追加
          </button>
        )}
        {templates.length > 0 && (
          <button onClick={() => setView('template')} style={{
            width: '100%', height: 52, borderRadius: 12,
            border: '2px dashed var(--accent-300)', background: 'var(--accent-50)',
            color: 'var(--accent-600)', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>テンプレートから追加</button>
        )}
        <button onClick={() => setView('form')} style={{
          width: '100%', height: 52, borderRadius: 12, border: 0,
          background: 'var(--text)', color: 'var(--bg)',
          fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>新規追加</button>
      </div>
    </Modal>
  );
}
