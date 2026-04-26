'use client';

import { useState } from 'react';
import { ScheduleSlot } from '@/types';
import { useCourses } from '@/hooks/useCourses';
import { useTemplates } from '@/hooks/useTemplates';
import { useAssignments } from '@/hooks/useAssignments';
import PageHeader from '@/components/layout/PageHeader';
import TimetableGrid from '@/components/timetable/TimetableGrid';
import CourseSlotModal from '@/components/timetable/CourseSlotModal';

export default function TimetablePage() {
  const { courses, addCourse, updateCourse, deleteCourse, getCourseForSlot } = useCourses();
  const { templates, upsertTemplate } = useTemplates();
  const { assignments } = useAssignments();
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);

  const selectedCourse = selectedSlot ? getCourseForSlot(selectedSlot) : undefined;

  return (
    <>
      <PageHeader title="時間割" subtitle={`${new Date().getFullYear()} 春学期`} />
      <TimetableGrid courses={courses} assignments={assignments} onCellClick={setSelectedSlot} />
      <CourseSlotModal
        slot={selectedSlot}
        course={selectedCourse}
        courses={courses}
        templates={templates}
        onAddCourse={(data, slot) => {
          addCourse({ ...data, slots: [slot] });
        }}
        onUpdateCourse={(id, data) => updateCourse(id, data)}
        onDeleteCourse={(id) => {
          const course = courses.find((c) => c.id === id);
          if (!course || !selectedSlot) return;
          const remaining = course.slots.filter(
            (s) => !(s.day === selectedSlot.day && s.period === selectedSlot.period),
          );
          if (remaining.length === 0) deleteCourse(id);
          else updateCourse(id, { slots: remaining });
        }}
        onAddSlotToCourse={(courseId, slot) => {
          const course = courses.find((c) => c.id === courseId);
          if (!course) return;
          updateCourse(courseId, { slots: [...course.slots, slot] });
        }}
        onSaveTemplate={(data) => upsertTemplate(data)}
        onClose={() => setSelectedSlot(null)}
      />
    </>
  );
}
