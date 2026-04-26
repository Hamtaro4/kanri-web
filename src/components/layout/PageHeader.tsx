interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  back?: { label: string; onClick: () => void };
}

export default function PageHeader({ title, subtitle, action, back }: PageHeaderProps) {
  return (
    <div style={{ padding: '14px 20px 12px', background: 'var(--bg)' }}>
      {back && (
        <button
          onClick={back.onClick}
          style={{
            background: 'transparent', border: 0, padding: '4px 0',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: 'var(--accent-600)', fontSize: 14, cursor: 'pointer',
            marginBottom: 6, fontFamily: 'inherit', fontWeight: 500,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-9 6 9 6" />
          </svg>
          {back.label}
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {subtitle && (
            <div style={{
              fontSize: 12, color: 'var(--text-ter)', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2,
            }}>{subtitle}</div>
          )}
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: 'var(--text)', margin: 0,
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>{title}</h1>
        </div>
        {action}
      </div>
    </div>
  );
}
