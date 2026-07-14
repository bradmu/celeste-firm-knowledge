'use client';

import {
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Download,
  Filter,
  RotateCw,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { RowCheckbox } from '@/components/celeste/row-checkbox';
import { StackedToolbar } from '@/components/celeste/stacked-toolbar';

type IssueKind =
  | 'stuck'
  | 'failed'
  | 'no-data'
  | 'low-coverage'
  | 'schema-mismatch';

type Issue = {
  id: string;
  document: string;
  schema: string;
  issue: IssueKind;
  detail: string;
  detected: string;
  uploader: string;
};

const ALL_ISSUES: Issue[] = [
  {
    id: 'i1',
    document: 'Q3 CIM — Acme Corp Holdings.pdf',
    schema: 'Confidential Information Memorandum',
    issue: 'stuck',
    detail: 'Started 26 hours ago',
    detected: 'Mar 9, 2026 · 14:22',
    uploader: 'Bruce Tucker',
  },
  {
    id: 'i2',
    document: 'NDA — Globex Holdings.docx',
    schema: 'NDA',
    issue: 'no-data',
    detail: 'All schema fields returned empty',
    detected: 'Mar 8, 2026 · 09:14',
    uploader: 'Lynne Daniels',
  },
  {
    id: 'i3',
    document: 'Teaser — Initech Capital.pdf',
    schema: 'Teaser',
    issue: 'failed',
    detail: 'Malformed PDF — OCR rejected',
    detected: 'Mar 7, 2026 · 18:42',
    uploader: 'Bruce Tucker',
  },
  {
    id: 'i4',
    document: 'Memo — Hooli Capital.docx',
    schema: 'Offering Memorandum',
    issue: 'low-coverage',
    detail: '38% of fields populated',
    detected: 'Mar 7, 2026 · 11:08',
    uploader: 'Darnell Jones',
  },
  {
    id: 'i5',
    document: 'CIM — Pied Piper Acquisitions.pdf',
    schema: 'Confidential Information Memorandum',
    issue: 'stuck',
    detail: 'Started 18 hours ago',
    detected: 'Mar 9, 2026 · 22:00',
    uploader: 'Lynne Daniels',
  },
  {
    id: 'i6',
    document: 'Term sheet — Vandelay Industries.docx',
    schema: 'NDA',
    issue: 'schema-mismatch',
    detail: "Detected schema doesn't match selection",
    detected: 'Mar 6, 2026 · 16:33',
    uploader: 'Ming Zao',
  },
  {
    id: 'i7',
    document: 'Pitch — Stark Resilient.pdf',
    schema: 'Teaser',
    issue: 'low-coverage',
    detail: '42% of fields populated',
    detected: 'Mar 6, 2026 · 13:10',
    uploader: 'Bruce Tucker',
  },
  {
    id: 'i8',
    document: 'NDA — Wayne Enterprises.pdf',
    schema: 'NDA',
    issue: 'failed',
    detail: 'Password-protected PDF',
    detected: 'Mar 5, 2026 · 09:24',
    uploader: 'Darnell Jones',
  },
  {
    id: 'i9',
    document: 'Mgmt presentation — Massive Dynamic.pptx',
    schema: 'Management Presentation',
    issue: 'no-data',
    detail: 'Slide deck has no extractable text',
    detected: 'Mar 5, 2026 · 08:55',
    uploader: 'Ming Zao',
  },
  {
    id: 'i10',
    document: 'CIM — Cyberdyne Systems.docx',
    schema: 'Confidential Information Memorandum',
    issue: 'low-coverage',
    detail: '47% of fields populated',
    detected: 'Mar 4, 2026 · 17:11',
    uploader: 'Bruce Tucker',
  },
  {
    id: 'i11',
    document: 'Teaser — Tyrell Corp Holdings.pdf',
    schema: 'Teaser',
    issue: 'stuck',
    detail: 'Started 4 hours ago',
    detected: 'Mar 9, 2026 · 12:30',
    uploader: 'Lynne Daniels',
  },
  {
    id: 'i12',
    document: 'NDA — Bluth Company.docx',
    schema: 'NDA',
    issue: 'schema-mismatch',
    detail: 'Detected as Offering Memorandum',
    detected: 'Mar 4, 2026 · 14:08',
    uploader: 'Ming Zao',
  },
  {
    id: 'i13',
    document: 'CIM — Sterling Cooper Mergers.pdf',
    schema: 'Confidential Information Memorandum',
    issue: 'failed',
    detail: 'File corrupted on upload',
    detected: 'Mar 3, 2026 · 11:55',
    uploader: 'Darnell Jones',
  },
  {
    id: 'i14',
    document: 'Memo — Soylent Industries.pdf',
    schema: 'Offering Memorandum',
    issue: 'low-coverage',
    detail: '51% of fields populated',
    detected: 'Mar 3, 2026 · 09:22',
    uploader: 'Bruce Tucker',
  },
];

export function AdminIssuesList() {
  const [layout, setLayout] = useState<'grid' | 'table'>('table');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleIssue = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === ALL_ISSUES.length ? new Set() : new Set(ALL_ISSUES.map((i) => i.id)),
    );
  };

  const clearSelection = () => setSelected(new Set());

  return (
    <div className="flex w-full max-w-[1280px] flex-col gap-5">
      <Link
        href="/admin/firm-knowledge?tab=schemas"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Document schemas
      </Link>

      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl leading-tight font-semibold text-foreground">
          Documents with issues
        </h1>
        <p className="font-serif text-sm leading-5 text-muted-foreground">
          Documents that need admin attention — extraction failures, low coverage, and schema mismatches
        </p>
      </header>

      <StackedToolbar
        countLabel={`${ALL_ISSUES.length} issues`}
        searchAriaLabel="Search issues"
        layout={layout}
        onLayoutChange={setLayout}
      />
      {selected.size > 0 ? (
        <IssueSelectionBar count={selected.size} onClear={clearSelection} />
      ) : null}
      <IssuesTable selected={selected} onToggle={toggleIssue} onToggleAll={toggleAll} />
    </div>
  );
}

