'use client';

import {
  AlertCircle,
  ArrowUpRight,
  ChevronDown,
  CirclePlay,
  Clock,
  LayoutGrid,
  MoreVertical,
  Pencil,
  Play,
  Plus,
  Search,
  Tag,
  Table as TableIcon,
  Upload,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SamplePlaybook = {
  id: string;
  title: string;
  description: string;
  editedAt: string;
  automation?: boolean;
  hasError?: boolean;
};

const SAMPLE_PLAYBOOKS: SamplePlaybook[] = [
  {
    id: 'pb-1',
    title: 'Update Job Title for All "Devasha" Contacts',
    description:
      'Search DealCloud for all contacts named "Devasha", then update their job title to "potter" in parallel across all matched records...',
    editedAt: 'Jun 22, 2026, 9:19 PM',
    automation: true,
  },
  {
    id: 'pb-2',
    title: 'Three-Step Coffee Making Guide',
    description:
      'Ask the user for confirmation before proceeding, then deliver a concise three-step coffee making guide.',
    editedAt: 'Jun 19, 2026, 7:20 PM',
    automation: true,
  },
  {
    id: 'pb-3',
    title: 'Create New Intake Request and Share',
    description:
      'Extract information from emails, verify client existence in the system, select appropriate workflow type based on learned preferences,...',
    editedAt: 'Jun 16, 2026, 10:02 AM',
  },
  {
    id: 'pb-4',
    title: "Query Today's Calendar via Microsoft 365",
    description:
      'Use the M365 connector to retrieve all calendar events for today (June 16, 2026) and present a structured daily schedule summary.',
    editedAt: 'Jun 16, 2026, 9:31 AM',
  },
  {
    id: 'pb-5',
    title: 'Create New Deal Records Under Intapp i...',
    description:
      'Collect deal details from the user, resolve the Intapp company record in DealCloud, validate the payload, and create the new deal record linked t...',
    editedAt: 'Jun 15, 2026, 1:21 PM',
  },
  {
    id: 'pb-6',
    title: 'Outlook-to-DealCloud Email Analysis & D...',
    description:
      'Retrieve emails synced from Outlook into DealCloud, extract key deal, contact, and fundraise signals, and surface actionable CRM...',
    editedAt: 'Jun 15, 2026, 12:40 PM',
    automation: true,
  },
  {
    id: 'pb-7',
    title: 'Signal Event Triage and RM Briefing Play...',
    description:
      'Discovers active signal events from EventHub, lets the RM select an event type, enriches each event with DealCloud pipeline context and web...',
    editedAt: 'Jun 12, 2026, 5:46 PM',
  },
  {
    id: 'pb-8',
    title: 'sveta-Multi-Source Deal Sourcing and Tr...',
    description:
      'Systematically source companies from web, Intapp Graph, and DealCloud, then filter and rank candidates based on transactibility readiness...',
    editedAt: 'Jun 12, 2026, 4:02 PM',
  },
  {
    id: 'pb-9',
    title: 'Signal Event Triage and RM Briefing P...',
    description:
      'Discovers active signal events from EventHub, enriches each with DealCloud pipeline context and web research, and produces a structured on...',
    editedAt: 'Jun 12, 2026, 3:15 PM',
    hasError: true,
  },
];

export function PlaybooksEmpty() {
  return (
    <div className="flex w-full max-w-[1140px] flex-col gap-10">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-2xl leading-tight font-semibold text-foreground">
          Playbooks
        </h1>
        <Button size="sm" data-icon="inline-start" asChild>
          <Link href="/playbooks?view=ongoing">
            <Plus />
            New playbook
          </Link>
        </Button>
      </header>

      <section className="flex flex-col items-center gap-5 rounded-2xl bg-accent/30 px-6 py-12 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-card shadow-sm">
          <CirclePlay className="size-7 text-primary" />
        </span>
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="font-serif text-3xl leading-tight font-semibold text-foreground">
            Set up your first Playbook
          </h2>
          <p className="font-serif text-base leading-6 text-muted-foreground">
            Playbooks are AI agents you assemble once and let run. They can run on
            a recurring schedule, fire in response to a system event, or wait for
            you to kick them off — turning the analyst work you do every week into
            something Celeste handles in the background.
          </p>
        </div>
        <Button size="lg" data-icon="inline-start" asChild>
          <Link href="/playbooks?view=ongoing">
            <Plus />
            New playbook
          </Link>
        </Button>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Get started with one of these
          </h3>
          <span className="text-xs text-muted-foreground">
            Pick a trigger to scaffold your first Playbook
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

      <section className="flex flex-col gap-4 pt-2">
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mine">My Playbooks</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap text-foreground">
              65 Playbooks
            </span>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search playbooks..."
                aria-label="Search playbooks"
                className="h-8 rounded-lg bg-card pl-8 text-sm"
              />
            </div>
            <ToolbarIconButton icon={Tag} label="Filter by tag" />
            <div className="flex h-8 items-center rounded-md border border-border bg-card p-0.5">
              <ToolbarToggle icon={LayoutGrid} active label="Grid view" />
              <ToolbarToggle icon={TableIcon} label="Table view" />
            </div>
            <ToolbarIconButton icon={Upload} label="Export" />
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-3 gap-3">
            {SAMPLE_PLAYBOOKS.map((p) => (
              <SamplePlaybookCard key={p.id} playbook={p} />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-background/75 to-background"
          />
        </div>

        <div className="flex justify-center pt-2 pb-4">
          <Link
            href="/playbooks?view=ongoing"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all 65 playbooks
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </section>
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
      href="/playbooks?view=ongoing"
      className="group/card flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-[1px] hover:border-primary/40 hover:shadow-md"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className={`size-5 ${iconText}`} />
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {kicker}
        </span>
        <h4 className="font-serif text-lg leading-tight font-semibold text-foreground">
          {title}
        </h4>
        <p className="text-sm leading-5 text-muted-foreground">{example}</p>
      </div>
      <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors group-hover/card:underline">
        {cta}
        <ArrowUpRight className="size-3" />
      </span>
    </Link>
  );
}

function ToolbarIconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Icon className="size-4" />
    </button>
  );
}

function ToolbarToggle({
  icon: Icon,
  label,
  active,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-active={active || undefined}
      className={cn(
        'flex h-7 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground',
        'data-[active=true]:bg-accent data-[active=true]:text-foreground',
      )}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

function SamplePlaybookCard({ playbook }: { playbook: SamplePlaybook }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-xs">
      <header className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-2 text-sm leading-5 font-semibold text-foreground">
          {playbook.title}
        </h4>
        <div className="flex shrink-0 items-center gap-1">
          {playbook.hasError ? (
            <AlertCircle className="size-4 text-destructive" />
          ) : null}
          <button
            type="button"
            aria-label={`More actions for ${playbook.title}`}
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </header>

      {playbook.automation ? (
        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-primary/20 bg-primary/[0.06] px-2 py-0.5 text-[11px] font-medium text-primary">
          <Zap className="size-3" />
          Automation (1)
        </span>
      ) : null}

      <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
        {playbook.description}
      </p>

      <p className="text-[11px] text-muted-foreground">Edited: {playbook.editedAt}</p>

      <div className="flex items-center gap-1.5">
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
      </div>
    </article>
  );
}
