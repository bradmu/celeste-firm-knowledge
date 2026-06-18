# Celeste Firm Knowledge — Prototype

This is a prototype. It does **not** enforce the Intapp Design System (IDS).
The IDS PreToolUse hook is disabled in `.claude/settings.json`.

## What to use

- **shadcn/ui** components from `components/ui/` (configured via `components.json`,
  style: `radix-nova`, base color: `neutral`, icons: `lucide-react`).
  Add new ones with `npx shadcn@latest add <component>`.
- **Tailwind CSS v4** for styling. Tokens/variables live in `app/globals.css`.
- **Uploaded design files** (Figma exports, screenshots, mockups the user shares
  in chat) are the source of truth for layout, spacing, and visual style. Match
  them as closely as the available shadcn primitives allow.
- Custom prototype components belong in `components/celeste/`.

## What NOT to use

- Do not import from `@ids/*` packages.
- Do not reference `UdsX` components, IDS tokens, or the IDS icon set.
- Ignore any `.claude/skills/build-component-options` or `upgrade-uds` workflows —
  those are IDS-specific.

## When a design is ambiguous

If an uploaded design shows something shadcn doesn't have a primitive for, ask
before inventing a component. Prefer composing existing shadcn pieces over
building custom ones from scratch.
