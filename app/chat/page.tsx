import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/celeste/app-sidebar';
import {
  CannedResponseBody,
  getCannedResponse,
} from '@/components/celeste/canned-response';
import { ChatLauncher } from '@/components/celeste/chat-launcher';
import { PostResponseSidePanel } from '@/components/celeste/post-response-side-panel';
import { PostResponseSuggestions } from '@/components/celeste/post-response-suggestions';

/**
 * One-shot chat transcript page. The user lands here after submitting from
 * the home page; the prompt is read from the `q` query parameter so this
 * route is deep-linkable.
 *
 * Current layout (intentionally surfaces TWO variants of the post-response
 * suggestion module so the team can A/B them internally):
 *   • Sidebar (left) — Celeste logo (links home), nav, recent, profile
 *   • Main pane (centre) — 47px header with left-aligned chat title,
 *     scrollable transcript ending with the inline PostResponseSuggestions
 *     block (Variant A), composer pinned to the viewport bottom
 *   • Right aside — PostResponseSidePanel (Variant B) surfacing the same
 *     suggestions in a tall vertical layout
 *
 * The two variants hold independent local state on purpose — comparing how
 * each one feels to interact with is the point of running them side by
 * side. When you pick a winner, drop the other one.
 */
type SearchParams = Promise<{ q?: string }>;

export default async function ChatPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const prompt = q?.trim() ?? '';

  if (!prompt) {
    redirect('/');
  }

  const response = getCannedResponse(prompt);

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />

        <main className="relative flex flex-1 flex-col">
          {/* Page header — left-justified, but the title sits inside the same
              centred 768-max column as the transcript so it lines up cleanly
              with the chat content. */}
          <header className="flex h-[47px] shrink-0 items-center px-6 pr-[340px]">
            <div className="mx-auto w-full max-w-[768px]">
              <h2 className="text-sm font-semibold text-foreground">
                {response.title}
              </h2>
            </div>
          </header>

          {/* Scrollable transcript — scrolls behind the pinned composer.
              `pr-[340px]` reserves room for the floating side panel so the
              centred content sits to its left without overlap. */}
          <div className="flex-1 overflow-y-auto px-6 pr-[340px] pb-[220px]">
            <div className="mx-auto flex w-full max-w-[768px] flex-col gap-6 pt-6">
              {/* User message bubble */}
              <div className="flex justify-end pl-16">
                <div className="max-w-[600px] rounded-lg bg-foreground px-4 py-2 text-base leading-7 text-primary-foreground">
                  {prompt}
                </div>
              </div>

              {/* AI response */}
              <article className="pt-4">
                <CannedResponseBody response={response} />
              </article>

              {/* Variant A — inline bottom module. Independent state from
                  Variant B in the floating card; for internal A/B comparison. */}
              <div className="pt-2">
                <PostResponseSuggestions prompt={prompt} />
              </div>
            </div>
          </div>

          {/* Pinned composer + disclaimer. Same `pr-[340px]` so the composer
              lines up with the transcript above it. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-6 pr-[340px]">
            <div className="pointer-events-auto w-full max-w-[768px]">
              <div className="pointer-events-none -mt-8 h-8 bg-gradient-to-b from-transparent to-background" />
              <div className="bg-background pb-3">
                <ChatLauncher />
                <p className="pt-2 text-center text-xs font-light text-foreground">
                  AI assistant can make mistakes. Please verify the information.{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Intapp Disclaimer
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Variant B — floating card on the right side of the chat. Same
            data as Variant A above; deliberately a smaller, contained
            surface (~280×360) rather than a full-height aside. */}
        <PostResponseSidePanel
          prompt={prompt}
          className="absolute right-6 top-16 z-20 w-[300px] max-h-[calc(100vh-220px)]"
        />
      </div>
    </SidebarProvider>
  );
}
