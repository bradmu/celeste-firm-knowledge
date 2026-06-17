'use client';

import { ArrowUp, Mic, NotepadText, Paperclip, Swords } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { IntappLogoMark } from './intapp-logo-mark';
import {
  getResourceById,
  type Resource,
  type ResourceKind,
  type Selection,
} from './context-resources';
import { ResourceSelector } from './resource-selector';

export type PromptComposerProps = {
  /** Current text in the textarea. Controlled by the parent. */
  value: string;
  /** Called on every keystroke with the new value. */
  onChange: (next: string) => void;
  /** What the user has selected across all resource kinds. */
  selection: Selection;
  /** Toggle a single resource on/off. Passed straight to the selector. */
  onToggle: (kind: ResourceKind, id: string) => void;
  /** Connector IDs that the user has authenticated (or that ship pre-authed). */
  authorizedConnectorIds: Set<string>;
  /** Called when the user clicks "Authenticate" on an unauthorized connector. */
  onAuthenticateConnector: (id: string) => void;
  /** Submit handler. Optional — prototypes may not wire this up. */
  onSubmit?: () => void;
};

/**
 * The main chat input. A bordered card containing:
 *   • a textarea (auto-grows with content via `field-sizing: content`)
 *   • left action buttons: paperclip (attach) and notepad
 *   • a connector-puck cluster that opens the resource selector on click
 *     (search across Connectors, Knowledge Hubs, and Spaces)
 *   • a model/mode selector ("Broad")
 *   • a microphone button (dictation, not wired up in the prototype)
 *   • a teal send button that mutes itself when the textarea is empty
 *
 * The puck stack continues to reflect connector selections specifically;
 * Space and Knowledge-Hub selections live in shared state but aren't
 * surfaced as chrome on the composer (they're visible inside the popover
 * and via the suggestion module).
 */
export function PromptComposer({
  value,
  onChange,
  selection,
  onToggle,
  authorizedConnectorIds,
  onAuthenticateConnector,
  onSubmit,
}: PromptComposerProps) {
  const selectedConnectors: Resource[] = Array.from(selection.connectors)
    .map((id) => getResourceById('connectors', id))
    .filter((r): r is Resource => Boolean(r));

  const hasContent = value.trim().length > 0;

  return (
    <div className="w-full rounded-lg border border-input bg-card shadow-xs">
      {/* Input area */}
      <div className="px-3 pt-3 pb-2">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && onSubmit && hasContent) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Give me something to work on…"
          className="block w-full resize-none border-0 bg-transparent text-base leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none [field-sizing:content]"
        />
      </div>

      {/* Action row */}
      <div className="flex items-end justify-between gap-3 px-3 pb-3">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-md"
            aria-label="Attach"
          >
            <Paperclip className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-md"
            aria-label="Notes"
          >
            <NotepadText className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ConnectorStackTrigger
            connectors={selectedConnectors}
            selection={selection}
            onToggle={onToggle}
            authorizedConnectorIds={authorizedConnectorIds}
            onAuthenticateConnector={onAuthenticateConnector}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 rounded-md px-2.5 text-sm font-medium"
          >
            <Swords className="size-4" />
            Broad
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-md"
            aria-label="Dictate"
          >
            <Mic className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            disabled={!hasContent}
            className={cn(
              'size-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90',
              // Disabled state: still teal-tinted, but visibly muted so it
              // reads as "nothing to send yet" without losing the colour cue.
              'disabled:bg-primary/40 disabled:opacity-100 disabled:text-primary-foreground'
            )}
            aria-label="Send"
            onClick={onSubmit}
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Clickable puck cluster that opens the ResourceSelector popover.
 *
 * The trigger itself is a button containing the puck stack — clicking
 * anywhere inside the rounded container opens the selector. When no
 * connectors are picked, two ambient Intapp marks stand in.
 */
function ConnectorStackTrigger({
  connectors,
  selection,
  onToggle,
  authorizedConnectorIds,
  onAuthenticateConnector,
}: {
  connectors: Resource[];
  selection: Selection;
  onToggle: (kind: ResourceKind, id: string) => void;
  authorizedConnectorIds: Set<string>;
  onAuthenticateConnector: (id: string) => void;
}) {
  const ambient = connectors.length === 0;
  const label = ambient
    ? 'Open resource selector'
    : `${connectors.length} connector${connectors.length === 1 ? '' : 's'} active — open resource selector`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="flex items-center rounded-full border border-border bg-card px-1.5 py-1 transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {ambient ? (
            <div className="flex items-center gap-0.5">
              <AmbientPuck />
              <AmbientPuck />
            </div>
          ) : (
            // Layout: overlapping logo stack (max 3) + a sibling `+N` badge
            // that sits beside the stack without being overlapped.
            //   • Inner stack uses `-space-x-1.5` for ~6px of overlap —
            //     enough to feel compact, light enough that each logo is
            //     still clearly visible.
            //   • Each logo carries a 2px `ring-card` outline so the
            //     overlap reads cleanly against the puck container.
            //   • The `+N` badge is OUTSIDE the negative-space scope, with
            //     a small `ml-1` gap, so it's never partially covered.
            <div className="flex items-center">
              <div className="flex items-center -space-x-1.5">
                {connectors.slice(0, 3).map((connector, idx) => {
                  const Logo = connector.logo;
                  if (!Logo) return null;
                  return (
                    <Logo
                      key={connector.id}
                      aria-label={connector.label}
                      className="relative size-6 rounded-[5px] ring-2 ring-card"
                      // First icon on top so the user reads left → right as
                      // most-recent / primary → secondary.
                      style={{ zIndex: 10 - idx }}
                    />
                  );
                })}
              </div>
              {connectors.length > 3 ? (
                <span
                  aria-label={`${connectors.length - 3} more`}
                  title={`${connectors.length - 3} more`}
                  className="ml-1 flex size-6 items-center justify-center rounded-[5px] bg-secondary text-[10px] font-semibold text-foreground"
                >
                  +{connectors.length - 3}
                </span>
              ) : null}
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-auto p-0"
      >
        <ResourceSelector
          selection={selection}
          onToggle={onToggle}
          authorizedConnectorIds={authorizedConnectorIds}
          onAuthenticateConnector={onAuthenticateConnector}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * Decorative ambient puck — just the Intapp brand mark, no background.
 * Used when no connectors have been picked yet.
 */
function AmbientPuck() {
  return (
    <span
      aria-hidden="true"
      className="flex size-6 items-center justify-center"
    >
      <IntappLogoMark className="size-4" />
    </span>
  );
}
