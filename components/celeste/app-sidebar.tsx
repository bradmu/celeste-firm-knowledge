'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  CirclePlay,
  CirclePlus,
  Database,
  Layers,
  MessageSquare,
  PanelLeftClose,
  Plug,
  Settings2,
  Users,
  Workflow,
  Wrench,
  Zap,
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

type NavItem = { label: string; icon: LucideIcon; href: string };

const PRIMARY_NAV: NavItem[] = [
  { label: 'New chat', icon: CirclePlus, href: '/' },
  { label: 'Chats', icon: MessageSquare, href: '/' },
  { label: 'Playbooks', icon: CirclePlay, href: '/' },
  { label: 'Skills', icon: Workflow, href: '/' },
  { label: 'Admin', icon: Wrench, href: '/admin' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Members', icon: Users, href: '/admin' },
  { label: 'Connections', icon: Plug, href: '/admin' },
  { label: 'Semantic Layer', icon: Layers, href: '/admin' },
  { label: 'Firm Knowledge', icon: Database, href: '/admin' },
  { label: 'Automations', icon: Zap, href: '/admin' },
  { label: 'Settings', icon: Settings2, href: '/admin' },
];

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

// Subtle horizontal slide + fade between the main and admin variants.
// Both panels render at the same time; the inactive one is hidden but
// still occupies layout space via `grid` stacking so the parent height
// stays stable mid-transition.
const PANEL_BASE =
  'transition-[opacity,translate] duration-300 ease-out [grid-area:1/1] data-[active=false]:pointer-events-none';

export function AppSidebar() {
  const pathname = usePathname() ?? '/';
  const variant: 'main' | 'admin' = pathname.startsWith('/admin') ? 'admin' : 'main';
  const activeAdmin = 'Firm Knowledge';
  const activePrimary = variant === 'admin' ? 'Admin' : 'New chat';

  return (
    <Sidebar
      collapsible="none"
      className="h-screen w-[253px] border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="px-3 pt-2 pb-7">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center gap-1.5 py-2">
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
        <div className="grid grid-cols-[minmax(0,1fr)]">
          {/* Main variant */}
          <div
            data-active={variant === 'main'}
            className={`${PANEL_BASE} data-[active=true]:opacity-100 data-[active=true]:translate-x-0 data-[active=false]:opacity-0 data-[active=false]:-translate-x-2`}
            aria-hidden={variant !== 'main'}
          >
            <SidebarGroup className="p-0 pb-6">
              <SidebarMenu>
                {PRIMARY_NAV.map((item) => {
                  const active = item.label === activePrimary;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        className="h-8 gap-2 px-2 py-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent"
                        data-active={active || undefined}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>

            {RECENT_GROUPS.map((group) => (
              <SidebarGroup key={group.heading} className="gap-3 p-0">
                <div className="border-t border-border/40 pt-4 pl-1">
                  <span className="text-sm font-medium leading-5 text-foreground">Recent</span>
                </div>
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
          </div>

          {/* Admin variant */}
          <div
            data-active={variant === 'admin'}
            className={`${PANEL_BASE} data-[active=true]:opacity-100 data-[active=true]:translate-x-0 data-[active=false]:opacity-0 data-[active=false]:translate-x-2`}
            aria-hidden={variant !== 'admin'}
          >
            <SidebarGroup className="p-0 pb-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="h-8 gap-2 px-2 py-2 text-sm font-normal text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  >
                    <Link href="/" aria-label="Back to chat">
                      <ArrowLeft className="size-4" />
                      <span>Back</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="gap-2 p-0">
              <div className="flex flex-col gap-2 pl-2">
                <span className="font-serif text-base leading-6 text-foreground">Admin Center</span>
                <hr className="border-t border-border/60" />
              </div>
              <SidebarMenu>
                {ADMIN_NAV.map((item) => {
                  const active = item.label === activeAdmin;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        className="h-8 gap-2 px-2 py-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent"
                        data-active={active || undefined}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </div>
        </div>
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
