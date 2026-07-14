import { Suspense } from 'react';

import { AdminUsage } from '@/components/celeste/admin-usage';

export default function AdminUsagePage() {
  return (
    <main className="flex flex-1 justify-center px-8 pt-10 pb-16">
      <Suspense fallback={null}>
        <AdminUsage />
      </Suspense>
    </main>
  );
}
