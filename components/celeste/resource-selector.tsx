'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, LogIn, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import {
  filterByQuery,
  getResourcesByKind,
  type Resource,
  type ResourceKind,
  type Selection,
} from './context-resources';

type TabSpec = { kind: ResourceKind; label: string };

const TABS: TabSpec[] = [
  { kind: 'connectors', label: 'Connectors' },
  { kind: 'hubs', label: 'Knowledge Hubs' },
  { kind: 'spaces', label: 'Spaces' },
];

/** Available sort orders applied to the "All" section of each tab. */
type SortOrder = 'a-z' | 'z-a';

const SORT_OPTIONS: { id: SortOrder; label: string; icon: typeof ArrowDownAZ }[] = [
  { id: 'a-z', label: 'A → Z', icon: ArrowDownAZ },
  { id: 'z-a', label: 'Z → A', icon: ArrowUpAZ },
];

function sortResources(items: Resource[], order: SortOrder): Resource[] {
  const cmp =
    order === 'a-z'
      ? (a: Resource, b: Resource) => a.label.localeCompare(b.label)
      : (a: Resource, b: Resource) => b.label.localeCompare(a.label);
  return [...items].sort(cmp);
}

export type ResourceSelectorProps = {
  selection: Selection;
  onToggle: (kind: ResourceKind, id: string) => void;
  authorizedConnectorIds: Set<string>;
  onAuthenticateConnector: (id: string) => void;
};

/**
 * Contents of the Popover that opens when the connector pucks are clicked.
 *
 * Two display modes:
 *   • **Browse** (empty query): tabbed view. Each tab shows its own
 *     "Recently used" + "All" sections, with a sort control next to the
 *     "All" subheader (A→Z / Z→A).
 *   • **Search** (active query): tabs collapse into a single scrolling list
 *     with category headers (Connectors → Knowledge Hubs → Spaces). Only
 *     categories with matches render their header.
 *
 * Connectors render a brand SVG logo on the left of each row; Knowledge
 * Hubs and Spaces do not.
 */
