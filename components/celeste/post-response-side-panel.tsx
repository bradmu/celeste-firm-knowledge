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

export type PostResponseSidePanelProps = {
  /** The prompt that produced the response in the chat area. */
  prompt: string;
  /** Outer positioning / sizing classes. Lets the consumer place the card. */
  className?: string;
};

/**
 * Floating-card variant of the post-response suggestion module. Lives
 * on the right side of the chat area as a contained panel rather than a
 * full-height aside. Internally divided into:
 *   • compact header — title + Add All bulk button
 *   • scrollable body — three category sections stacked vertically with
 *     wrappable chips
 *   • compact footer — counter + Re-run CTA; dimmed when no selections
 *
 * All positioning (top/right/width/max-height) lives on the consumer via
 * the `className` prop. The card itself just fills the height/width it's
 * given and handles internal scroll when its body overflows.
 */
export function PostResponseSidePanel({
  prompt,
  className,
}: PostResponseSidePanelProps) {
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
    // eslint-disable-next-line no-console
    console.log('Re-run with:', selection);
  };

  return (
    <aside
      aria-label="Celeste suggested context panel"
      className={cn(
        // Card chrome — owns the visual frame regardless of where it's placed.
        'flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-md',
        className
      )}
    >
      {/* Header — title + Add All */}
      <header className="flex shrink-0 items-start justify-between gap-2 border-b border-border/60 px-3 py-2.5">
        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-semibold text-foreground">
            Suggested context
          </p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Sharpen the answer above.
          </p>
        </div>
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
          className="h-6 shrink-0 gap-1 rounded-full px-2 text-[11px] font-medium text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Plus className="size-3" />
          {allAdded ? 'All Added' : 'Add All'}
        </Button>
      </header>

      {/* Body — three sections stacked vertically, scroll on overflow */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-3.5">
          {SECTIONS.map(({ kind, label }) => {
            const items = suggestions[kind];
            return (
              <div key={kind} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
                {items.length === 0 ? (
                  <span className="text-[11px] italic text-muted-foreground">
                    Nothing to add
                  </span>
                ) : (
                  <ul className="flex flex-wrap items-start gap-1">
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
      </div>

      {/* Footer — Re-run CTA */}
      <footer
        className={cn(
          'flex shrink-0 items-center justify-between gap-2 border-t border-border/60 px-3 py-2 transition-opacity',
          hasAnySelection ? 'opacity-100' : 'opacity-50'
        )}
      >
        <span className="text-[11px] text-muted-foreground">
          {selectedCount} ready
        </span>
        <Button
          type="button"
          size="sm"
          disabled={!hasAnySelection}
          onClick={handleRerun}
          className="h-7 gap-1 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <RefreshCcw className="size-3" />
          Re-run
        </Button>
      </footer>
    </aside>
  );
}
