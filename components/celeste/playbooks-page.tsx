'use client';

import {
  Activity,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CornerDownRight,
  Filter,
  Globe,
  Hand,
  Layers,
  LayoutGrid,
  LayoutList,
  Library,
  Mail,
  Microscope,
  UserCheck,
  MoreVertical,
  Newspaper,
  Pause,
  Pencil,
  Play,
  Plus,
  Presentation,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Swords,
  Tags,
  Target,
  Telescope,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PlaybookStatus = 'success' | 'failed' | 'running' | 'paused';

type PlaybookTone = 'teal' | 'amber' | 'rose' | 'indigo';

type Playbook = {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  status: PlaybookStatus;
  icon: LucideIcon;
  tone: PlaybookTone;
  chained?: Playbook;
  humanInLoop?: boolean;
};

type ScheduledGroup = {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  playbooks: Playbook[];
};

type EventGroup = {
  id: string;
  name: string;
  trigger: string;
  runsThisMonth: number;
  playbooks: Playbook[];
};

const TONE_STYLES: Record<PlaybookTone, { bg: string; text: string }> = {
  teal: { bg: 'bg-[#e8f1f2]', text: 'text-primary' },
  amber: { bg: 'bg-[#fef3c7]', text: 'text-[#b45309]' },
  rose: { bg: 'bg-[#fdf2f8]', text: 'text-[#be185d]' },
  indigo: { bg: 'bg-[#eef2ff]', text: 'text-[#4338ca]' },
};

const SCHEDULED_GROUPS: ScheduledGroup[] = [
  {
    id: 'sg-1',
    name: 'Monday morning review',
    schedule: 'Mondays at 8:00 AM',
    nextRun: 'In 3 days',
    playbooks: [
      {
        id: 'p-1',
        name: 'Weekly portfolio digest',
        description: 'Summarize deal activity, wins, and stalls from the past 7 days',
        lastRun: '2 days ago',
        status: 'success',
        icon: BarChart3,
        tone: 'teal',
      },
      {
        id: 'p-2',
        name: 'Industry news roundup',
        description: 'Pull top stories matching active deal theses',
        lastRun: '2 days ago',
        status: 'success',
        icon: Newspaper,
        tone: 'amber',
      },
      {
        id: 'p-3',
        name: 'Pipeline health check',
        description: 'Flag deals that have stalled or need attention',
        lastRun: '2 days ago',
        status: 'success',
        icon: Activity,
        tone: 'teal',
      },
    ],
  },
  {
    id: 'sg-2',
    name: 'End of quarter audit',
    schedule: 'Last day of quarter at 6:00 PM',
    nextRun: 'In 14 days',
    playbooks: [
      {
        id: 'p-4',
        name: 'Quarterly performance summary',
        description: 'Compile portfolio performance, returns, and milestones for the quarter',
        lastRun: 'Mar 31, 2026',
        status: 'success',
        icon: Trophy,
        tone: 'teal',
      },
      {
        id: 'p-5',
        name: 'Compliance audit run',
        description: 'Scan new documents for MNPI, sharing violations, and required disclosures',
        lastRun: 'Mar 31, 2026',
        status: 'success',
        icon: ShieldCheck,
        tone: 'rose',
        humanInLoop: true,
        chained: {
          id: 'p-5-chain',
          name: 'Notify legal of findings',
          description: 'Email a summary of flagged items and required actions to the legal team',
          lastRun: 'Mar 31, 2026',
          status: 'success',
          icon: Mail,
          tone: 'indigo',
        },
      },
    ],
  },
  {
    id: 'sg-3',
    name: 'Daily 9AM brief',
    schedule: 'Weekdays at 9:00 AM',
    nextRun: 'Tomorrow at 9:00 AM',
    playbooks: [
      {
        id: 'p-6',
        name: 'Top news for active deals',
        description: 'Aggregate overnight news mentioning deal targets or focus sectors',
        lastRun: 'This morning',
        status: 'success',
        icon: Globe,
        tone: 'amber',
        chained: {
          id: 'p-6-chain',
          name: 'Send digest to deal teams',
          description: 'Post the curated news digest to each deal team’s Slack channel',
          lastRun: 'This morning',
          status: 'success',
          icon: Send,
          tone: 'indigo',
        },
      },
      {
        id: 'p-7',
        name: 'Overnight DealCloud activity',
        description: 'Summary of pipeline changes, new leads, and updates since 6 PM yesterday',
        lastRun: 'This morning',
        status: 'failed',
        icon: Building2,
        tone: 'teal',
      },
    ],
  },
];

const EVENT_GROUPS: EventGroup[] = [
  {
    id: 'eg-1',
    name: 'New deal opportunity',
    trigger: 'DealCloud · Deal created',
    runsThisMonth: 23,
    playbooks: [
      {
        id: 'p-8',
        name: 'Auto-research new target',
        description: 'Pull public info, recent news, and competitor analysis for the new target',
        lastRun: '4 hours ago',
        status: 'success',
        icon: Telescope,
        tone: 'indigo',
      },
      {
        id: 'p-9',
        name: 'Pull existing relationships',
        description: 'Surface any existing firm contacts at or connected to the target company',
        lastRun: '4 hours ago',
        status: 'success',
        icon: Users,
        tone: 'indigo',
      },
      {
        id: 'p-10',
        name: 'Generate initial fit assessment',
        description: 'Score the new opportunity against active fund mandates and theses',
        lastRun: '4 hours ago',
        status: 'success',
        icon: Target,
        tone: 'indigo',
      },
    ],
  },
  {
    id: 'eg-2',
    name: 'Document uploaded to hub',
    trigger: 'Knowledge hub · Document uploaded',
    runsThisMonth: 187,
    playbooks: [
      {
        id: 'p-11',
        name: 'Auto-tag and categorize',
        description: 'Apply schema and labels based on document contents',
        lastRun: '12 minutes ago',
        status: 'success',
        icon: Tags,
        tone: 'rose',
      },
      {
        id: 'p-12',
        name: 'Schema extraction',
        description: 'Extract structured data into the matching document schema',
        lastRun: '12 minutes ago',
        status: 'running',
        icon: Layers,
        tone: 'rose',
      },
      {
        id: 'p-13',
        name: 'Flag potential MNPI',
        description: 'Scan for material non-public information and flag for compliance review',
        lastRun: '12 minutes ago',
        status: 'success',
        icon: ShieldAlert,
        tone: 'rose',
      },
    ],
  },
];

type Template = {
  id: string;
  name: string;
  description: string;
  triggerKind: 'scheduled' | 'event' | 'manual';
  icon: LucideIcon;
  tone: PlaybookTone;
};

const TEMPLATES: Template[] = [
  {
    id: 't-1',
    name: 'Daily macro snapshot',
    description: 'Morning brief on market movers and macro headlines',
    triggerKind: 'scheduled',
    icon: TrendingUp,
    tone: 'teal',
  },
  {
    id: 't-2',
    name: 'Competitor mention monitor',
    description: 'Web-wide news matching competitor names',
    triggerKind: 'event',
    icon: Newspaper,
    tone: 'amber',
  },
  {
    id: 't-3',
    name: 'ESG diligence pull',
    description: 'Pull ESG signals whenever a new deal target is created',
    triggerKind: 'event',
    icon: ShieldCheck,
    tone: 'rose',
  },
  {
    id: 't-4',
    name: 'Earnings call summary',
    description: 'Summarize public-company earnings calls each morning',
    triggerKind: 'scheduled',
    icon: Trophy,
    tone: 'teal',
  },
  {
    id: 't-5',
    name: 'LinkedIn change watcher',
    description: 'Flag executive moves at portfolio companies',
    triggerKind: 'event',
    icon: Users,
    tone: 'indigo',
  },
  {
    id: 't-6',
    name: 'Patent filing tracker',
    description: 'Monitor IP filings in active sectors',
    triggerKind: 'scheduled',
    icon: ShieldAlert,
    tone: 'rose',
  },
  {
    id: 't-7',
    name: 'Conflict-of-interest scan',
    description: 'Scan firmwide for COI on any new target',
    triggerKind: 'event',
    icon: ShieldAlert,
    tone: 'rose',
  },
  {
    id: 't-8',
    name: 'Reference call notes',
    description: 'Summarize uploaded reference call notes into a digest',
    triggerKind: 'event',
    icon: Microscope,
    tone: 'indigo',
  },
  {
    id: 't-9',
    name: 'Comparable companies',
    description: 'Pull side-by-side comps for any target on demand',
    triggerKind: 'manual',
    icon: Swords,
    tone: 'indigo',
  },
  {
    id: 't-10',
    name: 'Quarterly portfolio bench',
    description: 'Compare portfolio performance against named benchmarks',
    triggerKind: 'scheduled',
    icon: BarChart3,
    tone: 'teal',
  },
  {
    id: 't-11',
    name: 'Trademark search',
    description: 'Check trademark availability for new product names',
    triggerKind: 'manual',
    icon: Tags,
    tone: 'rose',
  },
  {
    id: 't-12',
    name: 'Diligence checklist runner',
    description: 'Run a configurable checklist over any target company',
    triggerKind: 'manual',
    icon: Filter,
    tone: 'indigo',
  },
];

const MANUAL_PLAYBOOKS: Playbook[] = [
  {
    id: 'p-14',
    name: 'Ad-hoc target screening',
    description: 'Run a one-off screen against a list of companies or sectors',
    lastRun: 'Yesterday',
    status: 'success',
    icon: Filter,
    tone: 'indigo',
  },
  {
    id: 'p-15',
    name: 'Competitor analysis',
    description: 'Generate a deep-dive comparing two or more companies',
    lastRun: '3 days ago',
    status: 'success',
    icon: Swords,
    tone: 'indigo',
  },
  {
    id: 'p-16',
    name: 'Investor presentation builder',
    description: 'Compile a draft pitch deck from internal materials and selected hubs',
    lastRun: '1 week ago',
    status: 'success',
    icon: Presentation,
    tone: 'teal',
  },
  {
    id: 'p-17',
    name: 'Custom deep research',
    description: 'Open-ended research on a question with citations and source tracing',
    lastRun: '2 weeks ago',
    status: 'success',
    icon: Microscope,
    tone: 'indigo',
  },
];

type TimelineFire = {
  hour: number;
  status: 'completed' | 'failed' | 'upcoming';
  label?: string;
};

const NOW_HOUR = 10.5;

const SCHEDULED_FIRES: TimelineFire[] = [
  { hour: 8, status: 'completed', label: 'Monday review' },
  { hour: 8.05, status: 'completed' },
  { hour: 8.1, status: 'completed' },
  { hour: 9, status: 'completed', label: 'Daily brief' },
  { hour: 9.05, status: 'failed' },
  { hour: 10, status: 'completed' },
  { hour: 12, status: 'upcoming', label: 'Mid-day digest' },
  { hour: 14, status: 'upcoming' },
  { hour: 17, status: 'upcoming', label: 'Market close' },
  { hour: 17.05, status: 'upcoming' },
  { hour: 21, status: 'upcoming', label: 'Overnight prep' },
];

const EVENT_FIRES = [
  0.4, 0.9, 1.6, 2.1, 2.8, 3.3, 3.9, 4.5, 5.2, 5.6, 6.1, 6.4, 6.9, 7.4, 7.7, 8.2,
  8.6, 9.1, 9.4, 9.7, 9.9, 10.1, 10.25,
];

const RUNNING_NOW_NAMES = ['Schema extraction', 'Auto-tag and categorize'];
const RUNS_TODAY_TOP = [
  'Schema extraction',
  'Auto-tag and categorize',
  'Flag potential MNPI',
  'Top news for active deals',
];
const FAILURES_NAMES = [
  'Overnight DealCloud activity',
  'Pull existing relationships',
];
const NEXT_SCHEDULED_NAMES = [
  'Mid-day digest',
  'Pipeline check refresh',
  'Market close summary',
];

export function PlaybooksOngoing() {
  const [libraryTab, setLibraryTab] = useState<'all' | 'mine' | 'templates'>('all');
  const configuredCount = LIBRARY.filter((e) => e.configured).length;
  const templateCount = LIBRARY.length - configuredCount;
  const visibleLibrary =
    libraryTab === 'mine'
      ? LIBRARY.filter((e) => e.configured)
      : libraryTab === 'templates'
        ? LIBRARY.filter((e) => !e.configured)
        : LIBRARY;
  return (
    <div className="flex w-full max-w-[1140px] flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-2xl leading-tight font-semibold text-foreground">
          Playbooks
        </h1>
        <Button size="sm" data-icon="inline-start">
          <Plus />
          New playbook
        </Button>
      </header>

      <OperationsStrip />
      <TodayTimeline />

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Set up a new playbook
          </h3>
          <span className="text-xs text-muted-foreground">
            Pick a trigger to scaffold the playbook
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TriggerCard
            icon={Clock}
            iconBg="bg-primary/10"
            iconText="text-primary"
            kicker="Scheduled"
            title="Run automatically on a recurring schedule"
            example="Send a Monday-morning portfolio digest every week at 8 AM, or kick off a quarterly compliance sweep on the last day of every quarter."
            cta="Create a scheduled playbook"
          />
          <TriggerCard
            icon={Zap}
            iconBg="bg-[#fef3c7]"
            iconText="text-[#b45309]"
            kicker="Event-triggered"
            title="Fire in response to a system event"
            example="When a deal is created in DealCloud, auto-research the target. When a document lands in a hub, extract the schema and flag MNPI."
            cta="Create an event-triggered playbook"
          />
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 border-b-2 border-border pb-2">
          <h2 className="font-serif text-xl font-semibold text-foreground">Library</h2>
          <Button variant="outline" size="sm" data-icon="inline-start">
            <Plus />
            Add
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <LibraryFilterTabs
            value={libraryTab}
            onChange={setLibraryTab}
            allCount={LIBRARY.length}
            mineCount={configuredCount}
            templatesCount={templateCount}
          />
          <div className="flex items-center gap-2">
            <div className="relative w-[220px]">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search library"
                aria-label="Search the playbook library"
                className="h-8 rounded-lg bg-card pl-8 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" data-icon="inline-start">
              <ArrowUpDown />
              Sort
            </Button>
            <Button variant="secondary" size="sm" data-icon="inline-start">
              <Filter />
              Filter
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {visibleLibrary.map((entry) => (
            <LibraryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LibraryFilterTabs({
  value,
  onChange,
  allCount,
  mineCount,
  templatesCount,
}: {
  value: 'all' | 'mine' | 'templates';
  onChange: (v: 'all' | 'mine' | 'templates') => void;
  allCount: number;
  mineCount: number;
  templatesCount: number;
}) {
  const tabs: { value: 'all' | 'mine' | 'templates'; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: allCount },
    { value: 'mine', label: 'My Playbooks', count: mineCount },
    { value: 'templates', label: 'Templates', count: templatesCount },
  ];
  return (
    <div
      role="tablist"
      aria-label="Library filter"
      className="flex h-8 items-center rounded-md bg-accent p-[3px]"
    >
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          data-active={value === t.value || undefined}
          className="flex h-[26px] items-center gap-1.5 rounded px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs"
        >
          {t.label}
          <span className="text-[11px] tabular-nums text-muted-foreground/80">
            {t.count}
          </span>
        </button>
      ))}
    </div>
  );
}

function TriggerCard({
  icon: Icon,
  iconBg,
  iconText,
  kicker,
  title,
  example,
  cta,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconText: string;
  kicker: string;
  title: string;
  example: string;
  cta: string;
}) {
  return (
    <Link
      href="/automations"
      className="group/card flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-[1px] hover:border-primary/40 hover:shadow-md"
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className={`size-4 ${iconText}`} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {kicker}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors group-hover/card:underline">
            {cta}
            <ArrowUpRight className="size-3" />
          </span>
        </div>
        <h4 className="font-serif text-base leading-snug font-semibold text-foreground">
          {title}
        </h4>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{example}</p>
      </div>
    </Link>
  );
}

export function AutomationsPage() {
  const [view, setView] = useState<'list' | 'dashboard'>('dashboard');
  const scheduledCount = SCHEDULED_GROUPS.reduce((n, g) => n + g.playbooks.length, 0);
  const eventCount = EVENT_GROUPS.reduce((n, g) => n + g.playbooks.length, 0);
  return (
    <div className="flex w-full max-w-[1140px] flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl leading-tight font-semibold text-foreground">
            Automations
          </h1>
          <p className="font-serif text-sm leading-5 text-muted-foreground">
            Playbooks that run on a schedule or in response to events across your firm
          </p>
        </div>
        <Button size="sm" data-icon="inline-start">
          <Plus />
          New automation
        </Button>
      </header>

      <Tabs defaultValue="scheduled">
        <div className="flex items-center justify-between gap-3 border-b-2 border-border pt-2 pb-0">
          <TabsList variant="line" className="!h-14 gap-1 p-0">
            <TabsTrigger
              value="scheduled"
              className="h-14 px-5 font-serif text-xl font-semibold data-[state=active]:text-primary data-[state=active]:after:!bottom-[-2px] data-[state=active]:after:!h-[3px] data-[state=active]:after:!bg-primary"
            >
              Scheduled ({scheduledCount})
            </TabsTrigger>
            <TabsTrigger
              value="event"
              className="h-14 px-5 font-serif text-xl font-semibold data-[state=active]:text-primary data-[state=active]:after:!bottom-[-2px] data-[state=active]:after:!h-[3px] data-[state=active]:after:!bg-primary"
            >
              Event-triggered ({eventCount})
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 pb-1">
            <ViewToggle value={view} onChange={setView} />
            <Button variant="outline" size="sm" data-icon="inline-start">
              <Plus />
              Add
            </Button>
          </div>
        </div>

        <TabsContent value="scheduled" className="flex flex-col gap-4 pt-5">
          {view === 'list' ? (
            SCHEDULED_GROUPS.map((g) => <ScheduledGroupCard key={g.id} group={g} />)
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {SCHEDULED_GROUPS.map((g) => (
                <ScheduledGroupDashboardCard key={g.id} group={g} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="event" className="flex flex-col gap-4 pt-5">
          {view === 'list' ? (
            EVENT_GROUPS.map((g) => <EventGroupCard key={g.id} group={g} />)
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {EVENT_GROUPS.map((g) => (
                <EventGroupDashboardCard key={g.id} group={g} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: 'list' | 'dashboard';
  onChange: (v: 'list' | 'dashboard') => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Layout"
      className="flex h-8 items-center rounded-md border border-border bg-background p-0.5"
    >
      <button
        type="button"
        aria-label="Dashboard view"
        data-active={value === 'dashboard' || undefined}
        onClick={() => onChange('dashboard')}
        className="flex h-7 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground"
      >
        <LayoutGrid className="size-3.5" />
      </button>
      <button
        type="button"
        aria-label="List view"
        data-active={value === 'list' || undefined}
        onClick={() => onChange('list')}
        className="flex h-7 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground"
      >
        <LayoutList className="size-3.5" />
      </button>
    </div>
  );
}

function ScheduledGroupDashboardCard({ group }: { group: ScheduledGroup }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg">
      <header className="flex items-start justify-between gap-2 bg-accent/40 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Clock className="size-3.5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h3 className="truncate text-sm font-semibold text-foreground">{group.name}</h3>
            <p className="truncate text-[11px] text-muted-foreground">
              {group.schedule} · {group.nextRun}
            </p>
          </div>
        </div>
        <GroupHeaderActions name={group.name} />
      </header>
      <div className="flex flex-wrap gap-1.5 px-4 py-3">
        {group.playbooks.map((p) => (
          <PlaybookPill key={p.id} playbook={p} />
        ))}
      </div>
    </article>
  );
}

function EventGroupDashboardCard({ group }: { group: EventGroup }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg">
      <header className="flex items-start justify-between gap-2 bg-accent/40 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#fef3c7] text-[#b45309]">
            <Zap className="size-3.5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h3 className="truncate text-sm font-semibold text-foreground">{group.name}</h3>
            <p className="truncate text-[11px] text-muted-foreground">
              {group.trigger} · {group.runsThisMonth} runs/mo
            </p>
          </div>
        </div>
        <GroupHeaderActions name={group.name} />
      </header>
      <div className="flex flex-wrap gap-1.5 px-4 py-3">
        {group.playbooks.map((p) => (
          <PlaybookPill key={p.id} playbook={p} />
        ))}
      </div>
    </article>
  );
}

function ManualToolbar() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          aria-label="Search manual playbooks"
          className="h-8 rounded-lg bg-card pl-8 text-sm"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            data-icon="inline-start"
            aria-label="Sort manual playbooks"
          >
            <ArrowUpDown />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Recently run</DropdownMenuItem>
          <DropdownMenuItem>Most run</DropdownMenuItem>
          <DropdownMenuItem>Alphabetical</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="secondary"
        size="sm"
        data-icon="inline-start"
        aria-label="Filter manual playbooks"
      >
        <Filter />
        Filter
      </Button>
    </div>
  );
}

function GroupHeaderActions({ name }: { name: string }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        aria-label={`Add playbook to ${name}`}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Plus className="size-4" />
      </button>
      <button
        type="button"
        aria-label={`More actions for ${name}`}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <MoreVertical className="size-4" />
      </button>
    </div>
  );
}

function PlaybookPill({ playbook }: { playbook: Playbook }) {
  if (!playbook.chained) {
    return <PlaybookPillButton playbook={playbook} />;
  }
  return (
    <div className="flex max-w-full flex-col items-start gap-1">
      <PlaybookPillButton playbook={playbook} />
      <div
        className="flex items-center gap-1 pl-4"
        title={`Runs after ${playbook.name}`}
      >
        <CornerDownRight
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <PlaybookPillButton playbook={playbook.chained} chained />
      </div>
    </div>
  );
}

function PlaybookPillButton({
  playbook,
  chained = false,
}: {
  playbook: Playbook;
  chained?: boolean;
}) {
  const tone = TONE_STYLES[playbook.tone];
  const Icon = playbook.icon;
  return (
    <button
      type="button"
      title={
        chained
          ? `Chained · ${playbook.name} — ${playbook.description}`
          : `${playbook.name} — ${playbook.description}`
      }
      className="group/pill inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full',
          tone.bg,
        )}
      >
        <Icon className={cn('size-3.5', tone.text)} />
      </span>
      <span className="truncate">{playbook.name}</span>
      <PlaybookStatusDot status={playbook.status} />
      {playbook.humanInLoop ? (
        <UserCheck
          aria-label="Human in the loop · review required"
          className="size-3.5 shrink-0 text-muted-foreground"
        />
      ) : null}
    </button>
  );
}

function PlaybookStatusDot({ status }: { status: PlaybookStatus }) {
  if (status === 'running') {
    return (
      <span aria-label="Running" className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span aria-label="Failed" className="size-2 shrink-0 rounded-full bg-destructive" />
    );
  }
  if (status === 'paused') {
    return (
      <span aria-label="Paused" className="size-2 shrink-0 rounded-full bg-muted-foreground" />
    );
  }
  return (
    <span aria-label="Success" className="size-2 shrink-0 rounded-full bg-primary" />
  );
}

function SubSectionLabel({
  icon: Icon,
  iconTone,
  title,
  count,
}: {
  icon: LucideIcon;
  iconTone: 'teal' | 'amber';
  title: string;
  count: string;
}) {
  const toneClass =
    iconTone === 'teal'
      ? 'bg-primary/10 text-primary'
      : 'bg-[#fef3c7] text-[#b45309]';
  return (
    <div className="flex items-center gap-2">
      <span className={cn('flex size-6 items-center justify-center rounded-md', toneClass)}>
        <Icon className="size-3.5" />
      </span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <span className="text-xs text-muted-foreground">{count}</span>
    </div>
  );
}

type LibraryEntry = {
  id: string;
  name: string;
  description: string;
  triggerKind: 'scheduled' | 'event' | 'manual';
  configured: boolean;
  editedAt: string;
  detail?: string;
};

const LIBRARY: LibraryEntry[] = [
  ...SCHEDULED_GROUPS.flatMap((g) =>
    g.playbooks.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      triggerKind: 'scheduled' as const,
      configured: true,
      editedAt: `Last run · ${p.lastRun}`,
      detail: g.schedule,
    })),
  ),
  ...EVENT_GROUPS.flatMap((g) =>
    g.playbooks.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      triggerKind: 'event' as const,
      configured: true,
      editedAt: `Last fired · ${p.lastRun}`,
      detail: g.trigger,
    })),
  ),
  ...MANUAL_PLAYBOOKS.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    triggerKind: 'manual' as const,
    configured: true,
    editedAt: `Last run · ${p.lastRun}`,
  })),
  ...TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    triggerKind: t.triggerKind,
    configured: false,
    editedAt: 'Not yet enabled',
  })),
];

