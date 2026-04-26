'use client';

import { CourseTemplate } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { useLocalStorage } from './useLocalStorage';

export function useTemplates() {
  const [templates, setTemplates] = useLocalStorage<CourseTemplate[]>(STORAGE_KEYS.templates, []);

  const addTemplate = (data: Omit<CourseTemplate, 'id'>) => {
    const template: CourseTemplate = { ...data, id: generateId() };
    setTemplates([...templates, template]);
    return template;
  };

  // Replace existing template with same name, or add new one (1 per course)
  const upsertTemplate = (data: Omit<CourseTemplate, 'id'>) => {
    const existing = templates.find((t) => t.name === data.name);
    if (existing) {
      setTemplates(templates.map((t) => t.id === existing.id ? { ...t, ...data } : t));
      return existing;
    }
    return addTemplate(data);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return { templates, addTemplate, upsertTemplate, deleteTemplate };
}
