'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ContextSuggestions } from './context-suggestions';
import { PromptComposer } from './prompt-composer';
import {
  defaultAuthorizedConnectorIds,
  type ResourceKind,
  type Selection,
} from './context-resources';

/**
 * Composer + context-suggestions wrapped in a single client island that owns
 * the prompt text, the user's resource selections, and the per-session set
 * of authenticated connector IDs.
 *
 * Why this exists:
 *   • The page (a server component) shouldn't host state.
 *   • The composer needs the text state to be readable by siblings (the
 *     suggestion module reads it to run analysis; the suggestion module
 *     writes selections that feed back into the composer's puck stack).
 *   • The resource picker needs to know which connectors are authenticated
 *     so it can swap the toggle switch for an "Authenticate" button.
 *
 * Keep this component thin — most behaviour lives in its children.
 */
export function ChatLauncher() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [selection, setSelection] = useState<Selection>(() => ({
    connectors: new Set<string>(),
    spaces: new Set<string>(),
    hubs: new Set<string>(),
  }));
  const [authorized, setAuthorized] = useState<Set<string>>(
    () => new Set(defaultAuthorizedConnectorIds())
  );

  const submit = useCallback(() => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    // Carry the prompt forward via the URL so the chat page can render
    // a deep-linkable transcript. Selections aren't piped through — the
    // post-response module derives its own recommendations from the prompt.
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  }, [prompt, router]);

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

  const authenticateConnector = useCallback((id: string) => {
    setAuthorized((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  /**
   * Idempotent bulk action: makes sure every passed-in item ends up in
   * `selection` and, for connectors, in `authorized`. Single setState per
   * field so multiple items batched into the same render don't race.
   *
   * Used by the suggestion module for:
   *   • single-click auth-and-add when a connector chip is clicked while
   *     the connector is still unauthorized
   *   • the "Add all" button which dumps every suggested item in one go
   */
  const ensureSelected = useCallback(
    (items: { kind: ResourceKind; id: string }[]) => {
      if (items.length === 0) return;

      setSelection((prev) => {
        const next: Selection = { ...prev };
        let changed = false;
        for (const { kind, id } of items) {
          if (next[kind].has(id)) continue;
          const set = new Set(next[kind]);
          set.add(id);
          next[kind] = set;
          changed = true;
        }
        return changed ? next : prev;
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

  /**
   * Idempotent bulk remove — strips each passed-in id out of `selection`.
   * Auth state is intentionally NOT touched: clicking "All Added" to undo
   * means "I changed my mind about including these", not "un-authenticate
   * everything I just connected to".
   */
  const ensureUnselected = useCallback(
    (items: { kind: ResourceKind; id: string }[]) => {
      if (items.length === 0) return;

      setSelection((prev) => {
        const next: Selection = { ...prev };
        let changed = false;
        for (const { kind, id } of items) {
          if (!next[kind].has(id)) continue;
          const set = new Set(next[kind]);
          set.delete(id);
          next[kind] = set;
          changed = true;
        }
        return changed ? next : prev;
      });
    },
    []
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <PromptComposer
        value={prompt}
        onChange={setPrompt}
        selection={selection}
        onToggle={toggle}
        authorizedConnectorIds={authorized}
        onAuthenticateConnector={authenticateConnector}
        onSubmit={submit}
      />
      <ContextSuggestions
        prompt={prompt}
        selection={selection}
        onToggle={toggle}
        authorizedConnectorIds={authorized}
        onEnsureSelected={ensureSelected}
        onEnsureUnselected={ensureUnselected}
      />
    </div>
  );
}