function LibraryHeader() {
  const configuredCount = LIBRARY.filter((e) => e.configured).length;
  const templateCount = LIBRARY.length - configuredCount;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-foreground">
        {LIBRARY.length} playbooks in your library
        <span className="text-foreground/30"> · </span>
        <span className="text-muted-foreground tabular-nums">
          {configuredCount} configured
          <span className="text-foreground/30"> · </span>
          {templateCount} available to enable
        </span>
      </span>
    </div>
  );
}

function LibraryToolbar() {
  const configuredCount = LIBRARY.filter((e) => e.configured).length;
  const templateCount = LIBRARY.length - configuredCount;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm whitespace-nowrap text-foreground">
        <span className="font-medium tabular-nums">{LIBRARY.length}</span> playbooks
        <span className="text-foreground/30"> · </span>
        <span className="text-muted-foreground tabular-nums">
          {configuredCount} configured <span className="text-foreground/30">·</span>{' '}
          {templateCount} available
        </span>
      </span>
      <div className="flex items-center gap-2">
        <div className="relative w-[220px]">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search library"
            aria-label="Search the playbook library"
            className="h-8 rounded-lg bg-card pl-8 text-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" data-icon="inline-start">
              <ArrowUpDown />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Recently updated</DropdownMenuItem>
            <DropdownMenuItem>Most run</DropdownMenuItem>
            <DropdownMenuItem>Alphabetical</DropdownMenuItem>
            <DropdownMenuItem>Configured first</DropdownMenuItem>
            <DropdownMenuItem>Templates first</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="secondary" size="sm" data-icon="inline-start">
          <Filter />
          Filter
        </Button>
      </div>
    </div>
  );
}

