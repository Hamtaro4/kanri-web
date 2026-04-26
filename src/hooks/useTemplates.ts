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

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return { templates, addTemplate, deleteTemplate };
}
