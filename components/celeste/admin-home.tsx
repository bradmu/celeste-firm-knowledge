'use client';

import {
  BarChart3,
  BookOpen,
  LayoutGrid,
  Layers,
  Network,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

type AdminSection = {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const ADMIN_SECTIONS: AdminSection[] = [
  {
    label: 'Members',
    description: 'Manage people, groups, and access across your organization.',
    icon: Users,
    href: '#',
  },
  {
    label: 'Connectors',
    description: 'Connect and configure data sources and integrations.',
    icon: Network,
    href: '#',
  },
  {
    label: 'Semantic layer',
    description: 'Define domain models and the firm-wide semantic layer.',
    icon: Layers,
    href: '#',
  },
  {
    label: 'Firm knowledge',
    description: 'Curate knowledge hubs and document schemas for the firm.',
    icon: BookOpen,
    href: '/admin/firm-knowledge',
  },
  {
    label: 'Skills',
    description: 'Upload and manage organization-wide agent skills.',
    icon: Sparkles,
    href: '#',
  },
  {
    label: 'Spaces',
    description: 'Organize collaborative spaces for teams and projects.',
    icon: LayoutGrid,
    href: '#',
  },
  {
    label: 'Settings',
    description: 'Adjust company-wide settings and preferences.',
    icon: Settings2,
    href: '#',
  },
  {
    label: 'Automations',
    description: 'Build and manage automations and workflows.',
    icon: Zap,
    href: '/automations',
  },
  {
    label: 'Audit',
    description: 'Review audit logs and governance activity.',
    icon: ShieldCheck,
    href: '#',
  },
  {
    label: 'Usage',
    description: 'Track firm-wide usage and engagement across Celeste.',
    icon: BarChart3,
    href: '/admin/usage',
  },
];

export function AdminHome() {
  return (
    <div className="flex w-full max-w-[1140px] flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl leading-tight font-semibold text-foreground">
          Admin center
        </h1>
        <p className="font-serif text-sm leading-5 text-muted-foreground">
          Firm-wide settings and configurations
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ADMIN_SECTIONS.map((section) => (
          <AdminSectionCard key={section.label} section={section} />
        ))}
      </div>
    </div>
  );
}

function AdminSectionCard({ section }: { section: AdminSection }) {
  const Icon = section.icon;
  return (
    <Link
      href={section.href}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-xs transition-all hover:-translate-y-[1px] hover:border-primary/40 hover:shadow-md"
    >
      <header className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#e8f1f2] text-primary">
          <Icon className="size-4" />
        </span>
        <h2 className="text-base font-semibold text-foreground">{section.label}</h2>
      </header>
      <p className="text-sm leading-5 text-muted-foreground">{section.description}</p>
    </Link>
  );
}