function LibraryCard({ entry }: { entry: LibraryEntry }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-xs">
      <header className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-2 text-sm leading-5 font-semibold text-foreground">
          {entry.name}
        </h4>
        <button
          type="button"
          aria-label={`More actions for ${entry.name}`}
          className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <MoreVertical className="size-4" />
        </button>
      </header>

      {entry.triggerKind === 'scheduled' && entry.configured ? (
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/20 bg-primary/[0.06] px-2 py-0.5 text-[11px] font-medium text-primary">
            <Clock className="size-3" />
            Scheduled
          </span>
          {entry.detail ? (
            <span className="min-w-0 truncate text-[11px] text-muted-foreground">
              {entry.detail}
            </span>
          ) : null}
        </div>
      ) : null}
      {entry.triggerKind === 'event' && entry.configured ? (
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#b45309]/20 bg-[#fef3c7] px-2 py-0.5 text-[11px] font-medium text-[#b45309]">
            <Zap className="size-3" />
            Event-triggered
          </span>
          {entry.detail ? (
            <span className="min-w-0 truncate text-[11px] text-muted-foreground">
              {entry.detail}
            </span>
          ) : null}
        </div>
      ) : null}

      <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
        {entry.description}
      </p>

      <p className="text-[11px] text-muted-foreground">{entry.editedAt}</p>

      <div className="flex items-center gap-1.5">
        {entry.configured ? (
          <>
            <div className="flex flex-1 items-center rounded-md border border-border bg-card">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Play className="size-3" />
                Run
              </button>
              <span className="h-4 w-px bg-border" />
              <button
                type="button"
                aria-label="Run options"
                className="flex items-center justify-center px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronDown className="size-3" />
              </button>
            </div>
            <button
              type="button"
              aria-label="Edit playbook"
              className="flex size-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Pencil className="size-3.5" />
            </button>
          </>
        ) : (
          <Button variant="outline" size="sm" className="w-full" data-icon="inline-start">
            <Plus />
            Enable
          </Button>
        )}
      </div>
    </article>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const tone = TONE_STYLES[template.tone];
  const Icon = template.icon;
  const triggerLabel =
    template.triggerKind === 'scheduled'
      ? 'Scheduled'
      : template.triggerKind === 'event'
        ? 'Event-triggered'
        : 'Manual';
  const TriggerIcon =
    template.triggerKind === 'scheduled'
      ? Clock
      : template.triggerKind === 'event'
        ? Zap
        : Hand;
  return (
    <article className="group/template flex items-start gap-3 rounded-lg border border-dashed border-border bg-card/60 p-3 transition-colors hover:bg-card hover:border-primary/40">
      <span
        className={cn('flex size-9 shrink-0 items-center justify-center rounded-md', tone.bg)}
      >
        <Icon className={cn('size-4', tone.text)} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-foreground">{template.name}</h4>
        </div>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          {template.description}
        </p>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <TriggerIcon className="size-3" />
          {triggerLabel}
        </span>
      </div>
      <Button variant="outline" size="xs" data-icon="inline-start" className="shrink-0">
        <Plus />
        Enable
      </Button>
    </article>
  );
}

