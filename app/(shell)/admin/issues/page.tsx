import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { AdminIssuesList } from '@/components/celeste/admin-issues-list';

export default function AdminIssuesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 px-6 pt-5 text-sm"
      >
        <Link
          href="/admin/firm-knowledge?tab=schemas"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Document schemas
        </Link>
        <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="font-semibold text-foreground" aria-current="page">
          Documents with issues
        </span>
      </nav>

      <div className="flex flex-1 justify-center px-8 pt-6 pb-16">
        <AdminIssuesList />
      </div>
    </main>
  );
}
