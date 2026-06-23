'use client';

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  Download,
  Filter,
  FileX,
  Info,
  LayoutGrid,
  Minus,
  MoreVertical,
  PlugZap,
  Plus,
  Power,
  PowerOff,
  Search,
  ShieldAlert,
  Table as TableIcon,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RowCheckbox } from '@/components/celeste/row-checkbox';
import { StackedToolbar } from '@/components/celeste/stacked-toolbar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type KnowledgeHub = {
  title: string;
  documents: number;
  description: string;
  created: string;
  lastUsed: string;
};

const HUBS: KnowledgeHub[] = [
  {
    title: 'Best in Class CIMs',
    documents: 12,
    description: 'Confidential information memoranda used as quality benchmarks for sell-side work.',
    created: 'Feb 12, 2026',
    lastUsed: 'Mar 4, 2026',
  },
  {
    title: 'Best in Class IOIs',
    documents: 8,
    description: 'Indication-of-interest letters with strong structure and concise rationale.',
    created: 'Feb 12, 2026',
    lastUsed: 'Mar 4, 2026',
  },
  {
    title: 'Industry research',
    documents: 47,
    description: 'Third-party reports and internal sector primers organized by vertical.',
    created: 'Jan 8, 2026',
    lastUsed: 'Mar 1, 2026',
  },
  {
    title: 'Deal precedents',
    documents: 23,
    description: 'Closed-deal references with terms, multiples, and post-close notes.',
    created: 'Dec 14, 2025',
    lastUsed: 'Feb 27, 2026',
  },
  {
    title: 'Sustainability briefs',
    documents: 15,
    description: 'ESG diligence summaries used during target evaluation.',
    created: 'Jan 22, 2026',
    lastUsed: 'Feb 18, 2026',
  },
  {
    title: 'Sector strategy',
    documents: 9,
    description: 'Internal strategy decks and POVs aligned to active investment theses.',
    created: 'Feb 2, 2026',
    lastUsed: 'Mar 4, 2026',
  },
];

type DocumentSchema = {
  name: string;
  version: string;
  scope: string;
  active: boolean;
  documents: number;
  coverage: number;
  issues: number;
  description: string;
};

const SCHEMAS: DocumentSchema[] = [
  {
    name: 'Offering Memorandum',
    version: 'V3',
    scope: 'Global',
    active: true,
    documents: 84,
    coverage: 84,
    issues: 2,
    description:
      'Detailed document used to market an investment opportunity to potential investors or buyers.',
  },
  {
    name: 'Confidential Information Memorandum',
    version: 'V4',
    scope: 'Global',
    active: true,
    documents: 76,
    coverage: 92,
    issues: 0,
    description:
      'Comprehensive confidential document providing detailed business, financial, operational, and market information about a deal opportunity.',
  },
  {
    name: 'NDA',
    version: 'V2',
    scope: 'Secondary deals',
    active: true,
    documents: 134,
    coverage: 76,
    issues: 4,
    description:
      'Legal agreement that governs the sharing and protection of confidential information between parties.',
  },
  {
    name: 'Teaser',
    version: 'V2',
    scope: 'Tag',
    active: true,
    documents: 265,
    coverage: 88,
    issues: 1,
    description:
      'Short, usually anonymous summary of an investment opportunity used to generate initial interest.',
  },
  {
    name: 'Management Presentation',
    version: 'V1',
    scope: 'Healthcare Group',
    active: false,
    documents: 23,
    coverage: 61,
    issues: 7,
    description:
      'Presentation delivered by company leadership to potential investors or buyers to explain the business, strategy, performance, and growth outlook.',
  },
];

type ModuleTab = 'issues' | 'coverage' | 'usage';
type HubModuleTab = 'hub-issues' | 'hub-citation' | 'hub-usage';

type Kpi = {
  id: string;
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down'; text: string };
  sublabel?: string;
  icon: typeof TrendingUp;
  tone?: 'default' | 'warning' | 'destructive';
  href?: string;
  viewAllHref?: string;
};

const KPIS: Kpi[] = [
  {
    id: 'issues',
    label: 'Documents with issues',
    value: '14',
    sublabel: 'Across 4 schemas',
    icon: AlertTriangle,
    tone: 'warning',
    viewAllHref: '/admin/issues',
  },
  {
    id: 'coverage',
    label: 'Average coverage',
    value: '78%',
    sublabel: '5,318 of 6,817 fields populated',
    icon: TrendingUp,
  },
  {
    id: 'usage',
    label: 'Usage',
    value: '4,367',
    sublabel: 'Docs processed · last 30 days',
    icon: Activity,
  },
  {
    id: 'indexed',
    label: 'Documents indexed',
    value: '1,191',
    trend: { direction: 'up', text: '+12% last 30 days' },
    icon: Database,
    href: '/admin/documents',
  },
];

type UsageMetric = {
  label: string;
  value: string;
  delta: string;
  deltaTone?: 'default' | 'destructive';
  info?: boolean;
  data: number[];
};

