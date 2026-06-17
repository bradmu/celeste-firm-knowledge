---
description: Bump @ids/* packages to latest and run their upgrade skills
---

End-to-end UDS upgrade. Detect installed `@ids/*` packages, find the latest version, update `package.json`, install, then walk each upgrade skill.

**All `@ids/*` packages are versioned and released in sync.** Even when an individual package has no functional changes, it's bumped alongside the rest so the entire suite stays at the same version. Treat them as a single unit: every installed `@ids/*` package should be on the same version at all times.

## Step 1: Detect installed @ids/* packages

Check this project's `package.json` (`dependencies` and `devDependencies`) for any of: `@ids/react`, `@ids/react-next`, `@ids/web-components`, `@ids/styles`, `@ids/tokens`. For each one found, read its installed version from `node_modules/@ids/<pkg>/package.json` and record as `FROM_<pkg>`.

If none are installed, stop.

## Step 2: Find the latest version

Run `npm view @ids/styles version` to get the latest published version of the suite. Record this single value as `TO`. (Any `@ids/*` package returns the same version since they release in sync — `@ids/styles` is just a convenient pick.)

Sanity check: `npm view @ids/<pkg> version` for each other installed package should return the same `TO`. If they don't match, stop and surface the discrepancy — it indicates an unusual release state and the user should investigate manually.

If `npm view` fails (network or auth), stop and explain. Don't guess.

## Step 3: Present the upgrade plan

If `FROM_<pkg>` equals `TO` for every installed `@ids/*` package, stop here and tell the user they're already on the latest version. Don't edit `package.json`, don't run install, and don't walk the skills.

Otherwise, every installed `@ids/*` package upgrades to the same `TO` version together. Show the user a summary like:

```
Target: 4.0.0 (major)

@ids/web-components  3.5.0 → 4.0.0
@ids/styles          3.5.0 → 4.0.0
@ids/tokens          3.5.0 → 4.0.0  (no functional changes — sync bump)
```

Flag majors clearly. Get explicit confirmation before continuing.

If the git working tree has uncommitted changes, warn the user and offer to stop so they can commit first.

If the user wants to pin to the latest non-major (e.g. "stay on 3.x"), use `npm view @ids/styles versions --json` and pick the highest matching version. Apply that pinned version to **every** installed `@ids/*` package — never split the suite across versions.

## Step 4: Update package.json and install

For each installed `@ids/*` package, edit its version in `package.json` to `TO`, preserving the existing prefix (`^`, `~`, or exact). All `@ids/*` entries should end up at the same version. Then run `npm install` and wait for it to complete. If install fails, stop and report.

## Step 5: Walk each upgrade skill

For each upgraded package, in this order:

1. The framework package — one of `@ids/react`, `@ids/react-next`, or `@ids/web-components`.
2. `@ids/styles`.
3. `@ids/tokens`.

Read `node_modules/@ids/<pkg>/claude/skills/upgrade-ids-<pkg>/SKILL.md` (the freshly-installed copy — it has the latest version log and migration guidance) and follow its workflow using `FROM_<pkg>` and `TO` as the range.

Treat each as a complete pass — finish one skill before starting the next.

## Step 6: Verify

Run the consumer's typecheck and lint. Report results. Hand back to the user with any errors — don't attempt automatic fixes beyond what each skill applied.
