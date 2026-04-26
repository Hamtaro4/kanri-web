'use client';

import { SyllabusEntry } from '@/types';
import { generateId } from '@/lib/utils';
import { useLocalStorage } from './useLocalStorage';

// Stored as Record<courseId, SyllabusEntry[]> under 'kanri_syllabus'
type SyllabusData = Record<string, SyllabusEntry[]>;

export function useSyllabus() {
  const [data, setData] = useLocalStorage<SyllabusData>('kanri_syllabus', {});

  const getEntries = (courseId: string): SyllabusEntry[] =>
    (data[courseId] ?? []).slice().sort((a, b) => a.weekNumber - b.weekNumber);

  const addEntry = (courseId: string, entry: Omit<SyllabusEntry, 'id'>) => {
    const newEntry: SyllabusEntry = { ...entry, id: generateId() };
    setData({ ...data, [courseId]: [...(data[courseId] ?? []), newEntry] });
  };

  const updateEntry = (
    courseId: string,
    id: string,
    updates: Partial<Omit<SyllabusEntry, 'id'>>,
  ) => {
    setData({
      ...data,
      [courseId]: (data[courseId] ?? []).map((e) =>
        e.id === id ? { ...e, ...updates } : e,
      ),
    });
  };

  const deleteEntry = (courseId: string, id: string) => {
    setData({
      ...data,
      [courseId]: (data[courseId] ?? []).filter((e) => e.id !== id),
    });
  };

  return { getEntries, addEntry, updateEntry, deleteEntry };
}