const USAGE_METRICS: UsageMetric[] = [
  {
    label: 'Documents processed',
    value: '4,367',
    delta: '+5%',
    data: [22, 30, 28, 65, 80, 55, 48],
  },
  {
    label: 'Active users',
    value: '24',
    delta: '+3',
    data: [40, 60, 35, 55, 30, 50, 40],
  },
  {
    label: 'Straight through rate',
    value: '1,204',
    delta: '+3',
    info: true,
    data: [50, 55, 50, 70, 55, 60, 50],
  },
  {
    label: 'Processing failures',
    value: '42',
    delta: '-7',
    data: [30, 50, 35, 60, 40, 55, 45],
  },
  {
    label: 'Avg processing time',
    value: '3.2 min',
    delta: '+1.6 min',
    data: [40, 35, 45, 30, 50, 45, 55],
  },
  {
    label: 'Searches performed',
    value: '3',
    delta: '+2',
    data: [25, 40, 30, 50, 35, 50, 45],
  },
];

type CoverageRow = {
  name: string;
  coverage: number;
  documents: number;
};

const COVERAGE_DATA: CoverageRow[] = [
  { name: 'Offering Memorandum', coverage: 89, documents: 84 },
  { name: 'Confidential Information Memorandum', coverage: 76, documents: 76 },
  { name: 'NDA', coverage: 91, documents: 134 },
  { name: 'Teaser', coverage: 68, documents: 265 },
  { name: 'Management Presentation', coverage: 52, documents: 23 },
];

const COVERAGE_OVERALL = 77;

function coverageTone(value: number): 'strong' | 'moderate' | 'low' {
  if (value >= 80) return 'strong';
  if (value >= 65) return 'moderate';
  return 'low';
}

function coverageBarClass(tone: 'strong' | 'moderate' | 'low') {
  if (tone === 'strong') return 'bg-primary';
  if (tone === 'moderate') return 'bg-[#f59e0b]';
  return 'bg-[#d4183d]';
}

const HUB_KPIS: Kpi[] = [
  {
    id: 'hub-issues',
    label: 'Hubs needing attention',
    value: '4',
    sublabel: 'Across 4 hubs',
    icon: AlertTriangle,
    tone: 'warning',
  },
  {
    id: 'hub-citation',
    label: 'Citation rate',
    value: '61%',
    sublabel: '1,411 of 2,320 retrievals cited',
    icon: TrendingUp,
  },
  {
    id: 'hub-usage',
    label: 'Usage',
    value: '2,847',
    sublabel: 'Queries · last 30 days',
    icon: Activity,
  },
];

type HubAttentionItem = {
  hub: string;
  issue: string;
  detail: string;
  tone: 'warning' | 'destructive';
  icon: typeof AlertTriangle;
};

const HUB_ATTENTION: HubAttentionItem[] = [
  {
    hub: 'Sustainability briefs',
    issue: 'Broken connector',
    detail: 'DealCloud sync failed 4 days ago — 6 documents stale',
    tone: 'destructive',
    icon: PlugZap,
  },
  {
    hub: 'Deal precedents',
    issue: 'Overshared',
    detail: 'Shared org-wide but contains 3 MNPI-flagged documents',
    tone: 'destructive',
    icon: ShieldAlert,
  },
  {
    hub: 'Industry research',
    issue: 'Indexing failures',
    detail: '12 of 47 documents failed to index',
    tone: 'warning',
    icon: AlertTriangle,
  },
  {
    hub: 'Sector strategy',
    issue: 'No usage',
    detail: 'Created 67 days ago — zero queries to date',
    tone: 'warning',
    icon: Clock,
  },
];

type HubCitationRow = {
  hub: string;
  short: string;
  citationRate: number;
  retrievals: number;
};

const HUB_CITATION_DATA: HubCitationRow[] = [
  { hub: 'Best in Class IOIs', short: 'IOIs', citationRate: 82, retrievals: 410 },
  { hub: 'Best in Class CIMs', short: 'CIMs', citationRate: 68, retrievals: 720 },
  { hub: 'Deal precedents', short: 'Precedents', citationRate: 74, retrievals: 480 },
  { hub: 'Industry research', short: 'Industry', citationRate: 28, retrievals: 590 },
  { hub: 'Sustainability briefs', short: 'Sustainability', citationRate: 71, retrievals: 80 },
  { hub: 'Sector strategy', short: 'Sector', citationRate: 22, retrievals: 40 },
];

const HUB_CITATION_OVERALL = 61;
const HUB_CITATION_TOTAL_CITED = 1_411;
const HUB_CITATION_TOTAL_RETRIEVALS = 2_320;