function IssueSelectionBar({
  count,
  onClear,
}: {
  count: number;
  onClear: () => void;
}) {
  return (
    <div
      role="region"
      aria-label="Bulk actions"
      className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/[0.06] px-4 py-2.5"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {count} {count === 1 ? 'issue' : 'issues'} selected
        </span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" />
          Clear
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" data-icon="inline-start">
          <RotateCw />
          Retry
        </Button>
        <Button variant="outline" size="sm" data-icon="inline-start">
          <CheckCircle2 />
          Mark resolved
        </Button>
        <Button variant="outline" size="sm" data-icon="inline-start">
          <Download />
          Export
        </Button>
        <Button variant="destructive" size="sm" data-icon="inline-start">
          <Trash2 />
          Dismiss
        </Button>
      </div>
    </div>
  );
}

function IssuesTable({
  selected,
  onToggle,
  onToggleAll,
}: {
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  const allSelected = selected.size === ALL_ISSUES.length;
  const someSelected = selected.size > 0 && !allSelected;
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
      <table className="w-full min-w-[1140px] table-fixed text-left text-sm">
        <colgroup>
          <col style={{ width: '44px' }} />
          <col />
          <col style={{ width: '200px' }} />
          <col style={{ width: '170px' }} />
          <col style={{ width: '240px' }} />
          <col style={{ width: '150px' }} />
          <col style={{ width: '130px' }} />
          <col style={{ width: '88px' }} />
        </colgroup>
        <thead>
          <tr className="h-11 border-b border-border bg-background/40">
            <th className="px-3">
              <RowCheckbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={onToggleAll}
                aria-label="Select all issues"
              />
            </th>
            <IssueSortableHeader>Document</IssueSortableHeader>
            <IssueSortableHeader>Schema</IssueSortableHeader>
            <IssueSortableHeader>Issue</IssueSortableHeader>
            <IssueSortableHeader>Detail</IssueSortableHeader>
            <IssueSortableHeader>Detected</IssueSortableHeader>
            <IssueSortableHeader>Uploader</IssueSortableHeader>
            <IssueSortableHeader>Actions</IssueSortableHeader>
          </tr>
        </thead>
        <tbody>
          {ALL_ISSUES.map((issue) => (
            <tr
              key={issue.id}
              data-selected={selected.has(issue.id) || undefined}
              className="h-[52px] border-b border-border transition-colors last:border-b-0 hover:bg-accent data-[selected=true]:bg-primary/[0.04]"
            >
              <td className="px-3 align-middle">
                <RowCheckbox
                  checked={selected.has(issue.id)}
                  onChange={() => onToggle(issue.id)}
                  aria-label={`Select ${issue.document}`}
                />
              </td>
              <td className="px-3 align-middle">
                <a
                  href="#"
                  className="block truncate text-sm font-medium text-primary hover:underline"
                  title={issue.document}
                >
                  {issue.document}
                </a>
              </td>
              <td className="px-3 align-middle">
                <div className="truncate text-sm text-foreground" title={issue.schema}>
                  {issue.schema}
                </div>
              </td>
              <td className="px-3 align-middle">
                <IssueBadge kind={issue.issue} />
              </td>
              <td className="px-3 align-middle">
                <div className="truncate text-sm text-muted-foreground" title={issue.detail}>
                  {issue.detail}
                </div>
              </td>
              <td className="px-3 align-middle">
                <div className="truncate text-sm whitespace-nowrap text-muted-foreground">
                  {issue.detected}
                </div>
              </td>
              <td className="px-3 align-middle">
                <div className="truncate text-sm text-foreground" title={issue.uploader}>
                  {issue.uploader}
                </div>
              </td>
              <td className="px-3 align-middle">
                <Button variant="outline" size="xs">
                  Review
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IssueSortableHeader({ children }: { children: ReactNode }) {
  return (
    <th className="px-3 align-middle">
      <button
        type="button"
        className="flex w-full items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-foreground/80"
      >
        <span className="min-w-0 flex-1 truncate text-left">{children}</span>
        <Filter className="size-3 shrink-0 text-muted-foreground" />
        <ArrowUp className="size-3.5 shrink-0 text-muted-foreground" />
      </button>
    </th>
  );
}

const ISSUE_CONFIG: Record<
  IssueKind,
  { label: string; tone: 'destructive' | 'warning' }
> = {
  stuck: { label: 'Stuck in extraction', tone: 'destructive' },
  failed: { label: 'Extraction failed', tone: 'destructive' },
  'no-data': { label: 'No data extracted', tone: 'warning' },
  'low-coverage': { label: 'Low coverage', tone: 'warning' },
  'schema-mismatch': { label: 'Schema mismatch', tone: 'warning' },
};

function IssueBadge({ kind }: { kind: IssueKind }) {
  const config = ISSUE_CONFIG[kind];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        config.tone === 'destructive'
          ? 'bg-destructive/10 text-destructive'
          : 'bg-[#fef3c7] text-[#92400e]',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          config.tone === 'destructive' ? 'bg-destructive' : 'bg-[#b45309]',
        )}
      />
      {config.label}
    </span>
  );
}