export function ResourceSelector({
  selection,
  onToggle,
  authorizedConnectorIds,
  onAuthenticateConnector,
}: ResourceSelectorProps) {
  const [query, setQuery] = useState('');
  // Sort applies globally across tabs so it doesn't reset as the user
  // hops between Connectors / Knowledge Hubs / Spaces.
  const [sortOrder, setSortOrder] = useState<SortOrder>('a-z');

  const filtered = useMemo(
    () =>
      ({
        connectors: filterByQuery(getResourcesByKind('connectors'), query),
        hubs: filterByQuery(getResourcesByKind('hubs'), query),
        spaces: filterByQuery(getResourcesByKind('spaces'), query),
      }) satisfies Record<ResourceKind, Resource[]>,
    [query]
  );

  const queryActive = query.trim().length > 0;

  return (
    <div className="flex w-[440px] flex-col">
      {/* Search bar — searches across all tabs */}
      <div className="border-b border-border p-2">
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all"
            className="pl-8"
            aria-label="Search resources"
          />
        </div>
      </div>

      {queryActive ? (
        <UnifiedSearchResults
          filtered={filtered}
          selection={selection}
          onToggle={onToggle}
          authorizedConnectorIds={authorizedConnectorIds}
          onAuthenticateConnector={onAuthenticateConnector}
          sortOrder={sortOrder}
        />
      ) : (
        <TabbedBrowse
          selection={selection}
          onToggle={onToggle}
          authorizedConnectorIds={authorizedConnectorIds}
          onAuthenticateConnector={onAuthenticateConnector}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sort control                                                               */
/* -------------------------------------------------------------------------- */

function SortMenu({
  value,
  onChange,
}: {
  value: SortOrder;
  onChange: (next: SortOrder) => void;
}) {
  const active = SORT_OPTIONS.find((opt) => opt.id === value)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Sort"
        >
          <span>Sort: {active.label}</span>
          <ChevronDown className="size-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {SORT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <DropdownMenuItem
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className="text-sm"
            >
              <Icon className="size-3.5" />
              {opt.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* -------------------------------------------------------------------------- */
/* Browse mode — pill tabs                                                    */
/* -------------------------------------------------------------------------- */

function TabbedBrowse({
  selection,
  onToggle,
  authorizedConnectorIds,
  onAuthenticateConnector,
  sortOrder,
  onSortChange,
}: {
  selection: Selection;
  onToggle: (kind: ResourceKind, id: string) => void;
  authorizedConnectorIds: Set<string>;
  onAuthenticateConnector: (id: string) => void;
  sortOrder: SortOrder;
  onSortChange: (next: SortOrder) => void;
}) {
  return (
    <Tabs defaultValue="connectors" className="gap-0">
      <div className="px-2 pt-2 pb-2">
        <TabsList className="grid h-9 w-full grid-cols-3 gap-1 rounded-full border border-border bg-secondary/70 p-0.5">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.kind}
              value={tab.kind}
              className={cn(
                'rounded-full px-3 text-sm font-medium text-muted-foreground transition-all',
                'hover:text-foreground',
                'data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold',
                'data-[state=active]:border-border',
                'data-[state=active]:shadow-[0_1px_2px_rgba(41,34,33,0.08),0_2px_6px_rgba(41,34,33,0.06)]'
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {TABS.map((tab) => (
        <TabsContent
          key={tab.kind}
          value={tab.kind}
          className="max-h-96 overflow-y-auto p-2"
        >
          <BrowseList
            kind={tab.kind}
            selectedIds={selection[tab.kind]}
            onToggle={onToggle}
            authorizedConnectorIds={authorizedConnectorIds}
            onAuthenticateConnector={onAuthenticateConnector}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function BrowseList({
  kind,
  selectedIds,
  onToggle,
  authorizedConnectorIds,
  onAuthenticateConnector,
  sortOrder,
  onSortChange,
}: {
  kind: ResourceKind;
  selectedIds: Set<string>;
  onToggle: (kind: ResourceKind, id: string) => void;
  authorizedConnectorIds: Set<string>;
  onAuthenticateConnector: (id: string) => void;
  sortOrder: SortOrder;
  onSortChange: (next: SortOrder) => void;
}) {
  const all = getResourcesByKind(kind);
  const recents = all.filter((r) => r.recent);
  const rest = useMemo(
    () => sortResources(all.filter((r) => !r.recent), sortOrder),
    [all, sortOrder]
  );

  const renderRow = (item: Resource) => (
    <Row
      key={item.id}
      resource={item}
      kind={kind}
      selected={selectedIds.has(item.id)}
      isConnectorAuthorized={
        kind !== 'connectors' || authorizedConnectorIds.has(item.id)
      }
      onToggle={() => onToggle(kind, item.id)}
      onAuthenticate={() => onAuthenticateConnector(item.id)}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      {recents.length > 0 ? (
        <Section title="Recently used">{recents.map(renderRow)}</Section>
      ) : null}

      {rest.length > 0 ? (
        <Section
          title={recents.length > 0 ? 'All' : undefined}
          trailing={<SortMenu value={sortOrder} onChange={onSortChange} />}
        >
          {rest.map(renderRow)}
        </Section>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Search mode — unified scrolling list grouped by category                   */
/* -------------------------------------------------------------------------- */

function UnifiedSearchResults({
  filtered,
  selection,
  onToggle,
  authorizedConnectorIds,
  onAuthenticateConnector,
  sortOrder,
}: {
  filtered: Record<ResourceKind, Resource[]>;
  selection: Selection;
  onToggle: (kind: ResourceKind, id: string) => void;
  authorizedConnectorIds: Set<string>;
  onAuthenticateConnector: (id: string) => void;
  sortOrder: SortOrder;
}) {
  const sectionsWithMatches = TABS.filter((tab) => filtered[tab.kind].length > 0);
  const totalMatches = sectionsWithMatches.reduce(
    (sum, tab) => sum + filtered[tab.kind].length,
    0
  );

  if (totalMatches === 0) {
    return (
      <p className="px-2 py-10 text-center text-sm text-muted-foreground">
        No matches.
      </p>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto p-2">
      <div className="flex flex-col gap-4">
        {sectionsWithMatches.map((tab) => (
          <Section key={tab.kind} title={tab.label}>
            {sortResources(filtered[tab.kind], sortOrder).map((item) => (
              <Row
                key={item.id}
                resource={item}
                kind={tab.kind}
                selected={selection[tab.kind].has(item.id)}
                isConnectorAuthorized={
                  tab.kind !== 'connectors' || authorizedConnectorIds.has(item.id)
                }
                onToggle={() => onToggle(tab.kind, item.id)}
                onAuthenticate={() => onAuthenticateConnector(item.id)}
              />
            ))}
          </Section>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  trailing,
  children,
}: {
  title?: string;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {title || trailing ? (
        <div className="flex items-center justify-between gap-2 px-2 pt-1 pb-1">
          {title ? (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
          ) : (
            <span />
          )}
          {trailing}
        </div>
      ) : null}
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

/**
 * One row in the resource list. Layout: [logo] → label/description → action.
 *
 * Only Connectors render a logo (the brand SVG). Knowledge Hubs and Spaces
 * don't get one — the dropdown leans on the category header above to convey
 * what kind they are.
 *
 * The action slot is either:
 *   • a toggle Switch (the default), or
 *   • an "Authenticate" Button when this is a Connector whose
 *     `isConnectorAuthorized` flag is false.
 *
 * Authorized rows are entirely clickable — clicking anywhere flips the
 * Switch. Unauthorized rows are not clickable; only the Authenticate
 * button responds.
 */
function Row({
  resource,
  kind,
  selected,
  isConnectorAuthorized,
  onToggle,
  onAuthenticate,
}: {
  resource: Resource;
  kind: ResourceKind;
  selected: boolean;
  /** True for all non-connector rows; true for authorized connectors. */
  isConnectorAuthorized: boolean;
  onToggle: () => void;
  onAuthenticate: () => void;
}) {
  const needsAuth = kind === 'connectors' && !isConnectorAuthorized;
  // Hubs and Connectors carry descriptions; Spaces are label-only.
  const showDescription = (kind === 'connectors' || kind === 'hubs') && resource.description;
  // Only Connectors get a logo in the dropdown.
  const Logo = kind === 'connectors' ? resource.logo : undefined;

  const inner = (
    <>
      {Logo ? <Logo className="size-10 shrink-0" aria-label={resource.label} /> : null}

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground">
          {resource.label}
        </span>
        {showDescription ? (
          <span className="line-clamp-2 text-xs text-muted-foreground">
            {resource.description}
          </span>
        ) : null}
      </span>

      <span className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
        {needsAuth ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onAuthenticate}
            className="h-7 gap-1.5 px-2.5 text-xs"
          >
            <LogIn className="size-3.5" />
            Authenticate
          </Button>
        ) : (
          <Switch
            checked={selected}
            onCheckedChange={onToggle}
            aria-label={`Toggle ${resource.label}`}
          />
        )}
      </span>
    </>
  );

  if (needsAuth) {
    return (
      <div className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left">
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors',
        selected ? 'bg-primary/[0.06]' : 'hover:bg-muted'
      )}
    >
      {inner}
    </button>
  );
}
