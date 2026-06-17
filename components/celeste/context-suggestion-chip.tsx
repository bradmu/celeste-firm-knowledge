import { Check, LogIn, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ChipState = 'unselected' | 'selected' | 'needs-auth';

export type ContextSuggestionChipProps = {
  label: string;
  state: ChipState;
  onClick: () => void;
};

/**
 * Toggleable pill used inside the context-suggestion module. Three states:
 *
 *   • `unselected`  → "+" affordance. Click adds it to the selection.
 *   • `selected`    → check mark, filled primary background.
 *   • `needs-auth`  → `LogIn` affordance, dashed border so it visually reads
 *     as "action required". Click runs auth and selects in one step.
 *
 * Communicated to AT via `aria-pressed` (selected) and an `aria-label`
 * override on the needs-auth state so the action is clear.
 */
export function ContextSuggestionChip({
  label,
  state,
  onClick,
}: ContextSuggestionChipProps) {
  const Icon = state === 'selected' ? Check : state === 'needs-auth' ? LogIn : Plus;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state === 'selected'}
      aria-label={
        state === 'needs-auth' ? `Authenticate and add ${label}` : undefined
      }
      className={cn(
        'inline-flex h-7 items-center gap-1 rounded-full border px-2 text-xs font-medium leading-none transition-colors',
        state === 'selected' &&
          'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
        state === 'unselected' &&
          'border-border bg-card text-foreground hover:border-foreground/30 hover:bg-card/80',
        state === 'needs-auth' &&
          'border-dashed border-foreground/30 bg-card text-foreground hover:border-foreground/50 hover:bg-card/80'
      )}
    >
      <Icon className="size-3.5" />
      <span>{label}</span>
    </button>
  );
}
