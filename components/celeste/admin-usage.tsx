'use client';

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Info,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Fragment, useState, type SVGProps } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MainTab = 'overview' | 'users';

const TIME_RANGES = [
  'Past 7 days',
  'Past 30 days',
  'Past 90 days',
  'Past 12 months',
  'All time',
] as const;
type TimeRange = (typeof TIME_RANGES)[number];

const ACTIVE_USERS_TREND = [58, 62, 60, 66, 72, 78, 82, 88, 90, 89, 92, 94];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

type UserTypeSlice = {
  label: string;
  value: number;
  count: number;
  color: string;
  delta: number;
};
const USER_TYPES: UserTypeSlice[] = [
  { label: 'Returning', value: 54, count: 51, color: '#20727e', delta: 21 },
  { label: 'New', value: 28, count: 26, color: '#4ea8a3', delta: 18 },
  { label: 'Inactive', value: 18, count: 17, color: '#d9d1c7', delta: -23 },
];

type UserPlaybookRun = { name: string; count: number; lastRun: string };
type UserRow = {
  name: string;
  department: string;
  lastSession: string;
  lastPlaybookRun: string;
  playbooks: number;
  sessions: number;
  playbooksRun: UserPlaybookRun[];
};

const USERS: UserRow[] = [
  {
    name: 'Pamela Torres',
    department: 'Business Development',
    lastSession: '06/25',
    lastPlaybookRun: '06/25',
    playbooks: 34,
    sessions: 48,
    playbooksRun: [
      { name: 'Deal Opportunity Summary', count: 12, lastRun: '06/25' },
      { name: 'Client Risk Assessment', count: 8, lastRun: '06/24' },
      { name: 'Matter Status Brief', count: 6, lastRun: '06/23' },
      { name: 'Engagement Letter Draft', count: 5, lastRun: '06/22' },
      { name: 'Competitive Intel Scan', count: 3, lastRun: '06/20' },
    ],
  },
  {
    name: 'Marcus Webb',
    department: 'Legal',
    lastSession: '06/25',
    lastPlaybookRun: '06/24',
    playbooks: 28,
    sessions: 41,
    playbooksRun: [
      { name: 'Engagement Letter Draft', count: 10, lastRun: '06/24' },
      { name: 'Matter Status Brief', count: 8, lastRun: '06/23' },
      { name: 'Client Risk Assessment', count: 6, lastRun: '06/22' },
      { name: 'Proposal Outline Builder', count: 4, lastRun: '06/20' },
    ],
  },
  {
    name: 'Sandra Liu',
    department: 'Finance',
    lastSession: '06/24',
    lastPlaybookRun: '06/23',
    playbooks: 19,
    sessions: 38,
    playbooksRun: [
      { name: 'Pipeline Funnel Report', count: 7, lastRun: '06/23' },
      { name: 'Deal Opportunity Summary', count: 6, lastRun: '06/22' },
      { name: 'BD Weekly Digest', count: 4, lastRun: '06/20' },
      { name: 'Key Account Snapshot', count: 2, lastRun: '06/18' },
    ],
  },
  {
    name: 'David Okafor',
    department: 'Strategy',
    lastSession: '06/24',
    lastPlaybookRun: '06/24',
    playbooks: 22,
    sessions: 35,
    playbooksRun: [
      { name: 'Competitive Intel Scan', count: 9, lastRun: '06/24' },
      { name: 'Deal Opportunity Summary', count: 6, lastRun: '06/23' },
      { name: 'BD Weekly Digest', count: 4, lastRun: '06/21' },
      { name: 'Key Account Snapshot', count: 3, lastRun: '06/19' },
    ],
  },
  {
    name: 'Rachel Kim',
    department: 'Marketing',
    lastSession: '06/23',
    lastPlaybookRun: '06/22',
    playbooks: 15,
    sessions: 29,
    playbooksRun: [
      { name: 'BD Weekly Digest', count: 6, lastRun: '06/22' },
      { name: 'Contact Relationship Map', count: 5, lastRun: '06/20' },
      { name: 'Competitive Intel Scan', count: 4, lastRun: '06/18' },
    ],
  },
  {
    name: 'James Harrington',
    department: 'Operations',
    lastSession: '06/23',
    lastPlaybookRun: '06/23',
    playbooks: 11,
    sessions: 27,
    playbooksRun: [
      { name: 'Pipeline Funnel Report', count: 5, lastRun: '06/23' },
      { name: 'Matter Status Brief', count: 4, lastRun: '06/20' },
      { name: 'Key Account Snapshot', count: 2, lastRun: '06/17' },
    ],
  },
  {
    name: 'Aisha Patel',
    department: 'HR',
    lastSession: '06/22',
    lastPlaybookRun: '06/21',
    playbooks: 9,
    sessions: 24,
    playbooksRun: [
      { name: 'Contact Relationship Map', count: 5, lastRun: '06/21' },
      { name: 'BD Weekly Digest', count: 3, lastRun: '06/18' },
      { name: 'Client Risk Assessment', count: 1, lastRun: '06/15' },
    ],
  },
  {
    name: 'Tom Nguyen',
    department: 'Business Development',
    lastSession: '06/22',
    lastPlaybookRun: '06/22',
    playbooks: 17,
    sessions: 22,
    playbooksRun: [
      { name: 'Deal Opportunity Summary', count: 8, lastRun: '06/22' },
      { name: 'Pipeline Funnel Report', count: 5, lastRun: '06/20' },
      { name: 'Key Account Snapshot', count: 4, lastRun: '06/18' },
    ],
  },
  {
    name: 'Lena Kovacs',
    department: 'Legal',
    lastSession: '06/21',
    lastPlaybookRun: '06/20',
    playbooks: 13,
    sessions: 20,
    playbooksRun: [
      { name: 'Engagement Letter Draft', count: 6, lastRun: '06/20' },
      { name: 'Client Risk Assessment', count: 4, lastRun: '06/18' },
      { name: 'Matter Status Brief', count: 3, lastRun: '06/16' },
    ],
  },
  {
    name: 'Brian Osei',
    department: 'Finance',
    lastSession: '06/20',
    lastPlaybookRun: '06/19',
    playbooks: 8,
    sessions: 18,
    playbooksRun: [
      { name: 'Deal Opportunity Summary', count: 4, lastRun: '06/19' },
      { name: 'Pipeline Funnel Report', count: 3, lastRun: '06/17' },
      { name: 'BD Weekly Digest', count: 1, lastRun: '06/14' },
    ],
  },
  {
    name: 'Maya Singh',
    department: 'Strategy',
    lastSession: '06/19',
    lastPlaybookRun: '06/18',
    playbooks: 6,
    sessions: 16,
    playbooksRun: [
      { name: 'Competitive Intel Scan', count: 4, lastRun: '06/18' },
      { name: 'Deal Opportunity Summary', count: 2, lastRun: '06/15' },
    ],
  },
  {
    name: 'Carlos Reyes',
    department: 'Marketing',
    lastSession: '06/18',
    lastPlaybookRun: '06/17',
    playbooks: 5,
    sessions: 15,
    playbooksRun: [
      { name: 'BD Weekly Digest', count: 3, lastRun: '06/17' },
      { name: 'Contact Relationship Map', count: 2, lastRun: '06/14' },
    ],
  },
  {
    name: 'Fiona Marsh',
    department: 'Operations',
    lastSession: '06/16',
    lastPlaybookRun: '06/16',
    playbooks: 4,
    sessions: 12,
    playbooksRun: [
      { name: 'Pipeline Funnel Report', count: 2, lastRun: '06/16' },
      { name: 'Matter Status Brief', count: 2, lastRun: '06/13' },
    ],
  },
  {
    name: 'Henry Zhu',
    department: 'HR',
    lastSession: '06/14',
    lastPlaybookRun: '06/13',
    playbooks: 3,
    sessions: 10,
    playbooksRun: [
      { name: 'Contact Relationship Map', count: 2, lastRun: '06/13' },
      { name: 'BD Weekly Digest', count: 1, lastRun: '06/10' },
    ],
  },
  {
    name: 'Olivia Grant',
    department: 'Business Development',
    lastSession: '06/11',
    lastPlaybookRun: '06/11',
    playbooks: 2,
    sessions: 8,
    playbooksRun: [
      { name: 'Deal Opportunity Summary', count: 1, lastRun: '06/11' },
      { name: 'Key Account Snapshot', count: 1, lastRun: '06/08' },
    ],
  },
];

