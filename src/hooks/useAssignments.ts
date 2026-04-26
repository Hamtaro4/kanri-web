'use client';

import { Assignment, Priority } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId, today, classifyDeadline } from '@/lib/utils';
import { useLocalStorage } from './useLocalStorage';

export function useAssignments() {
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>(STORAGE_KEYS.assignments, []);

  const addAssignment = (data: Omit<Assignment, 'id' | 'createdAt'>) => {
    const assignment: Assignment = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setAssignments([...assignments, assignment]);
    return assignment;
  };

  const updateAssignment = (id: string, data: Partial<Omit<Assignment, 'id' | 'createdAt'>>) => {
    setAssignments(assignments.map((a) => (a.id === id ? { ...a, ...data } : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const toggleComplete = (id: string) => {
    setAssignments(assignments.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)));
  };

  const getUpcoming = (days = 7) => {
    const t = today();
    return assignments
      .filter((a) => !a.completed && a.deadline >= t && a.deadline <= addDays(t, days))
      .sort((a, b) => a.deadline.localeCompare(b.deadline));
  };

  const getOverdue = () =>
    assignments
      .filter((a) => !a.completed && a.deadline < today())
      .sort((a, b) => a.deadline.localeCompare(b.deadline));

  const getGrouped = (filterCourseId?: string, filterPriority?: Priority | '', filterStatus?: 'all' | 'active' | 'completed') => {
    let list = [...assignments];
    if (filterCourseId) list = list.filter((a) => a.courseId === filterCourseId);
    if (filterPriority) list = list.filter((a) => a.priority === filterPriority);
    if (filterStatus === 'active') list = list.filter((a) => !a.completed);
    if (filterStatus === 'completed') list = list.filter((a) => a.completed);
    list.sort((a, b) => a.deadline.localeCompare(b.deadline));
    return {
      overdue: list.filter((a) => !a.completed && classifyDeadline(a.deadline) === 'overdue'),
      today: list.filter((a) => !a.completed && classifyDeadline(a.deadline) === 'today'),
      week: list.filter((a) => !a.completed && classifyDeadline(a.deadline) === 'week'),
      later: list.filter((a) => !a.completed && classifyDeadline(a.deadline) === 'later'),
      completed: list.filter((a) => a.completed),
    };
  };

  return { assignments, addAssignment, updateAssignment, deleteAssignment, toggleComplete, getUpcoming, getOverdue, getGrouped };
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
