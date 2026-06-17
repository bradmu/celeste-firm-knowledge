import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/celeste/app-sidebar';
import { LandingShell } from '@/components/celeste/landing-shell';

/**
 * Celeste landing — the "open nav" chat home that greets the user, surfaces
 * recent agent activity, and accepts the next prompt.
 *
 * Figma reference: file DIVjXB7LipC4L4Ekgombtj, node 3326:2600.
 *
 * The interactive island (composer, suggestion module, prompt cards, and
 * the meta "Prototype guide") all live inside <LandingShell/> so this
 * server component can stay thin.
 */
export default function CelestePage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <main className="flex flex-1 justify-center px-6 pt-[130px] pb-16">
          <LandingShell />
        </main>
      </div>
    </SidebarProvider>
  );
}
