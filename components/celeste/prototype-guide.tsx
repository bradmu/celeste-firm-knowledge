'use client';

import { useState } from 'react';
import { ArrowUp, Check, Copy, Info, X as XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

const EXAMPLE_PROMPT =
  'Find me 10 potential add-on acquisitions for Silver Oak Services Partners with a focus on healthcare companies in the US';

type CopyStatus = 'idle' | 'copied' | 'failed';

/**
 * Robust copy with a fallback. The modern Clipboard API is the preferred
 * path but it requires a secure context and can be blocked by extensions,
 * iframe sandboxing, or Safari's stricter heuristics. When that path
 * rejects (or `navigator.clipboard` is unavailable), we fall back to a
 * legacy `document.execCommand('copy')` flow that works almost everywhere
 * the modern API doesn't.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  // Path A: modern Clipboard API.
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Clipboard API failed, falling through to execCommand:', err);
    }
  }

  // Path B: legacy execCommand. Requires a focused, selected text node.
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    // Keep the element off-screen but interactable.
    ta.style.position = 'fixed';
    ta.style.left = '0';
    ta.style.top = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Clipboard fallback failed:', err);
    return false;
  }
}

/**
 * Instructional banner pinned to the bottom of the landing page. Designed to
 * read clearly as *not part of the product UI* — dashed amber border, sticky-
 * note background, "PROTOTYPE GUIDE" eyebrow label — so teammates exploring
 * the prototype don't mistake it for the real Celeste chrome.
 *
 * The action button copies the example prompt to the clipboard, scrolls the
 * window to the top so the chat input is in view, and focuses the textarea
 * so the viewer can paste immediately. If the clipboard write fails for any
 * reason, the button surfaces an error state pointing the viewer at the
 * example text card above (which is selectable for manual copy).
 */
export function PrototypeGuide() {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const handleCopy = async () => {
    const ok = await copyToClipboard(EXAMPLE_PROMPT);
    setStatus(ok ? 'copied' : 'failed');
    window.setTimeout(() => setStatus('idle'), 3500);

    // Regardless of clipboard success, scroll up and focus the textarea so
    // the viewer is ready to paste (or type) into the chat input.
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>(
        'textarea[placeholder*="Give me"]'
      );
      textarea?.focus();
    }, 350);
  };

  return (
    <aside
      aria-label="Prototype guide"
      className="w-full rounded-lg border-2 border-dashed border-amber-400/80 bg-amber-50/70 p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <Info
          className="mt-0.5 size-5 shrink-0 text-amber-700"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Prototype guide
            </p>
            <p className="mt-1 text-sm font-semibold text-amber-950">
              Welcome — this is a Celeste design prototype, not a working
              product.
            </p>
          </div>

          <div className="space-y-2 text-sm leading-relaxed text-amber-950/90">
            <p>
              To see how Celeste might suggest context (connectors, Spaces,
              Knowledge Hubs) based on your prompt — and again after you get
              a response — try this:
            </p>
            <ol className="ml-4 list-decimal space-y-1">
              <li>
                Click the <strong>connector pucks</strong> (the rounded
                container with the small Intapp logos near the right of the
                chat input) to open the <strong>resource selector</strong>.
                Try the search, switch between the{' '}
                <strong>Connectors / Knowledge Hubs / Spaces</strong> tabs,
                toggle a few connectors on, and notice the{' '}
                <strong>Authenticate</strong> flow on locked connectors.
              </li>
              <li>
                Click <strong>Copy example prompt</strong> below. The chat
                input above will come into focus.
              </li>
              <li>
                Paste (<kbd className="rounded border border-amber-300/80 bg-amber-100 px-1 font-mono text-[11px]">⌘V</kbd>{' '}
                /{' '}
                <kbd className="rounded border border-amber-300/80 bg-amber-100 px-1 font-mono text-[11px]">Ctrl V</kbd>) into the chat input. Watch the{' '}
                <strong>&ldquo;Celeste suggests adding context&rdquo;</strong>{' '}
                module appear as Celeste &ldquo;reads&rdquo; the prompt. Toggle
                a few chips on or hit <strong>+ Add All</strong>.
              </li>
              <li>
                Click the teal <strong>Send</strong>{' '}
                <ArrowUp
                  className="inline size-3.5 align-middle text-amber-700"
                  aria-hidden="true"
                />{' '}
                button (or hit Enter) to see the chat-response view, including
                two variants of the post-response suggestion module for
                comparison.
              </li>
              <li>
                In the chat view, click the <strong>Celeste logo</strong>{' '}
                top-left of the sidebar to return here and start over.
              </li>
            </ol>
          </div>

          <div className="rounded border border-amber-200/80 bg-card p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Example prompt
            </p>
            <p className="mt-1.5 font-serif text-sm italic leading-snug text-foreground">
              {EXAMPLE_PROMPT}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 bg-amber-700 px-3 text-xs font-medium text-white hover:bg-amber-800"
            >
              {status === 'copied' ? (
                <>
                  <Check className="size-3.5" />
                  Copied — paste into the chat input above
                </>
              ) : status === 'failed' ? (
                <>
                  <XIcon className="size-3.5" />
                  Copy blocked — select the text above manually
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy example prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
