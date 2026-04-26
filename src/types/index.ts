export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export type Period = 1 | 2 | 3 | 4 | 5 | 6;
export type Priority = 'high' | 'medium' | 'low';

export interface ScheduleSlot {
  day: Day;
  period: Period;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  room: string;
  color: string;
  slots: ScheduleSlot[];
  syllabusEntries: SyllabusEntry[];
  createdAt: string;
}

export interface CourseTemplate {
  id: string;
  name: string;
  teacher: string;
  room: string;
  color: string;
}

export interface SyllabusEntry {
  id: string;
  weekNumber: number;
  topic: string;
  description: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}
