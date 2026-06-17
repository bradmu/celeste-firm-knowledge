# IDS (Intapp Design System) — STRICT MODE

This project enforces IDS via a PreToolUse hook (`.claude/hooks/check-ids.js`)
and ESLint + Stylelint. **Never** invent styles, components, or icons. If you
need something not in the docs below, ASK — do not guess.

@node_modules/@ids/react-next/claude/docs/using-uds-react-next.md
@node_modules/@ids/styles/claude/docs/using-uds-styles.md
@node_modules/@ids/tokens/claude/docs/using-uds-tokens.md

## Workflows

- Building a component pattern? See `.claude/skills/build-component-options/SKILL.md`.
- Upgrading an `@ids/*` package? See `.claude/commands/upgrade-uds.md`.
- Auditing accumulated overrides? Run `npm run lint:overrides`.

## Override policy

If you genuinely need to bypass an IDS rule, use:
- `// ids-allow: <reason>` on the same line, or
- `// ids-allow-file: <reason>` at the top of the file.

You **must** confirm with the user before adding any override. Stating: what
you want to override, why, and at which scope. Wait for approval.