function OperationsStrip() {
  return (
    <section
      aria-label="Live operations"
      className="grid grid-cols-2 gap-3 md:grid-cols-4"
    >
      <OpsTile
        label="Running now"
        value="2"
        icon={Activity}
        accent="pulse"
        names={RUNNING_NOW_NAMES}
      />
      <OpsTile
        label="Runs today"
        value="47"
        icon={TrendingUp}
        rightLink={{ label: 'View all', href: '#' }}
      />
      <OpsTile
        label="Failures · 24h"
        value="2"
        icon={XCircle}
        tone="destructive"
        names={FAILURES_NAMES}
      />
      <OpsTile
        label="Next scheduled"
        value="1h 30m"
        icon={Clock}
        tone="upcoming"
        names={NEXT_SCHEDULED_NAMES}
      />
    </section>
  );
}

function OpsTile({
  label,
  value,
  icon: Icon,
  accent,
  tone,
  names,
  rightLink,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: 'pulse';
  tone?: 'destructive' | 'upcoming';
  names?: string[];
  rightLink?: { label: string; href: string };
}) {
  const valueClass =
    tone === 'destructive'
      ? 'text-destructive'
      : tone === 'upcoming'
        ? 'text-primary'
        : 'text-foreground';
  const iconClass =
    tone === 'destructive'
      ? 'text-destructive'
      : tone === 'upcoming'
        ? 'text-primary'
        : 'text-muted-foreground';
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-lg border border-border bg-card px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className={cn('size-4', iconClass)} />
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-end gap-2">
          <span
            className={cn(
              'font-serif text-2xl leading-none font-semibold tabular-nums',
              valueClass,
            )}
          >
            {value}
          </span>
          {accent === 'pulse' ? (
            <span className="relative mb-0.5 flex size-2.5">
              <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
          ) : null}
        </div>
        {rightLink ? (
          <a
            href={rightLink.href}
            className="inline-flex items-center gap-0.5 self-end text-xs font-medium text-primary hover:underline"
          >
            {rightLink.label}
            <ArrowUpRight className="size-3" />
          </a>
        ) : names && names.length > 0 ? (
          <CyclingText items={names} />
        ) : null}
      </div>
    </div>
  );
}

