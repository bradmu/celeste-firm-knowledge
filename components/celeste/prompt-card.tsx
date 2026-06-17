import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export type PromptCardProps = {
  icon: LucideIcon;
  label: string;
  description: string;
  badge?: { text: string; tone?: 'new' | 'default' };
};

/**
 * A single suggestion / agent card on the landing page. Two visual variants:
 *   • Agent: NotepadText icon, may carry a "10 new" badge in the body.
 *   • Suggested prompt: ArrowUpRight icon, no badge.
 *
 * The variant is driven purely by what you pass in for `icon`, `label`, and
 * `badge` — no separate `variant` prop needed.
 */
export function PromptCard({ icon: Icon, label, description, badge }: PromptCardProps) {
  return (
    <Card className="flex h-30 flex-1 flex-col gap-2.5 rounded-lg border border-border bg-card px-4 pt-4 pb-2.5 shadow-xs transition-colors hover:border-foreground/15">
      <div className="flex items-center gap-1">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium leading-5 text-muted-foreground">{label}</span>
      </div>

      <p className="line-clamp-2 font-serif text-sm leading-5 text-foreground">{description}</p>

      {badge ? (
        <div>
          <Badge
            className={
              badge.tone === 'new'
                ? 'bg-celeste-badge-new px-2 py-0.5 text-xs font-medium text-primary-foreground hover:bg-celeste-badge-new'
                : ''
            }
          >
            {badge.text}
          </Badge>
        </div>
      ) : null}
    </Card>
  );
}
