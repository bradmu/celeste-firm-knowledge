'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  suggestFor,
  type Resource,
  type ResourceKind,
  type Selection,
  type SuggestResult,
} from './context-resources';
import {
  ContextSuggestionChip,
  type ChipState,
} from './context-suggestion-chip';

export type { Selection };

export type ContextSuggestionsProps = {
  /** Current prompt text. Empty string hides the module entirely. */
  prompt: string;
  /** What the user has toggled on so far. */
  selection: Selection;
  /** Flip a single resource on/off (used for deselecting via chip). */
  onToggle: (kind: ResourceKind, id: string) => void;
  /** Connector IDs the user has authenticated. */
  authorizedConnectorIds: Set<string>;
  /**
   * Idempotent bulk add: authenticates connectors as needed and selects
   * every passed-in resource. Used both by single-click chips (in their
   * `needs-auth` and `unselected` states) and by the "Add All" button.
   */
  onEnsureSelected: (items: { kind: ResourceKind; id: string }[]) => void;
  /**
   * Idempotent bulk remove: strips the passed-in resources out of
   * `selection`. Used by the "All Added" state of the bulk button to undo
   * a previous Add-all in one click.
   */
  onEnsureUnselected: (items: { kind: ResourceKind; id: string }[]) => void;
};

/**
 * Column ordering for the suggestion module. Left-to-right reads:
 * data sources (Connectors) → firm-wide context (Knowledge Hubs) →
 * project-specific context (Spaces).
 */
const SECTIONS: { kind: ResourceKind; label: string; emptyHint: string }[] = [
  { kind: 'connectors', label: 'Connectors', emptyHint: 'No connectors needed' },
  { kind: 'hubs', label: 'Knowledge Hubs', emptyHint: 'No Knowledge Hub needed' },
  { kind: 'spaces', label: 'Spaces', emptyHint: 'No Space recommended' },
];

const ANALYZE_DELAY_MS = 450;

/**
 * The "Celeste suggests adding context" panel that appears between the
 * composer and the suggested-prompt grid while the user is typing.
 *
 * Workflow:
 *   1. Empty prompt → module collapsed (renders null).
 *   2. User types → 450 ms debounce; module shows a soft skeleton while
 *      Celeste is "reading" the prompt.
 *   3. Debounce settles → suggestFor() runs a keyword-based match over the
 *      Connectors, Knowledge Hubs, and Spaces registry and emits chips.
 *
 * Header carries an "Add all" button that authenticates and selects every
 * suggestion in one click. It disables itself when there's nothing left
 * to add.
 *
 * Layout: three columns laid out edge-to-edge, each with its category
 * label at top and stacked toggleable chips below.
 */
export function ContextSuggestions({
  prompt,
  selection,
  onToggle,
  authorizedConnectorIds,
  onEnsureSelected,
  onEnsureUnselected,
}: ContextSuggestionsProps) {
  const trimmed = prompt.trim();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SuggestResult | null>(null);

  useEffect(() => {
    if (!trimmed) {
      setResult(null);
      setAnalyzing(false);
      return;
    }
    setAnalyzing(true);
    const handle = window.setTimeout(() => {
      setResult(suggestFor(trimmed));
      setAnalyzing(false);
    }, ANALYZE_DELAY_MS);
    return () => window.clearTimeout(handle);
  }, [trimmed]);

  // Flat list of every currently-suggested item (used by Add-all + diffing).
  const allSuggestedItems = useMemo(
    () =>
      result
        ? [
            ...result.connectors.map((r) => ({ kind: 'connectors' as const, id: r.id })),
            ...result.hubs.map((r) => ({ kind: 'hubs' as const, id: r.id })),
            ...result.spaces.map((r) => ({ kind: 'spaces' as const, id: r.id })),
          ]
        : [],
    [result]
  );

  const remainingToAdd = useMemo(
    () =>
      allSuggestedItems.filter(({ kind, id }) => !selection[kind].has(id)),
    [allSuggestedItems, selection]
  );

  /**
   * `allAdded` is true once every currently-suggested item is in selection
   * (whether the user got there via Add-All or by toggling individual
   * chips). In that state the button flips to "+ All Added" and the click
   * handler deselects everything instead.
   */
  const allAdded =
    allSuggestedItems.length > 0 && remainingToAdd.length === 0;

  if (!trimmed) return null;

  const handleBulkClick = () => {
    if (allAdded) {
      onEnsureUnselected(allSuggestedItems);
    } else {
      onEnsureSelected(remainingToAdd);
    }
  };

  const chipStateFor = (kind: ResourceKind, item: Resource): ChipState => {
    if (selection[kind].has(item.id)) return 'selected';
    if (kind === 'connectors' && !authorizedConnectorIds.has(item.id)) {
      return 'needs-auth';
    }
    return 'unselected';
  };

  const handleChipClick = (kind: ResourceKind, item: Resource) => {
    if (selection[kind].has(item.id)) {
      // Deselecting — straight toggle.
      onToggle(kind, item.id);
      return;
    }
    // Selecting (and authenticating connectors if needed) — go through
    // ensureSelected so the auth + selection state updates can't race.
    onEnsureSelected([{ kind, id: item.id }]);
  };

  return (
    <section
      aria-label="Celeste context suggestions"
      className="w-full rounded-lg border border-primary/15 bg-primary/[0.04] p-4"
    >
      <header className="flex items-center justify-between gap-3 pb-3">
        <p className="text-sm">
          <span className="font-medium text-foreground">
            {analyzing ? 'Reading your prompt…' : 'Celeste suggests adding context'}
          </span>
          {!analyzing ? (
            <span className="text-muted-foreground"> for a sharper answer</span>
          ) : null}
        </p>

        {!analyzing && result ? (
          // Two-state bulk action:
          //   • "+ Add All"   → adds every suggested item to selection
          //   • "+ All Added" → removes every suggested item from selection
          // The relabel only happens once the user has reached the
          // all-selected state (either via Add-All or by clicking every
          // chip themselves) — nothing is added on their behalf.
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleBulkClick}
            aria-label={
              allAdded
                ? 'Remove all suggestions from selection'
                : 'Add all suggestions to selection'
            }
            className="h-7 gap-1.5 rounded-full px-2.5 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Plus className="size-3.5" />
            {allAdded ? 'All Added' : 'Add All'}
          </Button>
        ) : null}
      </header>

      {analyzing ? <SuggestionSkeleton /> : null}

      {!analyzing && result ? (
        <div className="grid grid-cols-3 gap-4">
          {SECTIONS.map(({ kind, label, emptyHint }) => {
            const items = result[kind];
            return (
              <div key={kind} className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </span>
                {items.length === 0 ? (
                  <span className="text-xs italic text-muted-foreground">
                    {emptyHint}
                  </span>
                ) : (
                  // `flex-wrap` so shorter chips can share a row instead of
                  // always stacking — gives the module a much tighter vertical
                  // footprint when several short labels are suggested.
                  <ul className="flex flex-wrap items-start gap-1.5">
                    {items.map((item) => (
                      <li key={item.id}>
                        <ContextSuggestionChip
                          label={item.label}
                          state={chipStateFor(kind, item)}
                          onClick={() => handleChipClick(kind, item)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function SuggestionSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {SECTIONS.map(({ kind, label }) => (
        <div key={kind} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <div className="flex flex-col items-start gap-1.5">
            <span className="h-7 w-28 animate-pulse rounded-full bg-muted" />
            <span className="h-7 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
