import { Suspense, type ReactNode } from 'react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/celeste/app-sidebar';

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>
        {children}
      </div>
    </SidebarProvider>
  );
}