type PlaybookRow = { name: string; runs: number; users: number };
const PLAYBOOKS: PlaybookRow[] = [
  { name: 'Deal Opportunity Summary', runs: 187, users: 61 },
  { name: 'Client Risk Assessment', runs: 154, users: 48 },
  { name: 'Matter Status Brief', runs: 132, users: 54 },
  { name: 'Engagement Letter Draft', runs: 118, users: 43 },
  { name: 'Competitive Intel Scan', runs: 97, users: 29 },
  { name: 'Pipeline Funnel Report', runs: 84, users: 35 },
  { name: 'Contact Relationship Map', runs: 76, users: 31 },
  { name: 'Proposal Outline Builder', runs: 61, users: 22 },
  { name: 'BD Weekly Digest', runs: 52, users: 18 },
  { name: 'Key Account Snapshot', runs: 47, users: 15 },
];

export function AdminUsage() {
  const [tab, setTab] = useState<MainTab>('overview');
  const [range, setRange] = useState<TimeRange>('Past 30 days');
  const [topPlaybooksMode, setTopPlaybooksMode] = useState<'runs' | 'users'>('runs');
  const [topUsersMode, setTopUsersMode] = useState<'playbooks' | 'sessions'>('playbooks');
  const [source, setSource] = useState<'firm' | 'dealcloud' | 'time'>('firm');

  return (
    <TooltipProvider delayDuration={150}>
    <div className="flex w-full max-w-[1140px] flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl leading-tight font-semibold text-foreground">
          Firm Usage
        </h1>
        <p className="font-serif text-sm leading-5 text-muted-foreground">
          Celeste AI activity across your firm
        </p>
      </header>

      <div className="flex justify-center">
        <MainTabs value={tab} onChange={setTab} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" data-icon="inline-start">
              <Clock />
              {range}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {TIME_RANGES.map((opt) => (
              <DropdownMenuItem key={opt} onClick={() => setRange(opt)}>
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <SourceTags value={source} onChange={setSource} />
        <Button size="sm" data-icon="inline-start" className="ml-auto">
          <Download />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ActiveUsersCard trend={ACTIVE_USERS_TREND} />
        <UserTypesCard slices={USER_TYPES} />
      </div>

      {tab === 'overview' ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <KpiCard
              label="Total chats"
              value="1,247"
              trend="+12% vs last period"
              icon={Clock}
              hint="Total number of chat sessions started across your firm in the selected period. Each new conversation counts as one chat."
            />
            <KpiCard
              label="Playbook runs"
              value="389"
              trend="+41% vs last period"
              icon={Zap}
              hint="Total number of playbook executions across your firm in the selected period, including scheduled, event-triggered, and manual runs."
            />
          </div>

          <TopPlaybooks
            rows={PLAYBOOKS}
            mode={topPlaybooksMode}
            onModeChange={setTopPlaybooksMode}
          />

          <AllPlaybooks rows={PLAYBOOKS} />
        </>
      ) : (
        <>
          <TopUsers rows={USERS} mode={topUsersMode} onModeChange={setTopUsersMode} />
          <AllUsers rows={USERS} />
        </>
      )}
    </div>
    </TooltipProvider>
  );
}

function MainTabs({
  value,
  onChange,
}: {
  value: MainTab;
  onChange: (v: MainTab) => void;
}) {
  const tabs: { value: MainTab; label: string }[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'users', label: 'Users' },
  ];
  return (
    <div
      role="tablist"
      aria-label="Usage view"
      className="inline-flex h-9 items-center rounded-md bg-accent p-1"
    >
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          data-active={value === t.value || undefined}
          className="flex h-7 min-w-[96px] items-center justify-center rounded px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function InfoHint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="What is this?"
          className="flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[260px] text-xs leading-5">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

type SourceTag = 'firm' | 'dealcloud' | 'time';

function SourceTags({
  value,
  onChange,
}: {
  value: SourceTag;
  onChange: (v: SourceTag) => void;
}) {
  const tags: { value: SourceTag; label: string }[] = [
    { value: 'firm', label: 'Celeste for the firm' },
    { value: 'dealcloud', label: 'DealCloud' },
    { value: 'time', label: 'Time' },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          data-active={value === t.value || undefined}
          className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent/70 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  trend: string;
  icon: typeof Clock;
  hint: string;
}) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-xs">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium tracking-wide text-foreground uppercase">
            {label}
          </span>
          <InfoHint text={hint} />
        </div>
        <span className="flex size-9 items-center justify-center rounded-md bg-[#e8f1f2] text-primary">
          <Icon className="size-5" />
        </span>
      </header>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-3xl leading-none font-semibold tabular-nums text-foreground">
          {value}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-primary">
          <TrendingUp className="size-3" />
          {trend}
        </span>
      </div>
    </section>
  );
}

function ActiveUsersCard({ trend }: { trend: number[] }) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-xs">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium tracking-wide text-foreground uppercase">
            Active users
          </span>
          <InfoHint text="Unique users who started at least one chat or ran at least one playbook during the selected period." />
        </div>
        <span className="flex size-9 items-center justify-center rounded-md bg-[#e8f1f2] text-primary">
          <Users className="size-5" />
        </span>
      </header>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-3xl leading-none font-semibold tabular-nums text-foreground">
          94
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-primary">
          <TrendingUp className="size-3" />
          +21% vs last period
        </span>
      </div>
      <LineChart data={trend} className="mt-1 h-16" />
      <div className="flex justify-between px-1 text-[10px] text-muted-foreground">
        {MONTH_LABELS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </section>
  );
}

