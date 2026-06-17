import type { ReactNode } from 'react';
import { Geist, Lora } from 'next/font/google';
import { cn } from '@/lib/utils';

import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata = {
  title: 'Celeste',
  description: 'Celeste — Intapp AI assistant',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable, lora.variable)}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