function CyclingText({ items, interval = 3000 }: { items: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (items.length <= 1) return;
    const fadeOut = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 280);
    }, interval);
    return () => clearInterval(fadeOut);
  }, [items.length, interval]);

  return (
    <span
      className="max-w-[60%] self-end truncate text-right text-[11px] text-muted-foreground transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {items[index]}
    </span>
  );
}

function OpsSparkline({ data }: { data: number[] }) {
  const W = 52;
  const H = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - 2 - ((v - min) / range) * (H - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-4 w-[52px]" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="#20727e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TodayTimeline() {
  const [collapsed, setCollapsed] = useState(true);

  const completedCount = SCHEDULED_FIRES.filter((f) => f.status === 'completed').length;
  const failedCount = SCHEDULED_FIRES.filter((f) => f.status === 'failed').length;
  const upcomingCount = SCHEDULED_FIRES.filter((f) => f.status === 'upcoming').length;
  const eventCount = EVENT_FIRES.length;

  return (
    <section
      aria-label="Today's playbook activity"
      className="overflow-hidden rounded-lg border border-border bg-card px-4 py-3 shadow-xs"
    >
      <header className="flex items-center justify-between pb-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <h3 className="text-sm font-semibold text-foreground">Today</h3>
          {collapsed ? (
            <span className="truncate text-[11px] text-muted-foreground">
              {completedCount} completed
              {failedCount > 0 ? (
                <>
                  {' '}
                  <span className="text-foreground/30">·</span>{' '}
                  <span className="text-destructive">{failedCount} failed</span>
                </>
              ) : null}{' '}
              <span className="text-foreground/30">·</span> {upcomingCount} upcoming{' '}
              <span className="text-foreground/30">·</span> {eventCount} event fires
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <LegendDot color="bg-primary" label="Completed" />
              <LegendDot color="bg-card border border-primary" label="Upcoming" />
              <LegendDot color="bg-destructive" label="Failed" />
              <LegendDot color="bg-[#b45309]/50" label="Event fire" small />
            </div>
          ) : null}
          <button
            type="button"
            aria-label={collapsed ? 'Expand timeline' : 'Collapse timeline'}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((c) => !c)}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {collapsed ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronUp className="size-4" />
            )}
          </button>
        </div>
      </header>
      {collapsed ? <MiniTimeline /> : <FullTimeline />}
    </section>
  );
}

