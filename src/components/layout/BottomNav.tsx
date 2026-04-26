'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'ホーム',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8" /><path d="M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
      </svg>
    ),
  },
  {
    href: '/timetable',
    label: '時間割',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    href: '/assignments',
    label: '課題',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 6h17M3.5 12h17M3.5 18h12" />
        <path d="M19 16l2 2 4-4" transform="translate(-3 0)" />
      </svg>
    ),
  },
  {
    href: '/courses',
    label: 'シラバス',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex justify-around px-2 pt-1.5 pb-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-2 min-w-[60px]"
              style={{ color: active ? 'var(--accent-600)' : 'var(--text-ter)' }}
            >
              {item.icon(active)}
              <span style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                letterSpacing: '0.02em',
              }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