function LineChart({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const w = 400;
  const h = 96;
  const padX = 4;
  const padY = 8;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * (w - 2 * padX);
    const y = h - padY - ((v - min) / range) * (h - 2 * padY);
    return [x, y] as const;
  });
  const line = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');
  const fill = `${line} L${w - padX} ${h} L${padX} ${h} Z`;
  const gradientId = `usage-line-gradient-${data.length}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('w-full', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20727e" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#20727e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradientId})`} />
      <path
        d={line}
        stroke="#20727e"
        strokeWidth="1.75"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function UserTypesCard({ slices }: { slices: UserTypeSlice[] }) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-xs">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium tracking-wide text-foreground uppercase">
            User types
          </span>
          <InfoHint text="How active users break down: Returning have used Celeste before this period, New activated for the first time, Inactive are eligible users who never started a session this period." />
        </div>
        <span className="flex size-9 items-center justify-center rounded-md bg-[#e8f1f2] text-primary">
          <UsersThreeIcon className="size-5" />
        </span>
      </header>
      <div className="flex flex-1 items-center gap-5">
        <UserTypesDonut slices={slices} size={132} />
        <ul className="flex flex-1 flex-col gap-1.5">
          {slices.map((s) => (
            <li key={s.label} className="flex items-center gap-6 text-sm">
              <div className="flex w-[100px] items-center gap-2.5">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-muted-foreground">{s.label}</span>
              </div>
              <span className="w-8 text-right font-semibold tabular-nums text-foreground">
                {s.value}%
              </span>
              <span className="w-5 text-right tabular-nums text-muted-foreground">
                {s.count}
              </span>
              <TrendDelta delta={s.delta} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TrendDelta({ delta }: { delta: number }) {
  if (delta === 0) return null;
  const up = delta > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 text-xs tabular-nums',
        up ? 'text-primary' : 'text-destructive',
      )}
    >
      <Icon className="size-3.5" />
      {up ? '+' : ''}
      {delta}%
    </span>
  );
}

