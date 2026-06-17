'use client';

import Link from 'next/link';
import {
  ChevronDown,
  CirclePlay,
  CirclePlus,
  MessageSquare,
  PanelLeftClose,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { CelesteLogo } from './celeste-logo';

type NavItem = { label: string; icon: LucideIcon; active?: boolean };

const PRIMARY_NAV: NavItem[] = [
  { label: 'New chat', icon: CirclePlus, active: true },
  { label: 'Chats', icon: MessageSquare },
  { label: 'Playbooks', icon: CirclePlay },
  { label: 'Skills', icon: Workflow },
  { label: 'Admin', icon: Wrench },
];

// Recent chats. The second item is the currently-selected conversation.
const RECENT_GROUPS: { heading: string; items: { label: string; selected?: boolean }[] }[] = [
  {
    heading: 'Analyze revenue trajectories',
    items: [
      { label: 'Add-on acquisitions for Silver…', selected: true },
      { label: 'Show me 10 potential add-on acquisitions' },
      { label: 'Summarize the key rationale for…' },
      { label: 'Compare these 10 targets’ EBITDA margins' },
      { label: 'Review sustainability practices' },
      { label: 'Find targets with strong IP portf…' },
      { label: 'Pull public comps for these targe…' },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="none"
      className="h-screen w-[253px] border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="px-3 pt-2 pb-7">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center gap-1.5 py-2">
              {/* Logo is the "home" affordance — clicking returns to the
                  landing page with an empty composer to start a new
                  conversation. */}
              <Link
                href="/"
                aria-label="Celeste home"
                className="shrink-0 rounded transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CelesteLogo />
              </Link>
              <div className="ml-auto flex items-center justify-end text-muted-foreground">
                <PanelLeftClose className="size-4" aria-label="Collapse sidebar" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-4 pt-2">
        <SidebarGroup className="p-0 pb-6">
          <SidebarMenu>
            {PRIMARY_NAV.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  className="h-8 gap-2 px-2 py-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent"
                  data-active={item.active || undefined}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {RECENT_GROUPS.map((group) => (
          <SidebarGroup key={group.heading} className="gap-3 p-0">
            <div className="border-t border-border/40 pt-4 pl-1">
              <span className="text-sm font-medium leading-5 text-foreground">Recent</span>
            </div>

            {/* The "heading" is rendered as a slightly larger chat title at the top of the list */}
            <div className="px-1">
              <p className="font-serif text-base leading-6 text-foreground">{group.heading}</p>
            </div>

            <ul className="flex flex-col gap-1.5">
              {group.items.map((chat) => (
                <li key={chat.label}>
                  <button
                    type="button"
                    className={[
                      'block w-full truncate rounded px-2 py-1 text-left font-serif text-base leading-6 text-foreground transition-colors',
                      chat.selected
                        ? 'bg-secondary text-foreground'
                        : 'hover:bg-sidebar-accent/60',
                    ].join(' ')}
                  >
                    {chat.label}
                  </button>
                </li>
              ))}
            </ul>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto gap-2 px-2 py-2 hover:bg-sidebar-accent"
            >
              <Avatar className="size-8">
                <AvatarImage src="" alt="James Cole" />
                <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
                  JC
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 text-sm font-semibold text-foreground">James Cole</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
