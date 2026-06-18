import { ArrowUpRight, NotepadText } from 'lucide-react';

import { ChatLauncher } from './chat-launcher';
import { MoonGlyph } from './moon-glyph';
import { PromptCard, type PromptCardProps } from './prompt-card';

const AGENT_CARDS: PromptCardProps[] = [
  {
    icon: NotepadText,
    label: 'Intapp news monitoring',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    badge: { text: '10 new', tone: 'new' },
  },
  {
    icon: NotepadText,
    label: 'DealCloud origination workflow',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    icon: NotepadText,
    label: 'Intelligent query decomposition',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

const PROMPT_CARDS: PromptCardProps[] = [
  {
    icon: ArrowUpRight,
    label: 'Suggested prompt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    icon: ArrowUpRight,
    label: 'Suggested prompt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    icon: ArrowUpRight,
    label: 'Suggested prompt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

export function LandingShell() {
  return (
    <div className="flex w-full max-w-[768px] flex-col items-center gap-5">
      <MoonGlyph className="size-28" />

      <h1 className="font-serif text-[28px] leading-[52px] text-foreground">
        Hello, <span className="font-medium text-primary">Brad</span>. I&rsquo;m
        ready to help you.
      </h1>

      <div className="w-full pt-3">
        <ChatLauncher />
      </div>

      <section
        className="flex w-full flex-col gap-3 pt-5"
        aria-label="Suggested actions"
      >
        <div className="grid grid-cols-3 gap-2">
          {AGENT_CARDS.map((card, idx) => (
            <PromptCard key={`agent-${idx}`} {...card} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PROMPT_CARDS.map((card, idx) => (
            <PromptCard key={`prompt-${idx}`} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
