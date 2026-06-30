'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'admin-subnav-layout';
const EVENT_NAME = 'admin-subnav-layout-change';

export type AdminSubNavLayout = 'A' | 'B';

export function useAdminSubNavLayout(): readonly [
  AdminSubNavLayout,
  (v: AdminSubNavLayout) => void,
] {
  const [layout, setLayoutState] = useState<AdminSubNavLayout>('A');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'A' || stored === 'B') setLayoutState(stored);

    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === 'A' || detail === 'B') setLayoutState(detail);
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'A' || e.newValue === 'B')) {
        setLayoutState(e.newValue);
      }
    };

    window.addEventListener(EVENT_NAME, handleCustom);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, handleCustom);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setLayout = (v: AdminSubNavLayout) => {
    setLayoutState(v);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, v);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: v }));
    }
  };

  return [layout, setLayout] as const;
}
