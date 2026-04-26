import { COURSE_COLOR_KEYS, getCourseStyle } from '@/lib/constants';

interface CourseColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function CourseColorPicker({ value, onChange }: CourseColorPickerProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {COURSE_COLOR_KEYS.map((key) => {
        const cs = getCourseStyle(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: cs.solid, border: 0, cursor: 'pointer',
              outline: value === key ? '2px solid var(--text)' : 'none', outlineOffset: 2,
            }}
          />
        );
      })}
    </div>
  );
}