const HUB_USAGE_METRICS: UsageMetric[] = [
  {
    label: 'Queries to hubs',
    value: '2,847',
    delta: '+18%',
    data: [30, 45, 38, 60, 52, 75, 68],
  },
  {
    label: 'Active users',
    value: '38',
    delta: '+5',
    data: [25, 30, 28, 40, 35, 45, 38],
  },
  {
    label: 'Hubs queried',
    value: '6 of 6',
    delta: '+1',
    data: [40, 45, 45, 50, 55, 55, 60],
  },
  {
    label: 'Citations from hubs',
    value: '1,094',
    delta: '+12%',
    data: [20, 30, 28, 42, 38, 55, 50],
  },
  {
    label: 'Auto-attached context rate',
    value: '64%',
    delta: '+8%',
    info: true,
    data: [35, 40, 45, 42, 50, 55, 60],
  },
  {
    label: 'Avg docs cited per query',
    value: '3.4',
    delta: '+0.4',
    data: [25, 28, 30, 32, 30, 36, 34],
  },
];

type AttentionItem = {
  document: string;
  schema: string;
  issue: string;
  detail: string;
  tone: 'warning' | 'destructive';
  icon: typeof AlertTriangle;
};

const ATTENTION: AttentionItem[] = [
  {
    document: 'Q3 CIM — Acme Corp Holdings.pdf',
    schema: 'Confidential Information Memorandum',
    issue: 'Stuck in extraction',
    detail: 'Started 26 hours ago',
    tone: 'destructive',
    icon: Clock,
  },
  {
    document: 'NDA — Globex Holdings.docx',
    schema: 'NDA',
    issue: 'No data extracted',
    detail: 'All schema fields returned empty',
    tone: 'warning',
    icon: FileX,
  },
  {
    document: 'Teaser — Initech Capital.pdf',
    schema: 'Teaser',
    issue: 'Extraction failed',
    detail: 'Malformed PDF — OCR rejected',
    tone: 'destructive',
    icon: AlertCircle,
  },
  {
    document: 'Memo — Hooli Capital.docx',
    schema: 'Offering Memorandum',
    issue: 'Low coverage',
    detail: '38% of fields populated',
    tone: 'warning',
    icon: AlertTriangle,
  },
];

export function AdminKnowledgeHubs() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') === 'schemas' ? 'schemas' : 'hubs';
  const [tab, setTab] = useState<'hubs' | 'schemas'>(initialTab);
  const [layout, setLayout] = useState<'grid' | 'table'>('grid');
  const [moduleTab, setModuleTab] = useState<ModuleTab>('issues');
  const [overviewCollapsed, setOverviewCollapsed] = useState(false);
  const [hubModuleTab, setHubModuleTab] = useState<HubModuleTab>('hub-issues');
  const [hubOverviewCollapsed, setHubOverviewCollapsed] = useState(false);
  const [selectedSchemas, setSelectedSchemas] = useState<Set<string>>(new Set());

  const toggleSchema = (name: string) => {
    setSelectedSchemas((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleAllSchemas = () => {
    setSelectedSchemas((prev) =>
      prev.size === SCHEMAS.length ? new Set() : new Set(SCHEMAS.map((s) => s.name)),
    );
  };

  const clearSchemaSelection = () => setSelectedSchemas(new Set());

  return (
    <div className="flex w-full max-w-[1140px] flex-col">
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'hubs' | 'schemas')}>
        <div className="flex justify-center pb-5">
          <TabsList className="h-8 bg-accent p-[3px]">
            <TabsTrigger value="hubs" className="px-4">
              Knowledge hubs
            </TabsTrigger>
            <TabsTrigger value="schemas" className="px-4">
              Document schemas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="hubs" className="flex flex-col gap-5">
          <div className="flex items-end justify-between gap-4">
            <PageHeader
              title="Knowledge hubs"
              subtitle="Curate document collections that ground chat responses — and keep an eye on where curation is breaking down"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHubOverviewCollapsed((c) => !c)}
              aria-expanded={!hubOverviewCollapsed}
              aria-controls="hubs-overview"
              data-icon="inline-end"
              className="shrink-0"
            >
              {hubOverviewCollapsed ? 'Show overview' : 'Hide overview'}
              {hubOverviewCollapsed ? <ChevronDown /> : <ChevronUp />}
            </Button>
          </div>
          {!hubOverviewCollapsed ? (
            <div id="hubs-overview" className="mb-3 flex flex-col gap-0">
              <KpiTiles
                tiles={HUB_KPIS}
                value={hubModuleTab}
                onChange={(v) => setHubModuleTab(v as HubModuleTab)}
              />
              <div className="pt-5">
                {hubModuleTab === 'hub-issues' && <HubAttention />}
                {hubModuleTab === 'hub-citation' && <HubCitation />}
                {hubModuleTab === 'hub-usage' && <HubUsage />}
              </div>
            </div>
          ) : null}
          <Toolbar
            layout={layout}
            onLayoutChange={setLayout}
            primaryActionLabel="Add new"
            searchAriaLabel="Search knowledge hubs"
          />
          <section aria-label="Knowledge hubs" className="grid grid-cols-2 gap-4">
            {HUBS.map((hub) => (
              <KnowledgeHubCard key={hub.title} hub={hub} />
            ))}
          </section>
        </TabsContent>

        <TabsContent value="schemas" className="flex flex-col gap-5">
          <div className="flex items-end justify-between gap-4">
            <PageHeader
              title="Document schemas"
              subtitle="Track how your firm is using ontologies for document types and where extraction is breaking down"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOverviewCollapsed((c) => !c)}
              aria-expanded={!overviewCollapsed}
              aria-controls="schemas-overview"
              data-icon="inline-end"
              className="shrink-0"
            >
              {overviewCollapsed ? 'Show overview' : 'Hide overview'}
              {overviewCollapsed ? <ChevronDown /> : <ChevronUp />}
            </Button>
          </div>
          {!overviewCollapsed ? (
            <div id="schemas-overview" className="flex flex-col gap-0 mb-3">
              <KpiTiles
              tiles={KPIS}
              value={moduleTab}
              onChange={(v) => setModuleTab(v as ModuleTab)}
            />
              <div className="pt-5">
                {moduleTab === 'issues' && <NeedsAttention />}
                {moduleTab === 'coverage' && <SchemaCoverage />}
                {moduleTab === 'usage' && <UsageMetrics />}
              </div>
            </div>
          ) : null}
          <StackedToolbar
            countLabel={`${SCHEMAS.length} schemas`}
            primaryLabel="New schema"
            searchAriaLabel="Search document schemas"
            layout={layout}
            onLayoutChange={setLayout}
          />
          {selectedSchemas.size > 0 ? (
            <SchemaSelectionBar
              count={selectedSchemas.size}
              onClear={clearSchemaSelection}
            />
          ) : null}
          <SchemasTable
            selected={selectedSchemas}
            onToggle={toggleSchema}
            onToggleAll={toggleAllSchemas}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-serif text-2xl font-semibold leading-tight text-foreground">{title}</h1>
      <p className="font-serif text-sm leading-5 text-muted-foreground">{subtitle}</p>
    </header>
  );
}

