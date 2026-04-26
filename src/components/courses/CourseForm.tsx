'use client';

import { useState } from 'react';
import { Course, CourseTemplate } from '@/types';
import CourseColorPicker from './CourseColorPicker';

type CourseFormData = Pick<Course, 'name' | 'teacher' | 'room' | 'color'>;

interface CourseFormProps {
  initial?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function CourseForm({ initial, onSubmit, onCancel, submitLabel = '保存' }: CourseFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [teacher, setTeacher] = useState(initial?.teacher ?? '');
  const [room, setRoom] = useState(initial?.room ?? '');
  const [color, setColor] = useState(initial?.color ?? 'blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), teacher: teacher.trim(), room: room.trim(), color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">科目名 *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 線形代数"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">担当教員</label>
        <input
          type="text"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          placeholder="例: 山田先生"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">教室</label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="例: A101"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">カラー</label>
        <CourseColorPicker value={color} onChange={setColor} />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
          disabled={!name.trim()}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
