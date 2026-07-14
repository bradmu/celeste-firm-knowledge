'use client';

import {
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  MoreVertical,
  RefreshCw,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RowCheckbox } from '@/components/celeste/row-checkbox';
import { StackedToolbar } from '@/components/celeste/stacked-toolbar';

export type DocStatus =
  | { kind: 'active' }
  | { kind: 'in-review' }
  | { kind: 'processing'; progress: number }
  | { kind: 'failed' };

export type Document = {
  id: string;
  title: string;
  docType: string;
  date: string;
  uploader: string;
  status: DocStatus;
};

export const DOCUMENTS: Document[] = [
  {
    id: 'a1',
    title: 'Q3 CIM — Acme Corp Holdings.pdf',
    docType: 'Confidential information memorandum',
    date: 'Mar 14, 2026',
    uploader: 'Bruce Tucker',
    status: { kind: 'processing', progress: 15 },
  },
  {
    id: 'a2',
    title: 'NDA — Globex Holdings.docx',
    docType: 'Non disclosure agreement',
    date: 'Mar 14, 2026',
    uploader: 'Lynne Daniels',
    status: { kind: 'failed' },
  },
  {
    id: 'a3',
    title: 'Teaser — Initech Capital.pdf',
    docType: 'Teaser',
    date: 'Mar 13, 2026',
    uploader: 'Darnell Jones',
    status: { kind: 'failed' },
  },
  {
    id: 'a4',
    title: 'Memo — Hooli Capital.docx',
    docType: 'Offering memorandum',
    date: 'Mar 12, 2026',
    uploader: 'Ming Zao',
    status: { kind: 'in-review' },
  },
  {
    id: '1',
    title: 'Meridian Capital Partners IV — Private Placement Memorandum',
    docType: 'Offering memorandum',
    date: 'Mar 9, 2025',
    uploader: 'Bruce Tucker',
    status: { kind: 'processing', progress: 70 },
  },
  {
    id: '2',
    title: 'Stonebridge Growth Equity Fund I — Offering Memorandum',
    docType: 'Offering memorandum',
    date: 'Jul 27, 2026',
    uploader: 'Lynne Daniels',
    status: { kind: 'active' },
  },
  {
    id: '3',
    title: 'Harwick Infrastructure Opportunities Fund — Letter of Intent',
    docType: 'Letter of intent',
    date: 'Feb 25, 2026',
    uploader: 'Darnell Jones',
    status: { kind: 'active' },
  },
  {
    id: '4',
    title: 'Clearwater Structured Credit Fund II — Private Placement Memorandum',
    docType: 'Confidential information memorandum',
    date: 'Dec 1, 2025',
    uploader: 'Ming Zao',
    status: { kind: 'active' },
  },
  {
    id: '5',
    title: 'Ashford Mid-Market Buyout Fund VI — Confidentiality Agreement',
    docType: 'Non disclosure agreement',
    date: 'May 14, 2026',
    uploader: 'Ming Zao',
    status: { kind: 'in-review' },
  },
  {
    id: '6',
    title: 'Bristol Growth Capital Fund II — Investor Presentation',
    docType: 'Letter of intent',
    date: 'Apr 11, 2026',
    uploader: 'Ming Zao',
    status: { kind: 'active' },
  },
  {
    id: '7',
    title: 'Cypress Venture Partners Fund III — PPM',
    docType: 'Non disclosure agreement',
    date: 'Aug 8, 2025',
    uploader: 'Ming Zao',
    status: { kind: 'active' },
  },
  {
    id: '8',
    title: 'Davenport Equity Partners Fund IV — Offering Memorandum',
    docType: 'Facilities agreement',
    date: 'Jul 27, 2025',
    uploader: 'Darnell Jones',
    status: { kind: 'active' },
  },
  {
    id: '9',
    title: 'Evergreen Technology Fund V — Private Placement Memorandum',
    docType: 'Facilities agreement',
    date: 'Jul 27, 2025',
    uploader: 'Darnell Jones',
    status: { kind: 'active' },
  },
  {
    id: '10',
    title: 'Falcon Private Equity Fund VII — PPM',
    docType: 'Facilities agreement',
    date: 'Jul 27, 2025',
    uploader: 'Lynne Daniels',
    status: { kind: 'active' },
  },
  {
    id: '11',
    title: 'Greenwood Real Estate Fund I — OM',
    docType: 'Non disclosure agreement',
    date: 'Jul 27, 2025',
    uploader: 'Darnell Jones',
    status: { kind: 'active' },
  },
  {
    id: '12',
    title: 'Horizon Venture Capital Fund VIII — Memorandum',
    docType: 'Intercreditor agreement',
    date: 'Feb 27, 2026',
    uploader: 'Ming Zao',
    status: { kind: 'active' },
  },
  {
    id: '13',
    title: 'Ironclad Buyout Fund IX — Offering Memorandum',
    docType: 'Intercreditor agreement',
    date: 'Oct 7, 2025',
    uploader: 'Ming Zao',
    status: { kind: 'active' },
  },
  {
    id: '14',
    title: 'Jade Asset Management Fund II — OM',
    docType: 'Non disclosure agreement',
    date: 'Nov 17, 2025',
    uploader: 'Ming Zao',
    status: { kind: 'active' },
  },
  {
    id: '15',
    title: 'Knightbridge Growth Capital Fund III — PPM',
    docType: 'Confidential information memorandum',
    date: 'Jan 13, 2026',
    uploader: 'Ming Zao',
    status: { kind: 'active' },
  },
  {
    id: '16',
    title: 'Lakeshore Special Situations Fund — Teaser',
    docType: 'Teaser',
    date: 'Mar 2, 2026',
    uploader: 'Bruce Tucker',
    status: { kind: 'processing', progress: 35 },
  },
  {
    id: '17',
    title: 'Monarch Buyout Partners Fund X — PPM',
    docType: 'Offering memorandum',
    date: 'Sep 18, 2025',
    uploader: 'Lynne Daniels',
    status: { kind: 'failed' },
  },
  {
    id: '18',
    title: 'Northwind Energy Fund III — Investor Update',
    docType: 'Management presentation',
    date: 'Feb 8, 2026',
    uploader: 'Bruce Tucker',
    status: { kind: 'active' },
  },
];

