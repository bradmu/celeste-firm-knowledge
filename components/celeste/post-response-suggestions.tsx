'use client';

import { useCallback, useMemo, useState } from 'react';
import { Plus, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  defaultAuthorizedConnectorIds,
  suggestFor,
  type Resource,
  type ResourceKind,
  type Selection,
} from './context-resources';
import {
  ContextSuggestionChip,
  type ChipState,
} from './context-suggestion-chip';

const SECTIONS: { kind: ResourceKind; label: string }[] = [
  { kind: 'connectors', label: 'Connectors' },
  { kind: 'hubs', label: 'Knowledge Hubs' },
  { kind: 'spaces', label: 'Spaces' },
];

export type PostResponseSuggestionsProps = {
  /** The prompt that produced the response above this module. */
  prompt: string;
};

/**
 * Post-response recommendation panel. Surfaced AFTER the AI response on the
 * chat page, framed retrospectively as "these resources would have made
 * this answer sharper — turn them on and re-run".
 *
 * Header controls:
 *   • Title copy explaining the value of adding context.
 *   • "+ Add All" bulk button (mirrors the landing-page suggestion module):
 *     defaults to "+ Add All"; once every suggested item is selected it
 *     flips to "+ All Added" and clicking deselects everything.
 *
 * Footer control:
 *   • A "Re-run with these" CTA that fades in once at least one chip is on,
 *     plus a live "N resources ready" counter.
 *
 * Selection state is local to this component — the prototype's chat page
 * is one-shot, so there's no upstream state to thread back.
 */
export function PostResponseSuggestions({ prompt }: PostResponseSuggestionsProps) {
  const [selection, setSelection] = useState<Selection>(() => ({
    connectors: new Set<string>(),
    spaces: new Set<string>(),
    hubs: new Set<string>(),
  }));
  const [authorized, setAuthorized] = useState<Set<string>>(
    () => new Set(defaultAuthorizedConnectorIds())
  );

  const suggestions = useMemo(() => suggestFor(prompt), [prompt]);

  const allSuggestedItems = useMemo(
    () => [
      ...suggestions.connectors.map((r) => ({ kind: 'connectors' as const, id: r.id })),
      ...suggestions.hubs.map((r) => ({ kind: 'hubs' as const, id: r.id })),
      ...suggestions.spaces.map((r) => ({ kind: 'spaces' as const, id: r.id })),
    ],
    [suggestions]
  );

  const remainingToAdd = useMemo(
    () => allSuggestedItems.filter(({ kind, id }) => !selection[kind].has(id)),
    [allSuggestedItems, selection]
  );

  const allAdded =
    allSuggestedItems.length > 0 && remainingToAdd.length === 0;

  const toggle = useCallback((kind: ResourceKind, id: string) => {
    setSelection((prev) => {
      const next = new Set(prev[kind]);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ...prev, [kind]: next };
    });
  }, []);

  // Idempotent bulk add — also authenticates any connectors in the list.
  const ensureSelected = useCallback(
    (items: { kind: ResourceKind; id: string }[]) => {
      if (items.length === 0) return;
      setSelection((prev) => {
        const nextSel: Selection = { ...prev };
        let changed = false;
        for (const { kind, id } of items) {
          if (nextSel[kind].has(id)) continue;
          const set = new Set(nextSel[kind]);
          set.add(id);
          nextSel[kind] = set;
          changed = true;
        }
        return changed ? nextSel : prev;
      });
      setAuthorized((prev) => {
        const next = new Set(prev);
        let changed = false;
        for (const { kind, id } of items) {
          if (kind !== 'connectors') continue;
          if (next.has(id)) continue;
          next.add(id);
          changed = true;
        }
        return changed ? next : prev;
      });
    },
    []
  );

  // Idempotent bulk remove — counterpart to ensureSelected for the
  // "All Added" → deselect flow on the bulk button.
  const ensureUnselected = useCallback(
    (items: { kind: ResourceKind; id: string }[]) => {
      if (items.length === 0) return;
      setSelection((prev) => {
        const nextSel: Selection = { ...prev };
        let changed = false;
        for (const { kind, id } of items) {
          if (!nextSel[kind].has(id)) continue;
          const set = new Set(nextSel[kind]);
          set.delete(id);
          nextSel[kind] = set;
          changed = true;
        }
        return changed ? nextSel : prev;
      });
    },
    []
  );

  const chipStateFor = (kind: ResourceKind, item: Resource): ChipState => {
    if (selection[kind].has(item.id)) return 'selected';
    if (kind === 'connectors' && !authorized.has(item.id)) {
      return 'needs-auth';
    }
    return 'unselected';
  };

  const handleChipClick = (kind: ResourceKind, item: Resource) => {
    if (selection[kind].has(item.id)) {
      toggle(kind, item.id);
      return;
    }
    ensureSelected([{ kind, id: item.id }]);
  };

  const handleBulkClick = () => {
    if (allAdded) {
      ensureUnselected(allSuggestedItems);
    } else {
      ensureSelected(remainingToAdd);
    }
  };

  const selectedCount =
    selection.connectors.size + selection.hubs.size + selection.spaces.size;
  const hasAnySelection = selectedCount > 0;

  const handleRerun = () => {
    // Prototype no-op — would normally re-post the original prompt with the
    // newly-selected resources attached and navigate to the new transcript.
    // eslint-disable-next-line no-console
    console.log('Re-run with:', selection);
  };

  return (
    <section
      aria-label="Celeste post-response context suggestions"
      className="w-full rounded-lg border border-primary/15 bg-primary/[0.04] p-4"
    >
      <header className="flex items-start justify-between gap-3 pb-3">
        <p className="text-sm">
          <span className="font-medium text-foreground">
            Add this context and re-run
          </span>
          <span className="text-muted-foreground"> to sharpen the answer above.</span>
        </p>

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
          className="h-7 shrink-0 gap-1.5 rounded-full px-2.5 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Plus className="size-3.5" />
          {allAdded ? 'All Added' : 'Add All'}
        </Button>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {SECTIONS.map(({ kind, label }) => {
          const items = suggestions[kind];
          return (
            <div key={kind} className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
              {items.length === 0 ? (
                <span className="text-xs italic text-muted-foreground">
                  Nothing to add
                </span>
              ) : (
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

      {/* Re-run CTA — appears as soon as the user opts any chip on. */}
      <div
        className={cn(
          'mt-4 flex items-center justify-end gap-2 transition-opacity',
          hasAnySelection ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!hasAnySelection}
      >
        <span className="text-xs text-muted-foreground">
          {selectedCount} resource{selectedCount === 1 ? '' : 's'} ready
        </span>
        <Button
          type="button"
          size="sm"
          onClick={handleRerun}
          className="h-8 gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCcw className="size-3.5" />
          Re-run with these
        </Button>
      </div>
    </section>
  );
}
