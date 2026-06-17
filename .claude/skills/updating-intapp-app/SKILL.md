---
name: updating-intapp-app
description: Use when the user asks to update, upgrade, or pick up the latest of the create-intapp-app scaffold tooling (hooks, lint rules, skills, helper scripts). Runs `npx create-intapp-app upgrade`, handles edit-conflict prompts conservatively, and surfaces a clear summary.
---

# Updating create-intapp-app

This project was scaffolded with `@ids/create-intapp-app`. The scaffold ships
hooks, lint rules, and helper scripts that can be updated in place without
re-scaffolding.

## When to use this skill

- The user says "update my app", "upgrade the template", "pick up the latest", or similar.
- The SessionStart context mentioned a newer version is available.

## Workflow

1. **Preview** the upgrade so the user can decide before anything changes:

   ```bash
   npx create-intapp-app upgrade --dry-run
   ```

   This prints the changelog slice and a list of files that would be added,
   updated, kept, or flagged as conflicts.

2. **Summarize for the user** in your reply:
   - What will change (added/updated files, devDeps, scripts).
   - Whether any managed files appear edited (the dry-run lists them as conflicts).
   - The changelog entries between the user's version and latest.

3. **Handle edit conflicts conservatively**:
   - Default to **showing the diff** before suggesting overwrite.
   - Ask the user explicitly before overwriting any file flagged as edited.
   - Never auto-overwrite without confirmation — designer hand-edits may be intentional.

4. **Apply** once the user confirms:

   ```bash
   npx create-intapp-app upgrade
   ```

   Answer the interactive prompts according to the decisions you made with the user.

5. **Run `npm install`** if devDependencies changed.

6. **Summarize what shipped** in one paragraph.

## Failure modes

- "No `intapp` marker found" → this project is legacy. The upgrade will infer the
  template and walk every managed file as a conflict. Walk the user through each
  one carefully.
- "Template `<name>` not found" → the local `@ids/create-intapp-app` package
  needs to be newer. Use a fresh `npx @ids/create-intapp-app@latest upgrade` invocation.
- Network failures during the changelog/version fetch → the upgrade itself reads
  templates from local `node_modules`, so a network failure only affects version
  detection. The upgrade works offline once the CLI is installed.
