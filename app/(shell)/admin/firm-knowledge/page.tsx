import { Suspense } from 'react';

import { AdminKnowledgeHubs } from '@/components/celeste/admin-knowledge-hubs';

export default function AdminFirmKnowledgePage() {
  return (
    <main className="flex flex-1 justify-center px-8 pt-10 pb-16">
      <Suspense fallback={null}>
        <AdminKnowledgeHubs />
      </Suspense>
    </main>
  );
}
