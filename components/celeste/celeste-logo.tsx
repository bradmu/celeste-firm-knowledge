import { IntappLogoMark } from './intapp-logo-mark';

/**
 * Lockup of the Intapp mark + "Celeste" wordmark. The wordmark is set in
 * Lora serif to match the greeting and the rest of Celeste's voice typography.
 */
export function CelesteLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[7px] ${className ?? ''}`}>
      <IntappLogoMark className="h-6 w-9" />
      <span className="font-serif text-[20px] leading-none tracking-tight text-foreground">
        Celeste
      </span>
    </div>
  );
}
