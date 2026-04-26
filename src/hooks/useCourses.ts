'use client';

import { Course, ScheduleSlot, SyllabusEntry } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { useLocalStorage } from './useLocalStorage';

export function useCourses() {
  const [courses, setCourses] = useLocalStorage<Course[]>(STORAGE_KEYS.courses, []);

  const addCourse = (data: Omit<Course, 'id' | 'createdAt' | 'syllabusEntries'>) => {
    const course: Course = {
      ...data,
      id: generateId(),
      syllabusEntries: [],
      createdAt: new Date().toISOString(),
    };
    setCourses([...courses, course]);
    return course;
  };

  const updateCourse = (id: string, data: Partial<Omit<Course, 'id' | 'createdAt'>>) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const getCourseById = (id: string) => courses.find((c) => c.id === id);

  const getCourseForSlot = (slot: ScheduleSlot) =>
    courses.find((c) => c.slots.some((s) => s.day === slot.day && s.period === slot.period));

  const addSyllabusEntry = (courseId: string, entry: Omit<SyllabusEntry, 'id'>) => {
    const newEntry: SyllabusEntry = { ...entry, id: generateId() };
    setCourses(
      courses.map((c) =>
        c.id === courseId ? { ...c, syllabusEntries: [...c.syllabusEntries, newEntry] } : c,
      ),
    );
  };

  const updateSyllabusEntry = (courseId: string, entryId: string, data: Partial<Omit<SyllabusEntry, 'id'>>) => {
    setCourses(
      courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              syllabusEntries: c.syllabusEntries.map((e) =>
                e.id === entryId ? { ...e, ...data } : e,
              ),
            }
          : c,
      ),
    );
  };

  const deleteSyllabusEntry = (courseId: string, entryId: string) => {
    setCourses(
      courses.map((c) =>
        c.id === courseId
          ? { ...c, syllabusEntries: c.syllabusEntries.filter((e) => e.id !== entryId) }
          : c,
      ),
    );
  };

  return {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    getCourseForSlot,
    addSyllabusEntry,
    updateSyllabusEntry,
    deleteSyllabusEntry,
  };
}