function FullTimeline() {
  const W = 1100;
  const H = 70;
  const PAD = { left: 24, right: 24, top: 16, bottom: 18 };
  const innerW = W - PAD.left - PAD.right;

  const xScale = (hour: number) => PAD.left + (hour / 24) * innerW;
  const baselineY = PAD.top + (H - PAD.top - PAD.bottom) / 2;
  const nowX = xScale(NOW_HOUR);
  const axisColor = '#73605b';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="24-hour playbook timeline"
    >
        {/* baseline */}
        <line
          x1={PAD.left}
          y1={baselineY}
          x2={W - PAD.right}
          y2={baselineY}
          stroke="#e6e1dc"
          strokeWidth="1.5"
        />
        {/* hour ticks */}
        {[0, 6, 12, 18, 24].map((h) => (
          <g key={h}>
            <line
              x1={xScale(h)}
              y1={baselineY}
              x2={xScale(h)}
              y2={baselineY + 3}
              stroke={axisColor}
              strokeOpacity="0.4"
            />
            <text
              x={xScale(h)}
              y={H - 4}
              fontSize="9"
              textAnchor="middle"
              fill={axisColor}
            >
              {h === 0 || h === 24
                ? '12 AM'
                : h === 12
                  ? '12 PM'
                  : h > 12
                    ? `${h - 12} PM`
                    : `${h} AM`}
            </text>
          </g>
        ))}

        {/* "now" indicator */}
        <line
          x1={nowX}
          y1={PAD.top - 2}
          x2={nowX}
          y2={H - PAD.bottom}
          stroke="#20727e"
          strokeWidth="1.5"
        />
        <rect x={nowX - 20} y={0} width="40" height="12" rx="3" fill="#20727e" />
        <text
          x={nowX}
          y={9}
          fontSize="9"
          textAnchor="middle"
          fill="white"
          fontWeight="600"
        >
          Now · 10:30
        </text>

        {/* event firings (below baseline) */}
        {EVENT_FIRES.map((h, i) => (
          <rect
            key={i}
            x={xScale(h) - 1}
            y={baselineY + 5}
            width="2"
            height="7"
            rx="1"
            fill="#b45309"
            fillOpacity="0.55"
          />
        ))}

        {/* scheduled fires (above baseline) */}
        {SCHEDULED_FIRES.map((fire, i) => {
          const x = xScale(fire.hour);
          const cy = baselineY - 9;
          const fill =
            fire.status === 'failed'
              ? '#d4183d'
              : fire.status === 'completed'
                ? '#20727e'
                : 'white';
          const stroke =
            fire.status === 'upcoming'
              ? '#20727e'
              : fire.status === 'failed'
                ? '#d4183d'
                : '#20727e';
          return (
            <circle
              key={i}
              cx={x}
              cy={cy}
              r="4"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
          );
        })}
    </svg>
  );
}