const TOTAL_DOCUMENTS = 1191;

export function AdminDocumentsList() {
  const [layout, setLayout] = useState<'grid' | 'table'>('table');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllDocs = () => {
    setSelectedDocs((prev) =>
      prev.size === DOCUMENTS.length ? new Set() : new Set(DOCUMENTS.map((d) => d.id)),
    );
  };

  const clearDocSelection = () => setSelectedDocs(new Set());

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
          Documents indexed
        </h1>
        <p className="font-serif text-sm leading-5 text-muted-foreground">
          Every document your firm has uploaded for extraction across all schemas
        </p>
      </header>

      <StackedToolbar
        countLabel={`${TOTAL_DOCUMENTS.toLocaleString()} documents`}
        primaryLabel="Add document"
        searchAriaLabel="Search documents"
        layout={layout}
        onLayoutChange={setLayout}
      />
      {selectedDocs.size > 0 ? (
        <DocumentSelectionBar count={selectedDocs.size} onClear={clearDocSelection} />
      ) : null}
      <DocumentsTable
        selected={selectedDocs}
        onToggle={toggleDoc}
        onToggleAll={toggleAllDocs}
      />
    </div>
  );
}

function DocumentSelectionBar({
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
          {count} {count === 1 ? 'document' : 'documents'} selected
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
          <RefreshCw />
          Reprocess
        </Button>
        <Button variant="outline" size="sm" data-icon="inline-start">
          <Tag />
          Reassign schema
        </Button>
        <Button variant="outline" size="sm" data-icon="inline-start">
          <Download />
          Export
        </Button>
        <Button variant="destructive" size="sm" data-icon="inline-start">
          <Trash2 />
          Delete
        </Button>
      </div>
    </div>
  );
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export function DocumentsTable({
  selected,
  onToggle,
  onToggleAll,
}: {
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const total = DOCUMENTS.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const visible = DOCUMENTS.slice(start, start + pageSize);
  const allSelected = selected.size === DOCUMENTS.length;
  const someSelected = selected.size > 0 && !allSelected;
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[1120px] table-fixed text-left text-sm">
        <colgroup>
          <col style={{ width: '44px' }} />
          <col />
          <col style={{ width: '220px' }} />
          <col style={{ width: '130px' }} />
          <col style={{ width: '160px' }} />
          <col style={{ width: '160px' }} />
          <col style={{ width: '44px' }} />
        </colgroup>
        <thead>
          <tr className="h-11 border-b border-border bg-background/40">
            <th className="px-3">
              <RowCheckbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={onToggleAll}
                aria-label="Select all documents"
              />
            </th>
            <DocSortableHeader>Title</DocSortableHeader>
            <DocSortableHeader>Doc type</DocSortableHeader>
            <DocSortableHeader>Date uploaded</DocSortableHeader>
            <DocSortableHeader>Uploader</DocSortableHeader>
            <DocSortableHeader>Status</DocSortableHeader>
            <th aria-label="Row actions" />
          </tr>
        </thead>
        <tbody>
          {visible.map((doc) => (
            <tr
              key={doc.id}
              data-selected={selected.has(doc.id) || undefined}
              className="group h-[52px] border-b border-border transition-colors last:border-b-0 hover:bg-accent data-[selected=true]:bg-primary/[0.04]"
            >
              <td className="px-3 align-middle">
                <RowCheckbox
                  checked={selected.has(doc.id)}
                  onChange={() => onToggle(doc.id)}
                  aria-label={`Select ${doc.title}`}
                />
              </td>
              <td className="px-3 align-middle">
                <a
                  href="#"
                  className="block truncate text-sm font-medium text-primary hover:underline"
                  title={doc.title}
                >
                  {doc.title}
                </a>
              </td>
              <td className="px-3 align-middle">
                <div className="truncate text-sm text-foreground" title={doc.docType}>
                  {doc.docType}
                </div>
              </td>
              <td className="px-3 align-middle">
                <div className="truncate text-sm text-foreground tabular-nums">{doc.date}</div>
              </td>
              <td className="px-3 align-middle">
                <div className="truncate text-sm text-foreground" title={doc.uploader}>
                  {doc.uploader}
                </div>
              </td>
              <td className="px-3 align-middle">
                <DocStatusCell status={doc.status} />
              </td>
              <td className="px-2 align-middle">
                <button
                  type="button"
                  aria-label={`More actions for ${doc.title}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <MoreVertical className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <TablePagination
        total={total}
        page={safePage}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}

function TablePagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const atFirst = page <= 1;
  const atLast = page >= totalPages;
  return (
    <div className="flex items-center justify-between border-t border-border bg-background/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Rows per page</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" data-icon="inline-end" className="min-w-[64px]">
              {pageSize}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt} onClick={() => onPageSizeChange(opt)}>
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground tabular-nums">
          {start.toLocaleString()}–{end.toLocaleString()} of {total.toLocaleString()}
        </span>
        <div className="flex items-center gap-1">
          <PaginationButton
            aria-label="First page"
            disabled={atFirst}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft className="size-4" />
          </PaginationButton>
          <PaginationButton
            aria-label="Previous page"
            disabled={atFirst}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </PaginationButton>
          <span className="px-2 text-xs text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </span>
          <PaginationButton
            aria-label="Next page"
            disabled={atLast}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </PaginationButton>
          <PaginationButton
            aria-label="Last page"
            disabled={atLast}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight className="size-4" />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}

function PaginationButton({
  children,
  disabled,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-transparent disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
      {...rest}
    >
      {children}
    </button>
  );
}

function DocSortableHeader({ children }: { children: React.ReactNode }) {
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

function DocStatusCell({ status }: { status: DocStatus }) {
  if (status.kind === 'processing') {
    return (
      <div className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="text-sm text-foreground">Processing</span>
        <ProgressRing value={status.progress} />
      </div>
    );
  }
  if (status.kind === 'in-review') {
    return <span className="text-sm whitespace-nowrap text-foreground">In review</span>;
  }
  if (status.kind === 'failed') {
    return <span className="text-sm whitespace-nowrap text-destructive">Failed</span>;
  }
  return <span className="text-sm whitespace-nowrap text-foreground">Active</span>;
}

function ProgressRing({ value, size = 28 }: { value: number; size?: number }) {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size }}
      aria-label={`${value}% complete`}
    >
      <circle cx="12" cy="12" r={radius} stroke="#e6e1dc" strokeWidth="2.5" fill="none" />
      <circle
        cx="12"
        cy="12"
        r={radius}
        stroke="#20727e"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 12 12)"
      />
      <text
        x="12"
        y="13"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="6.5"
        className={cn('font-semibold')}
        fill="#292221"
      >
        {value}%
      </text>
    </svg>
  );
}