function Toolbar({
  layout,
  onLayoutChange,
  primaryActionLabel,
  searchAriaLabel,
}: {
  layout: 'grid' | 'table';
  onLayoutChange: (l: 'grid' | 'table') => void;
  primaryActionLabel: string;
  searchAriaLabel: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" data-icon="inline-end">
            Recently added
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Recently added</DropdownMenuItem>
          <DropdownMenuItem>Recently used</DropdownMenuItem>
          <DropdownMenuItem>Alphabetical</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative max-w-[398px] flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="h-7 pl-8 text-sm"
          aria-label={searchAriaLabel}
        />
      </div>

      <div className="flex h-7 items-center rounded-md border border-border bg-background p-0.5">
        <button
          type="button"
          data-active={layout === 'grid' || undefined}
          onClick={() => onLayoutChange('grid')}
          aria-label="Grid view"
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
        >
          <LayoutGrid className="size-3.5" />
        </button>
        <button
          type="button"
          data-active={layout === 'table' || undefined}
          onClick={() => onLayoutChange('table')}
          aria-label="Table view"
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
        >
          <TableIcon className="size-3.5" />
        </button>
      </div>

      <Button size="sm" className="ml-auto" data-icon="inline-start">
        <Plus />
        {primaryActionLabel}
      </Button>
    </div>
  );
}