function MiniTimeline() {
  const W = 1100;
  const H = 20;
  const PAD = { left: 24, right: 24 };
  const innerW = W - PAD.left - PAD.right;
  const xScale = (hour: number) => PAD.left + (hour / 24) * innerW;
  const nowX = xScale(NOW_HOUR);
  const baselineY = H / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Today's playbook activity (minimized)"
    >
      {/* baseline */}
      <line
        x1={PAD.left}
        y1={baselineY}
        x2={W - PAD.right}
        y2={baselineY}
        stroke="#e6e1dc"
        strokeWidth="1"
      />

      {/* now line */}
      <line
        x1={nowX}
        y1={2}
        x2={nowX}
        y2={H - 2}
        stroke="#20727e"
        strokeWidth="1.5"
      />

      {/* event firings (below baseline) */}
      {EVENT_FIRES.map((h, i) => (
        <rect
          key={i}
          x={xScale(h) - 0.75}
          y={baselineY + 1.5}
          width="1.5"
          height="4"
          rx="0.5"
          fill="#b45309"
          fillOpacity="0.55"
        />
      ))}

      {/* scheduled fires (above baseline) */}
      {SCHEDULED_FIRES.map((fire, i) => {
        const x = xScale(fire.hour);
        const cy = baselineY - 3;
        const fill =
          fire.status === 'failed'
            ? '#d4183d'
            : fire.status === 'completed'
              ? '#20727e'
              : 'white';
        const stroke =
          fire.status === 'upcoming'
            ? '#20727e'
            : fire.status === 'failed'
              ? '#d4183d'
              : '#20727e';
        return (
          <circle
            key={i}
            cx={x}
            cy={cy}
            r="2.5"
            fill={fill}
            stroke={stroke}
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

function LegendDot({
  color,
  label,
  small,
}: {
  color: string;
  label: string;
  small?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('rounded-full', small ? 'h-3 w-[3px]' : 'size-2', color)} />
      <span>{label}</span>
    </span>
  );
}

function SectionHeader({
  icon: Icon,
  iconTone,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon;
  iconTone: 'teal' | 'amber' | 'muted';
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  const toneClass =
    iconTone === 'teal'
      ? 'bg-primary/10 text-primary'
      : iconTone === 'amber'
        ? 'bg-[#fef3c7] text-[#b45309]'
        : 'bg-secondary text-muted-foreground';
  return (
    <div className="-mb-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className={cn('flex size-7 items-center justify-center rounded-md', toneClass)}>
          <Icon className="size-4" />
        </span>
        <div className="flex items-baseline gap-2">
          <h2 className="font-serif text-lg font-semibold text-foreground">{title}</h2>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </div>
      </div>
      {action}
    </div>
  );
}

function ScheduledGroupCard({ group }: { group: ScheduledGroup }) {
  return (
    <article className="overflow-hidden rounded-lg bg-card shadow-xs">
      <header className="flex items-center justify-between gap-3 bg-accent/40 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Clock className="size-4" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className="truncate text-sm font-semibold text-foreground">{group.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{group.schedule}</span>{' '}
              <span className="text-foreground/30">·</span> Next run {group.nextRun}{' '}
              <span className="text-foreground/30">·</span> {group.playbooks.length} playbooks
            </p>
          </div>
        </div>
        <GroupHeaderActions name={group.name} />
      </header>
      <ul className="divide-y divide-border">
        {group.playbooks.map((p) => (
          <PlaybookRow key={p.id} playbook={p} />
        ))}
      </ul>
    </article>
  );
}

function EventGroupCard({ group }: { group: EventGroup }) {
  return (
    <article className="overflow-hidden rounded-lg bg-card shadow-xs">
      <header className="flex items-center justify-between gap-3 bg-accent/40 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#fef3c7] text-[#b45309]">
            <Zap className="size-4" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className="truncate text-sm font-semibold text-foreground">{group.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{group.trigger}</span>{' '}
              <span className="text-foreground/30">·</span> {group.runsThisMonth} runs this month{' '}
              <span className="text-foreground/30">·</span> {group.playbooks.length} playbooks
            </p>
          </div>
        </div>
        <GroupHeaderActions name={group.name} />
      </header>
      <ul className="divide-y divide-border">
        {group.playbooks.map((p) => (
          <PlaybookRow key={p.id} playbook={p} />
        ))}
      </ul>
    </article>
  );
}

function PlaybookRow({ playbook }: { playbook: Playbook }) {
  const tone = TONE_STYLES[playbook.tone];
  const Icon = playbook.icon;
  return (
    <li className="group/row flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent">
      <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-md', tone.bg)}>
        <Icon className={cn('size-4', tone.text)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-medium text-foreground">{playbook.name}</p>
        <p className="truncate text-xs text-muted-foreground">{playbook.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <PlaybookStatusPill status={playbook.status} lastRun={playbook.lastRun} />
        <Button variant="outline" size="xs" data-icon="inline-start">
          <Play />
          Run now
        </Button>
        <button
          type="button"
          aria-label={`More actions for ${playbook.name}`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover/row:opacity-100"
        >
          <MoreVertical className="size-4" />
        </button>
      </div>
    </li>
  );
}

function ManualLaunchCard({ playbook }: { playbook: Playbook }) {
  const tone = TONE_STYLES[playbook.tone];
  const Icon = playbook.icon;
  return (
    <article className="group/card relative flex items-start gap-3 overflow-hidden rounded-lg border border-border bg-card p-4 shadow-xs transition-all hover:-translate-y-[1px] hover:border-primary/40 hover:shadow-md">
      <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-lg', tone.bg)}>
        <Icon className={cn('size-5', tone.text)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="truncate text-sm font-semibold text-foreground">{playbook.name}</h3>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          {playbook.description}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="size-3" />
            Last run · {playbook.lastRun}
          </span>
          <Button size="xs" data-icon="inline-start">
            <Play />
            Run
          </Button>
        </div>
      </div>
    </article>
  );
}

function PlaybookStatusPill({
  status,
  lastRun,
}: {
  status: PlaybookStatus;
  lastRun: string;
}) {
  if (status === 'running') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-foreground">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        Running now
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-destructive">
        <XCircle className="size-3.5" />
        Failed · {lastRun}
      </span>
    );
  }
  if (status === 'paused') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
        <Pause className="size-3.5" />
        Paused
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
      <CheckCircle2 className="size-3.5 text-primary" />
      Last run · {lastRun}
    </span>
  );
}
