'use client';

import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function Modal({ open, onClose, title, children, action }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in"
      style={{ background: 'rgba(0,0,0,0)' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-h-[90vh] flex flex-col animate-slide-up"
        style={{
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
        </div>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 8px',
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{title}</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {action}
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--bg-subtle)', border: 0,
                color: 'var(--text-sec)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
        </div>
        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '8px 20px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
