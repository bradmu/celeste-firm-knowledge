'use client';

import {
  ChevronDown,
  Filter,
  LayoutGrid,
  Plus,
  Search,
  Table as TableIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export type StackedToolbarProps = {
  countLabel: string;
  primaryLabel?: string;
  searchAriaLabel: string;
  layout: 'grid' | 'table';
  onLayoutChange: (l: 'grid' | 'table') => void;
};

export function StackedToolbar({
  countLabel,
  primaryLabel,
  searchAriaLabel,
  layout,
  onLayoutChange,
}: StackedToolbarProps) {
  return (
    <div className="flex flex-col gap-3 px-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold leading-none text-foreground tabular-nums">
          {countLabel}
        </h2>
        {primaryLabel ? (
          <Button size="sm" data-icon="inline-start">
            <Plus />
            {primaryLabel}
          </Button>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-[325px]">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="h-8 rounded-lg bg-card pl-8 text-sm"
            aria-label={searchAriaLabel}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap text-foreground">Sort by</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" data-icon="inline-end">
                  Recently updated
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Recently updated</DropdownMenuItem>
                <DropdownMenuItem>Recently added</DropdownMenuItem>
                <DropdownMenuItem>Alphabetical</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="secondary" size="default" data-icon="inline-start">
            <Filter />
            Filter
          </Button>

          <div className="inline-flex h-8 items-stretch">
            <button
              type="button"
              data-active={layout === 'grid' || undefined}
              onClick={() => onLayoutChange('grid')}
              aria-label="Grid view"
              className={cn(
                'flex h-8 w-9 items-center justify-center rounded-l-md border border-r-0 border-input bg-background text-muted-foreground transition-colors',
                'data-[active=true]:bg-accent data-[active=true]:text-foreground',
                'hover:bg-accent/60',
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              data-active={layout === 'table' || undefined}
              onClick={() => onLayoutChange('table')}
              aria-label="Table view"
              className={cn(
                'flex h-8 w-9 items-center justify-center rounded-r-md border border-input bg-background text-muted-foreground transition-colors',
                'data-[active=true]:bg-accent data-[active=true]:text-foreground',
                'hover:bg-accent/60',
              )}
            >
              <TableIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
