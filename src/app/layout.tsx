import type { Metadata } from 'next';
import './globals.css';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: '履修管理',
  description: '大学の履修・課題管理アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <main style={{ paddingBottom: 100, minHeight: '100vh' }}>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