function KnowledgeHubCard({ hub }: { hub: KnowledgeHub }) {
  return (
    <article className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-xs transition-colors hover:bg-accent">
      <div className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-[#e8f1f2]">
        <Database className="size-3.5 text-primary" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base leading-6 font-semibold text-foreground">{hub.title}</h3>
          <button
            type="button"
            aria-label={`More actions for ${hub.title}`}
            className="-mt-1 -mr-1 flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {hub.documents} {hub.documents === 1 ? 'document' : 'documents'}
        </p>
        <p className="font-serif text-sm leading-5 text-foreground">{hub.description}</p>
        <p className="pt-1 text-xs text-muted-foreground">
          Created {hub.created} · Last used {hub.lastUsed}
        </p>
      </div>
    </article>
  );
}

function SchemasTable({
  selected,
  onToggle,
  onToggleAll,
}: {
  selected: Set<string>;
  onToggle: (name: string) => void;
  onToggleAll: () => void;
}) {
  const allSelected = selected.size === SCHEMAS.length;
  const someSelected = selected.size > 0 && !allSelected;
  return (
    <div className="overflow-x-auto rounded-lg bg-card">
      <table className="w-full min-w-[1080px] table-fixed text-left text-sm">
        <colgroup>
          <col style={{ width: '44px' }} />
          <col style={{ width: '200px' }} />
          <col style={{ width: '80px' }} />
          <col style={{ width: '140px' }} />
          <col style={{ width: '74px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '140px' }} />
          <col style={{ width: '88px' }} />
          <col />
          <col style={{ width: '44px' }} />
        </colgroup>
        <thead>
          <tr className="h-11 border-b border-border bg-background/40">
            <th className="px-3 align-middle">
              <RowCheckbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={onToggleAll}
                aria-label="Select all schemas"
              />
            </th>
            <SortableHeader sorted>Document Type</SortableHeader>
            <SortableHeader sorted>Version</SortableHeader>
            <SortableHeader sorted>Scope</SortableHeader>
            <SortableHeader sorted>Active</SortableHeader>
            <SortableHeader sorted>Documents</SortableHeader>
            <SortableHeader sorted>Coverage</SortableHeader>
            <SortableHeader sorted>Issues</SortableHeader>
            <SortableHeader sorted>Description</SortableHeader>
            <th aria-label="Row actions" />
          </tr>
        </thead>
        <tbody>
          {SCHEMAS.map((schema) => (
            <tr
              key={schema.name}
              data-selected={selected.has(schema.name) || undefined}
              className="group h-[52px] border-t border-border transition-colors hover:bg-accent data-[selected=true]:bg-primary/[0.04]"
            >
              <td className="px-3 align-middle">
                <RowCheckbox
                  checked={selected.has(schema.name)}
                  onChange={() => onToggle(schema.name)}
                  aria-label={`Select ${schema.name}`}
                />
              </td>
              <td className="px-3 align-middle">
                <a
                  href="#"
                  className="block truncate text-sm font-medium text-primary hover:underline"
                  title={schema.name}
                >
                  {schema.name}
                </a>
              </td>
              <td className="px-3 align-middle text-sm text-foreground">{schema.version}</td>
              <td className="px-3 align-middle">
                <Badge variant="secondary" className="bg-secondary text-foreground">
                  {schema.scope}
                </Badge>
              </td>
              <td className="px-3 align-middle">
                <Switch
                  checked={schema.active}
                  aria-label={`Active toggle for ${schema.name}`}
                  onCheckedChange={() => {}}
                />
              </td>
              <td className="px-3 align-middle text-sm whitespace-nowrap tabular-nums text-foreground">
                {schema.documents} docs
              </td>
              <td className="px-3 align-middle">
                <CoverageBar value={schema.coverage} />
              </td>
              <td className="px-3 align-middle">
                <IssuesIndicator count={schema.issues} />
              </td>
              <td className="px-3 align-middle">
                <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                  {schema.description}
                </p>
              </td>
              <td className="px-2 align-middle">
                <button
                  type="button"
                  aria-label={`More actions for ${schema.name}`}
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
  );
}

function SchemaSelectionBar({
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
          {count} {count === 1 ? 'schema' : 'schemas'} selected
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
          <Power />
          Activate
        </Button>
        <Button variant="outline" size="sm" data-icon="inline-start">
          <PowerOff />
          Deactivate
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

function KpiTiles({
  tiles,
  value,
  onChange,
}: {
  tiles: Kpi[];
  value: string;
  onChange: (v: string) => void;
}) {
  const colsClass = tiles.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return (
    <div
      role="tablist"
      aria-label="Overview"
      className={cn('grid grid-cols-2 gap-3', colsClass)}
    >
      {tiles.map((kpi) => {
        const isActive = kpi.href ? false : kpi.id === value;
        const isLink = Boolean(kpi.href);
        const toneIcon =
          kpi.tone === 'destructive'
            ? 'text-destructive'
            : kpi.tone === 'warning'
              ? 'text-[#b45309]'
              : 'text-muted-foreground';
        const toneValue =
          kpi.tone === 'destructive'
            ? 'text-destructive'
            : kpi.tone === 'warning'
              ? 'text-[#92400e]'
              : 'text-foreground';

        const baseClasses = cn(
          'group relative flex min-h-[124px] flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        );

        const tabBody = (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={cn('size-4', toneIcon)} />
            </div>
            <span className={cn('font-serif text-2xl leading-none font-semibold', toneValue)}>
              {kpi.value}
            </span>
            <div className="mt-auto pt-1">
              {kpi.trend ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="size-3 text-primary" />
                  {kpi.trend.text}
                </span>
              ) : kpi.sublabel ? (
                <span className="text-xs text-muted-foreground">{kpi.sublabel}</span>
              ) : null}
            </div>

            {isActive ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[7px] left-1/2 z-10 size-3 -translate-x-1/2 rotate-45 border-r border-b border-primary bg-card"
              />
            ) : null}
          </>
        );

        if (isLink) {
          return (
            <Link
              key={kpi.id}
              href={kpi.href!}
              aria-label={`Open ${kpi.label.toLowerCase()} view`}
              className={cn(
                'group relative flex min-h-[124px] flex-col gap-2 rounded-lg border border-dashed border-border bg-accent/40 p-4 text-left transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                'hover:-translate-y-[1px] hover:border-solid hover:border-primary hover:bg-accent/70 hover:shadow-md',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-card text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <span className={cn('font-serif text-2xl leading-none font-semibold', toneValue)}>
                {kpi.value}
              </span>
              <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                {kpi.trend ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowUpRight className="size-3 text-primary" />
                    {kpi.trend.text}
                  </span>
                ) : (
                  <span />
                )}
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary transition-colors group-hover:underline">
                  View all
                  <ArrowUpRight className="size-3" />
                </span>
              </div>
            </Link>
          );
        }

        return (
          <div key={kpi.id} className="relative">
            <button
              type="button"
              role="tab"
              id={`kpi-${kpi.id}`}
              aria-selected={isActive}
              aria-controls={`module-${kpi.id}`}
              onClick={() => onChange(kpi.id)}
              data-state={isActive ? 'active' : 'inactive'}
              className={cn(
                baseClasses,
                'w-full',
                'data-[state=active]:border-primary data-[state=active]:shadow-md',
                'data-[state=inactive]:border-border data-[state=inactive]:shadow-xs data-[state=inactive]:hover:border-primary/40 data-[state=inactive]:hover:shadow-sm',
              )}
            >
              {tabBody}
            </button>
            {kpi.viewAllHref ? (
              <Link
                href={kpi.viewAllHref}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-4 bottom-4 z-10 inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
              >
                View all
                <ArrowUpRight className="size-3" />
              </Link>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function SchemaCoverage() {
  return (
    <section
      id="module-coverage"
      role="tabpanel"
      aria-labelledby="kpi-coverage"
      className="flex min-h-[330px] flex-col rounded-lg border border-border bg-card p-5 shadow-xs"
    >
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Schema Coverage</h3>
        <p className="text-[11px] text-muted-foreground">
          Populated vs. empty schema fields across all documents
        </p>
      </header>

      <div className="flex flex-1 items-stretch gap-8 pt-5">
        <div className="flex shrink-0 flex-col items-center justify-center gap-2">
          <CoverageDonut value={COVERAGE_OVERALL} size={148} />
          <span className="text-xs text-muted-foreground">Overall coverage</span>
        </div>

        <ul className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1">
          {COVERAGE_DATA.map((row) => {
            const tone = coverageTone(row.coverage);
            return (
              <li key={row.name} className="flex items-center gap-4">
                <span className="w-[210px] shrink-0 truncate text-sm text-foreground">
                  {row.name}
                </span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-accent">
                  <div
                    className={cn('absolute inset-y-0 left-0 rounded-full', coverageBarClass(tone))}
                    style={{ width: `${row.coverage}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
                  {row.coverage}%
                </span>
                <span className="w-16 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                  {row.documents} docs
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
        <div className="flex gap-5">
          <CoverageLegendItem swatch="bg-primary" label="≥ 80% strong" />
          <CoverageLegendItem swatch="bg-[#f59e0b]" label="65–79% moderate" />
          <CoverageLegendItem swatch="bg-[#d4183d]" label="< 65% low" />
        </div>
        <span className="text-xs text-muted-foreground">
          5,318 of 6,817 fields populated across 582 documents
        </span>
      </div>
    </section>
  );
}

function CoverageDonut({ value, size = 100 }: { value: number; size?: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e6e1dc"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#20727e"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-serif font-semibold tabular-nums text-foreground"
          style={{ fontSize: Math.round(size * 0.26) }}
        >
          {value}%
        </span>
      </div>
    </div>
  );
}

function HubAttention() {
  return (
    <section
      id="module-hub-issues"
      role="tabpanel"
      aria-labelledby="kpi-hub-issues"
      className="flex min-h-[330px] flex-col overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-[#b45309]" />
          <h2 className="text-sm font-semibold text-foreground">Hubs needing attention</h2>
          <Badge variant="secondary" className="bg-secondary text-foreground">
            {HUB_ATTENTION.length}
          </Badge>
        </div>
      </div>
      <ul className="flex flex-1 flex-col divide-y divide-border">
        {HUB_ATTENTION.map((item) => {
          const toneText =
            item.tone === 'destructive' ? 'text-destructive' : 'text-[#b45309]';
          return (
            <li
              key={item.hub}
              className="group/item flex flex-1 items-center gap-3 px-4 py-4"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                  item.tone === 'destructive' ? 'bg-destructive/10' : 'bg-[#fef3c7]'
                }`}
              >
                <item.icon className={`size-4 ${toneText}`} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-sm font-medium text-foreground">{item.hub}</p>
                <p className="truncate text-xs text-muted-foreground">
                  <span className={toneText}>{item.issue}</span>{' '}
                  <span className="text-foreground/30">·</span> {item.detail}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
              <button
                type="button"
                aria-label={`More actions for ${item.hub}`}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover/item:opacity-100"
              >
                <MoreVertical className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function HubCitation() {
  return (
    <section
      id="module-hub-citation"
      role="tabpanel"
      aria-labelledby="kpi-hub-citation"
      className="flex min-h-[330px] flex-col rounded-lg border border-border bg-card p-5 shadow-xs"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-foreground">Hub citation rate</h3>
          <p className="text-[11px] text-muted-foreground">
            How often a hub&apos;s docs end up cited when it&apos;s surfaced as context
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-serif text-2xl font-semibold leading-none text-foreground tabular-nums">
            {HUB_CITATION_OVERALL}%
          </span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {HUB_CITATION_TOTAL_CITED.toLocaleString()} of{' '}
            {HUB_CITATION_TOTAL_RETRIEVALS.toLocaleString()} retrievals cited
          </span>
        </div>
      </header>

      <div className="flex-1 pt-2">
        <CitationScatterPlot data={HUB_CITATION_DATA} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex gap-5">
          <CoverageLegendItem swatch="bg-primary" label="≥ 70% strong" />
          <CoverageLegendItem swatch="bg-[#f59e0b]" label="40–69% moderate" />
          <CoverageLegendItem swatch="bg-[#d4183d]" label="< 40% low" />
        </div>
        <span className="text-[11px] text-muted-foreground">
          Bubble size = retrievals volume
        </span>
      </div>
    </section>
  );
}

function CitationScatterPlot({ data }: { data: HubCitationRow[] }) {
  const W = 620;
  const H = 200;
  const PAD = { top: 18, right: 28, bottom: 26, left: 38 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const X_MAX = 800;
  const X_THRESHOLD = 400;
  const Y_THRESHOLD = 50;

  const xScale = (x: number) => PAD.left + (x / X_MAX) * innerW;
  const yScale = (y: number) => PAD.top + innerH - (y / 100) * innerH;
  const rScale = (n: number) => Math.sqrt(n / X_MAX) * 14 + 5;

  const fillFor = (rate: number) => {
    if (rate >= 70) return '#20727e';
    if (rate >= 40) return '#f59e0b';
    return '#d4183d';
  };

  const thresholdX = xScale(X_THRESHOLD);
  const thresholdY = yScale(Y_THRESHOLD);
  const axisColor = '#73605b';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Citation rate plotted against retrieval volume per hub"
      className="h-auto w-full"
    >
      {/* subtle quadrant background — top half slightly tinted for "healthy" */}
      <rect
        x={PAD.left}
        y={PAD.top}
        width={innerW}
        height={thresholdY - PAD.top}
        fill="#20727e"
        fillOpacity="0.03"
      />

      {/* median threshold lines */}
      <line
        x1={thresholdX}
        y1={PAD.top}
        x2={thresholdX}
        y2={H - PAD.bottom}
        stroke={axisColor}
        strokeOpacity="0.25"
        strokeDasharray="3 3"
      />
      <line
        x1={PAD.left}
        y1={thresholdY}
        x2={W - PAD.right}
        y2={thresholdY}
        stroke={axisColor}
        strokeOpacity="0.25"
        strokeDasharray="3 3"
      />

      {/* axes */}
      <line
        x1={PAD.left}
        y1={H - PAD.bottom}
        x2={W - PAD.right}
        y2={H - PAD.bottom}
        stroke="#e6e1dc"
      />
      <line
        x1={PAD.left}
        y1={PAD.top}
        x2={PAD.left}
        y2={H - PAD.bottom}
        stroke="#e6e1dc"
      />

      {/* Y axis ticks */}
      {[0, 50, 100].map((tick) => (
        <text
          key={tick}
          x={PAD.left - 6}
          y={yScale(tick) + 3}
          textAnchor="end"
          fontSize="9"
          fill={axisColor}
        >
          {tick}%
        </text>
      ))}

      {/* X axis ticks */}
      {[0, 400, 800].map((tick) => (
        <text
          key={tick}
          x={xScale(tick)}
          y={H - PAD.bottom + 14}
          textAnchor="middle"
          fontSize="9"
          fill={axisColor}
        >
          {tick}
        </text>
      ))}

      {/* axis titles */}
      <text
        x={PAD.left + innerW / 2}
        y={H - 2}
        textAnchor="middle"
        fontSize="9"
        fill={axisColor}
      >
        Retrievals
      </text>
      <text
        x={PAD.left - 28}
        y={PAD.top + innerH / 2}
        textAnchor="middle"
        fontSize="9"
        fill={axisColor}
        transform={`rotate(-90 ${PAD.left - 28} ${PAD.top + innerH / 2})`}
      >
        Citation rate
      </text>

      {/* quadrant labels (subtle) */}
      <text
        x={(PAD.left + thresholdX) / 2}
        y={PAD.top + 12}
        textAnchor="middle"
        fontSize="9"
        fontStyle="italic"
        fill={axisColor}
        opacity="0.7"
      >
        Hidden gems
      </text>
      <text
        x={(thresholdX + W - PAD.right) / 2}
        y={PAD.top + 12}
        textAnchor="middle"
        fontSize="9"
        fontStyle="italic"
        fill={axisColor}
        opacity="0.7"
      >
        Workhorses
      </text>
      <text
        x={(PAD.left + thresholdX) / 2}
        y={H - PAD.bottom - 4}
        textAnchor="middle"
        fontSize="9"
        fontStyle="italic"
        fill={axisColor}
        opacity="0.7"
      >
        Underused
      </text>
      <text
        x={(thresholdX + W - PAD.right) / 2}
        y={H - PAD.bottom - 4}
        textAnchor="middle"
        fontSize="9"
        fontStyle="italic"
        fill={axisColor}
        opacity="0.7"
      >
        Misfiring
      </text>

      {/* data points */}
      {data.map((d) => {
        const cx = xScale(d.retrievals);
        const cy = yScale(d.citationRate);
        const r = rScale(d.retrievals);
        const fill = fillFor(d.citationRate);
        return (
          <g key={d.hub}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={fill}
              fillOpacity="0.22"
              stroke={fill}
              strokeWidth="1.5"
            />
            <text
              x={cx}
              y={cy + r + 11}
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill="#292221"
            >
              {d.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function HubUsage() {
  return (
    <section
      id="module-hub-usage"
      role="tabpanel"
      aria-labelledby="kpi-hub-usage"
      className="flex min-h-[330px] flex-col rounded-lg border border-border bg-card p-5 shadow-xs"
    >
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-1 border-b-2 border-primary pb-0.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          Last 30 days
          <ChevronDown className="size-3.5" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Collapse
          <Minus className="size-3" />
        </button>
      </header>

      <div className="grid flex-1 grid-cols-3 gap-x-6 gap-y-5 pt-4">
        {HUB_USAGE_METRICS.map((metric) => (
          <UsageMetricTile key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}

function CoverageLegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('size-2 rounded-full', swatch)} />
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </span>
  );
}

function UsageMetrics() {
  return (
    <section
      id="module-usage"
      role="tabpanel"
      aria-labelledby="kpi-usage"
      className="flex min-h-[330px] flex-col rounded-lg border border-border bg-card p-5 shadow-xs"
    >
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-1 border-b-2 border-primary pb-0.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          Last 30 days
          <ChevronDown className="size-3.5" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Collapse
          <Minus className="size-3" />
        </button>
      </header>

      <div className="grid flex-1 grid-cols-3 gap-x-6 gap-y-5 pt-4">
        {USAGE_METRICS.map((metric) => (
          <UsageMetricTile key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}

function UsageMetricTile({ metric }: { metric: UsageMetric }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <span>{metric.label}</span>
        {metric.info ? <Info className="size-3 text-muted-foreground" /> : null}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="font-serif text-2xl leading-none font-semibold text-foreground">
          {metric.value}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">{metric.delta}</span>
      </div>
      <Sparkline data={metric.data} className="h-10" />
    </div>
  );
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 200;
  const h = 48;
  const padX = 0;
  const padY = 4;
  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * (w - 2 * padX);
    const y = h - padY - ((v - min) / range) * (h - 2 * padY);
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const fill = `${line} L${w.toFixed(1)} ${h} L0 ${h} Z`;
  const gradientId = `sparkline-gradient-${data.join('-')}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('w-full', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20727e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#20727e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradientId})`} />
      <path
        d={line}
        stroke="#20727e"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function NeedsAttention() {
  return (
    <section
      id="module-issues"
      role="tabpanel"
      aria-labelledby="kpi-issues"
      className="flex min-h-[330px] flex-col overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-[#b45309]" />
          <h2 className="text-sm font-semibold text-foreground">Needs attention</h2>
          <Badge variant="secondary" className="bg-secondary text-foreground">
            {ATTENTION.length}
          </Badge>
        </div>
        <Link
          href="/admin/issues"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
      <ul className="flex flex-1 flex-col divide-y divide-border">
        {ATTENTION.map((item) => {
          const toneText =
            item.tone === 'destructive' ? 'text-destructive' : 'text-[#b45309]';
          return (
            <li
              key={item.document}
              className="group/item flex flex-1 items-center gap-3 px-4 py-4"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                  item.tone === 'destructive' ? 'bg-destructive/10' : 'bg-[#fef3c7]'
                }`}
              >
                <item.icon className={`size-4 ${toneText}`} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-sm font-medium text-foreground">{item.document}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.schema} <span className="text-foreground/30">·</span>{' '}
                  <span className={toneText}>{item.issue}</span>{' '}
                  <span className="text-foreground/30">·</span> {item.detail}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
              <button
                type="button"
                aria-label={`More actions for ${item.document}`}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover/item:opacity-100"
              >
                <MoreVertical className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CoverageBar({ value }: { value: number }) {
  const tone =
    value >= 80 ? 'bg-primary' : value >= 60 ? 'bg-[#b45309]' : 'bg-destructive';
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={`absolute inset-y-0 left-0 rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs tabular-nums text-foreground">{value}%</span>
    </div>
  );
}

function IssuesIndicator({ count }: { count: number }) {
  if (count === 0) {
    return <span className="text-xs tabular-nums text-muted-foreground">—</span>;
  }
  const tone = count >= 5 ? 'text-destructive' : 'text-[#b45309]';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${tone}`}>
      <AlertTriangle className="size-3" />
      {count}
    </span>
  );
}

function SortableHeader({
  children,
  sorted = false,
}: {
  children: ReactNode;
  sorted?: boolean;
}) {
  return (
    <th className="px-3 align-middle">
      <button
        type="button"
        className="flex w-full items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-foreground/80"
      >
        <span className="min-w-0 flex-1 truncate text-left">{children}</span>
        {sorted ? (
          <>
            <Filter className="size-3 shrink-0 text-muted-foreground" />
            <ArrowUp className="size-3.5 shrink-0 text-muted-foreground" />
          </>
        ) : null}
      </button>
    </th>
  );
}