function UserTypesDonut({ slices, size = 128 }: { slices: UserTypeSlice[]; size?: number }) {
  const cx = 50;
  const cy = 50;
  const radius = 42;
  const strokeWidth = 12;
  let startAngle = -90; // begin at top of circle (12 o'clock)
  const arcs = slices.map((s) => {
    const sweep = (s.value / 100) * 360;
    const endAngle = startAngle + sweep;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArc = sweep > 180 ? 1 : 0;
    const d = `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;
    startAngle = endAngle;
    return { d, color: s.color, label: s.label };
  });
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full">
        <circle cx={cx} cy={cy} r={radius} stroke="#f4ede6" strokeWidth={strokeWidth} fill="none" />
        {arcs.map((a) => (
          <path
            key={a.label}
            d={a.d}
            stroke={a.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="butt"
          />
        ))}
      </svg>
    </div>
  );
}

function TopPlaybooks({
  rows,
  mode,
  onModeChange,
}: {
  rows: PlaybookRow[];
  mode: 'runs' | 'users';
  onModeChange: (m: 'runs' | 'users') => void;
}) {
  const sorted = [...rows].sort((a, b) => b[mode] - a[mode]);
  const max = Math.max(...sorted.map((r) => r[mode]));
  const axisMax = Math.ceil(max / 50) * 50;
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-xs">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-medium tracking-wide text-foreground uppercase">
              Top playbooks
            </h2>
            <InfoHint text="The ten most-used playbooks in the selected period. Toggle to rank by total runs or by the count of unique users who ran each playbook." />
          </div>
          <p className="text-xs text-muted-foreground">
            {mode === 'runs' ? 'by total number of runs' : 'by runs by unique users'}
          </p>
        </div>
        <PillToggle
          value={mode}
          onChange={onModeChange}
          options={[
            { value: 'runs', label: 'Total runs' },
            { value: 'users', label: 'By unique users' },
          ]}
        />
      </header>
      <div className="flex flex-col gap-2">
        {sorted.map((row) => {
          const width = (row[mode] / axisMax) * 100;
          return (
            <div key={row.name} className="grid grid-cols-[168px_44px_minmax(0,1fr)] items-center gap-3">
              <span className="truncate text-xs text-muted-foreground" title={row.name}>
                {row.name}
              </span>
              <span className="text-right text-xs font-semibold tabular-nums text-foreground">
                {row[mode]}
              </span>
              <div className="relative h-4">
                <div className="absolute inset-y-0 left-0 flex items-center" style={{ width: `${width}%` }}>
                  <div className="h-full w-full rounded-r-sm bg-primary/80" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-[168px_44px_minmax(0,1fr)] items-center gap-3 border-t border-border pt-2">
        <span />
        <span />
        <div className="grid grid-cols-5 text-[10px] text-muted-foreground">
          {[0, Math.round(axisMax / 4), Math.round(axisMax / 2), Math.round((axisMax * 3) / 4), axisMax].map(
            (t, i) => (
              <span key={t} className={i === 4 ? 'text-right' : ''}>
                {t}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

type PlaybookSortCol = 'name' | 'runs' | 'users';

function AllPlaybooks({ rows }: { rows: PlaybookRow[] }) {
  const [query, setQuery] = useState('');
  const [sortCol, setSortCol] = useState<PlaybookSortCol>('runs');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const q = query.trim().toLowerCase();
  const filtered = q ? rows.filter((r) => r.name.toLowerCase().includes(q)) : rows;
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortCol];
    const bVal = b[sortCol];
    let cmp: number;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).localeCompare(String(bVal));
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });
  const handleSort = (col: PlaybookSortCol) => {
    if (col === sortCol) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir(col === 'name' ? 'asc' : 'desc');
    }
  };
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-xs">
      <header className="flex items-start justify-between gap-3">
        <h2 className="text-xs font-medium tracking-wide text-foreground uppercase">
          All playbooks
        </h2>
      </header>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search playbooks"
          aria-label="Search playbooks"
          className="h-9 rounded-md bg-background pl-8 text-sm text-foreground placeholder:text-foreground/60"
        />
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-sm text-foreground">
          <thead>
            <tr className="h-10 border-b border-border bg-background/40 text-[10px] font-normal uppercase tracking-wide text-foreground">
              <th className="w-10 px-3" aria-label="Rank" />
              <th className="px-3">
                <SortHeader
                  col="name"
                  activeCol={sortCol}
                  dir={sortDir}
                  onSort={handleSort}
                  align="left"
                >
                  Playbook
                </SortHeader>
              </th>
              <th className="w-28 px-3 text-center">
                <SortHeader
                  col="runs"
                  activeCol={sortCol}
                  dir={sortDir}
                  onSort={handleSort}
                  align="center"
                >
                  Runs
                </SortHeader>
              </th>
              <th className="w-32 px-3 text-center">
                <SortHeader
                  col="users"
                  activeCol={sortCol}
                  dir={sortDir}
                  onSort={handleSort}
                  align="center"
                >
                  Unique users
                </SortHeader>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={row.name}
                className="h-11 border-t border-border transition-colors hover:bg-accent"
              >
                <td className="px-3 text-right text-xs tabular-nums text-foreground">
                  {i + 1}
                </td>
                <td className="px-3 text-sm font-normal text-foreground">{row.name}</td>
                <td className="px-3 text-center text-sm font-normal tabular-nums text-foreground">
                  {row.runs}
                </td>
                <td className="px-3 text-center text-sm font-normal tabular-nums text-foreground">
                  {row.users}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PillToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex h-8 items-center rounded-md bg-accent p-[3px]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          data-active={value === o.value || undefined}
          className="flex h-[26px] items-center justify-center rounded px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function TopUsers({
  rows,
  mode,
  onModeChange,
}: {
  rows: UserRow[];
  mode: 'playbooks' | 'sessions';
  onModeChange: (m: 'playbooks' | 'sessions') => void;
}) {
  const sorted = [...rows].sort((a, b) => b[mode] - a[mode]).slice(0, 10);
  const max = Math.max(...sorted.map((r) => r[mode]));
  const step = mode === 'playbooks' ? 10 : 15;
  const axisMax = Math.max(step, Math.ceil(max / step) * step);
  const ticks = [0, Math.round(axisMax / 4), Math.round(axisMax / 2), Math.round((axisMax * 3) / 4), axisMax];
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-xs">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-medium tracking-wide text-foreground uppercase">
              Top users
            </h2>
            <InfoHint text="The ten most active users in the selected period. Toggle to rank by playbook runs or by number of chats started." />
          </div>
          <p className="text-xs text-muted-foreground">
            by {mode === 'playbooks' ? 'playbook runs' : 'chats'}
          </p>
        </div>
        <PillToggle
          value={mode}
          onChange={onModeChange}
          options={[
            { value: 'playbooks', label: 'Playbook runs' },
            { value: 'sessions', label: 'Chats' },
          ]}
        />
      </header>
      <div className="flex flex-col gap-2">
        {sorted.map((row) => {
          const width = (row[mode] / axisMax) * 100;
          return (
            <div key={row.name} className="grid grid-cols-[140px_36px_minmax(0,1fr)] items-center gap-3">
              <span className="truncate text-xs text-muted-foreground" title={row.name}>
                {row.name}
              </span>
              <span className="text-right text-xs font-semibold tabular-nums text-foreground">
                {row[mode]}
              </span>
              <div className="relative h-4">
                <div className="absolute inset-y-0 left-0 flex items-center" style={{ width: `${width}%` }}>
                  <div className="h-full w-full rounded-r-sm bg-primary/80" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-[140px_36px_minmax(0,1fr)] items-center gap-3 border-t border-border pt-2">
        <span />
        <span />
        <div className="grid grid-cols-5 text-[10px] text-muted-foreground">
          {ticks.map((t, i) => (
            <span key={t} className={i === ticks.length - 1 ? 'text-right' : ''}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

type SortCol = 'name' | 'playbooks' | 'lastPlaybookRun' | 'sessions' | 'lastSession';
type SortDir = 'asc' | 'desc';

function AllUsers({ rows }: { rows: UserRow[] }) {
  const [query, setQuery] = useState('');
  const [sortCol, setSortCol] = useState<SortCol>('playbooks');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleExpanded = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  const q = query.trim().toLowerCase();
  const filtered = q
    ? rows.filter(
        (r) => r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q),
      )
    : rows;
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortCol];
    const bVal = b[sortCol];
    let cmp: number;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).localeCompare(String(bVal));
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });
  const handleSort = (col: SortCol) => {
    if (col === sortCol) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir(col === 'name' ? 'asc' : 'desc');
    }
  };
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-xs">
      <header className="flex items-start justify-between gap-3">
        <h2 className="text-xs font-medium tracking-wide text-foreground uppercase">
          All users
        </h2>
      </header>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or departments"
          aria-label="Search users or departments"
          className="h-9 rounded-md bg-background pl-8 text-sm text-foreground placeholder:text-foreground/60"
        />
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-sm text-foreground">
          <thead>
            <tr className="h-10 border-b border-border bg-background/40 text-[10px] font-normal uppercase tracking-wide text-foreground">
              <th className="w-10 px-3" aria-label="Rank" />
              <th className="px-3">
                <SortHeader
                  col="name"
                  activeCol={sortCol}
                  dir={sortDir}
                  onSort={handleSort}
                  align="left"
                >
                  User
                </SortHeader>
              </th>
              <th className="w-32 px-3 text-center">
                <SortHeader
                  col="playbooks"
                  activeCol={sortCol}
                  dir={sortDir}
                  onSort={handleSort}
                  align="center"
                >
                  Playbook runs
                </SortHeader>
              </th>
              <th className="w-40 px-3 text-center">
                <SortHeader
                  col="lastPlaybookRun"
                  activeCol={sortCol}
                  dir={sortDir}
                  onSort={handleSort}
                  align="center"
                >
                  Last playbook run
                </SortHeader>
              </th>
              <th className="w-24 px-3 text-center">
                <SortHeader
                  col="sessions"
                  activeCol={sortCol}
                  dir={sortDir}
                  onSort={handleSort}
                  align="center"
                >
                  Chats
                </SortHeader>
              </th>
              <th className="w-28 px-3 text-center">
                <SortHeader
                  col="lastSession"
                  activeCol={sortCol}
                  dir={sortDir}
                  onSort={handleSort}
                  align="center"
                >
                  Last chat
                </SortHeader>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const isOpen = expanded.has(row.name);
              return (
                <Fragment key={row.name}>
                  <tr
                    className="h-12 border-t border-border transition-colors hover:bg-accent"
                  >
                    <td className="px-3 text-right text-xs tabular-nums text-foreground">
                      {i + 1}
                    </td>
                    <td className="px-3">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(row.name)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-2 text-left"
                      >
                        {isOpen ? (
                          <ChevronDown className="size-3.5 shrink-0 text-foreground" />
                        ) : (
                          <ChevronRight className="size-3.5 shrink-0 text-foreground" />
                        )}
                        <div className="flex min-w-0 flex-col leading-tight">
                          <span className="truncate text-sm font-normal text-foreground group-hover:underline">
                            {row.name}
                          </span>
                          <span className="truncate text-xs font-normal text-foreground">
                            {row.department}
                          </span>
                        </div>
                      </button>
                    </td>
                    <td className="px-3 text-center text-sm font-normal tabular-nums text-foreground">
                      {row.playbooks}
                    </td>
                    <td className="px-3 text-center text-sm font-normal tabular-nums text-foreground">
                      {row.lastPlaybookRun}
                    </td>
                    <td className="px-3 text-center text-sm font-normal tabular-nums text-foreground">
                      {row.sessions}
                    </td>
                    <td className="px-3 text-center text-sm font-normal tabular-nums text-foreground">
                      {row.lastSession}
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr className="border-t border-border bg-background/40">
                      <td colSpan={6} className="px-3 py-3">
                        <div className="ml-[62px] flex flex-col gap-2">
                          <table className="w-full max-w-[520px] text-left text-sm">
                            <thead>
                              <tr className="text-[10px] font-normal uppercase tracking-wide text-foreground/70">
                                <th className="pb-1.5 pr-3 font-normal">Playbooks used</th>
                                <th className="pb-1.5 px-3 text-center font-normal">Runs</th>
                                <th className="pb-1.5 pl-3 text-center font-normal">Last run</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.playbooksRun.map((pb) => (
                                <tr key={pb.name} className="border-t border-border/60">
                                  <td className="py-1.5 pr-3 text-sm font-normal text-foreground">
                                    {pb.name}
                                  </td>
                                  <td className="py-1.5 px-3 text-center text-sm font-normal tabular-nums text-foreground">
                                    {pb.count}
                                  </td>
                                  <td className="py-1.5 pl-3 text-center text-sm font-normal tabular-nums text-foreground">
                                    {pb.lastRun}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SortHeader<T extends string>({
  col,
  activeCol,
  dir,
  onSort,
  align = 'right',
  children,
}: {
  col: T;
  activeCol: T;
  dir: SortDir;
  onSort: (col: T) => void;
  align?: 'left' | 'right' | 'center';
  children: React.ReactNode;
}) {
  const active = col === activeCol;
  const Icon = active ? (dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(col)}
      className={cn(
        'inline-flex w-full items-center gap-1 whitespace-nowrap text-[10px] font-normal uppercase tracking-wide text-foreground transition-opacity hover:opacity-70',
        align === 'right'
          ? 'justify-end flex-row-reverse'
          : align === 'center'
            ? 'justify-center'
            : 'justify-start',
      )}
    >
      <Icon className={cn('size-3 shrink-0', active ? 'opacity-100' : 'opacity-40')} />
      <span>{children}</span>
    </button>
  );
}

function UsersThreeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M192,120a59.91,59.91,0,0,1,48,24" />
      <path d="M16,144a59.91,59.91,0,0,1,48-24" />
      <circle cx="128" cy="144" r="40" />
      <path d="M72,216a65,65,0,0,1,112,0" />
      <path d="M161,80a32,32,0,1,1,31,40" />
      <path d="M64,120A32,32,0,1,1,95,80" />
    </svg>
  );
}
