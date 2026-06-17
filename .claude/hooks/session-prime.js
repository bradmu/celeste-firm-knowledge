#!/usr/bin/env node
/**
 * SessionStart hook. Emits a priming message read by the agent at session
 * start. Exits 0 always — never blocks a session.
 *
 * Checks three pieces of state and builds the message dynamically:
 *   1. git user.email — nudges if unset (affects deploy paths and tags)
 *   2. .ids-setup-complete — whether the ADO repo has been wired
 *   3. .ids-pipeline-registered — whether the deploy pipeline has been registered
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Script lives at <project>/.claude/hooks/session-prime.js — three dirnames up.
const projectRoot = path.dirname(
  path.dirname(path.dirname(fileURLToPath(import.meta.url))),
);

// Read the intapp marker from package.json to know which template this project
// was scaffolded from. Used to build template-specific instructions (e.g. the
// deploy URL formula differs by template).
let intappMarker = {};
try {
  const pkg = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  intappMarker = pkg.intapp || {};
} catch { /* ignore — pkg may be missing or unreadable */ }
const template = intappMarker.template || '';

// ── Git email check ───────────────────────────────────────────────────────────
const emailResult = spawnSync('git', ['config', 'user.email'], { stdio: 'pipe' });
const authorEmail = emailResult.status === 0 ? emailResult.stdout.toString().trim() : '';
const emailWarning = authorEmail
  ? ''
  : `
⚠  git user.email is not configured. This affects the deploy path and the
  pipeline Contact tag baked into the Azure resource.
  Ask the user to run (early in the session, before any deploy work):
    git config --global user.email <their-intapp-email>`;

// ── Azure CLI availability ────────────────────────────────────────────────────
const azAvailable = spawnSync('az', ['--version'], { stdio: 'pipe' }).status === 0;
const azDevopsAvailable = azAvailable &&
  spawnSync('az', ['extension', 'show', '--name', 'azure-devops', '--output', 'none'], { stdio: 'pipe' }).status === 0;

// If the extension is in place, also probe whether the user is logged in and
// whether they have any Azure subscriptions. Designer accounts often have zero
// subscriptions but full Azure DevOps access — that's fine for the scaffolder.
const azAccountList = azDevopsAvailable
  ? spawnSync('az', ['account', 'list', '--output', 'tsv', '--query', '[].id'], { stdio: 'pipe' })
  : null;
const azLoggedIn = azAccountList?.status === 0;
const azHasSubscriptions = azLoggedIn && azAccountList.stdout.toString().trim().length > 0;

const azWarning = !azAvailable
  ? `
⚠  Azure CLI is not installed. \`npm run setup\` and \`npm run setup-pipeline\`
  will skip the automated path and print manual instructions instead.
  If the user wants automated setup, guide them to install it first:
    macOS:   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
             brew install azure-cli && az extension add --name azure-devops && az login --allow-no-subscriptions
    Windows: https://aka.ms/installazurecli — then: az extension add --name azure-devops && az login --allow-no-subscriptions
  In Claude Code, the user can run terminal commands with the ! prefix, e.g.:
    ! brew install azure-cli
  After installing, retry the pending setup step.`
  : !azDevopsAvailable
  ? `
⚠  Azure CLI is installed but the azure-devops extension is missing.
  \`npm run setup\` and \`npm run setup-pipeline\` will skip the automated path.
  Ask the user to run: az extension add --name azure-devops
  Then retry whichever setup step is pending.`
  : !azLoggedIn
  ? `
ℹ  Azure CLI is set up but the user isn't logged in yet. \`npm run setup\`
  and \`npm run setup-pipeline\` will prompt for sign-in on first use.
  If they want to log in proactively: az login --allow-no-subscriptions
  (The --allow-no-subscriptions flag is fine even if they have subscriptions;
  it just lets the login succeed for designer accounts that don't.)`
  : !azHasSubscriptions
  ? `
ℹ  Azure CLI is logged in, but the account has no Azure subscriptions. This is
  expected for designer accounts and is NOT a problem for \`npm run setup\` /
  \`npm run setup-pipeline\` — those commands only talk to Azure DevOps, which
  uses its own permission model (not Azure RBAC). Proceed normally.`
  : '';

// ── ADO repo setup state ──────────────────────────────────────────────────────
// The .ids-setup-complete marker is .gitignored, so it doesn't follow into git
// worktrees created via `git worktree add` or Claude Code's "isolation: worktree"
// option. To handle that case, ALSO accept "the project has an Azure DevOps remote
// wired up" as evidence of setup completion — git remotes live in .git/config,
// which IS shared across worktrees. So a worktree session sees the parent's
// origin and can correctly conclude setup is done.
//
// A user who DECLINED setup has the marker but no origin; the marker handles
// that case (we don't want to re-ask every session). The combined check covers
// both: marker → previously decided either way; origin → repo is wired up
// regardless of marker.
const markerPresent = existsSync(path.join(projectRoot, '.ids-setup-complete'));
const adoOriginCheck = spawnSync('git', ['-C', projectRoot, 'remote', 'get-url', 'origin'], { stdio: 'pipe' });
const adoOriginUrl = adoOriginCheck.status === 0 ? adoOriginCheck.stdout.toString().trim() : '';
const hasAdoOrigin = /dev\.azure\.com/.test(adoOriginUrl);
const setupDone = markerPresent || hasAdoOrigin;

const setupBlock = setupDone
  ? `Azure DevOps repo: already wired up or setup was previously declined
    (marker present OR ADO remote detected — \`git remote -v\` will confirm).
  • If the user mentions deploying, pushing, opening a PR, sharing, shipping,
    publishing, merging, making it live, sending a link, or showing it to
    someone, and \`git remote -v\` shows no \`origin\`, raise it:
    "Setup was deferred earlier — want to wire Azure DevOps now before [action]?"
    Re-run with: \`npm run setup -- --yes\` (uses the scaffolded default project).
  • Otherwise don't bring it up; it's been decided.`
  : `Azure DevOps repo: NOT set up yet (no .ids-setup-complete marker).
  • On your FIRST response in this session, ask the user whether to wire
    Azure DevOps now. Offer:
      npm run setup -- --yes      (uses the scaffolded default Azure DevOps project)
      npm run setup -- --no       (defer — won't ask again at session start)
  • Do NOT pass \`--project=<X>\` unless the user explicitly asks for a different
    project — the scaffolded setup-repo.js already has the correct default baked in.
  • If they defer, REMEMBER to bring it up again when they mention deploying,
    pushing, opening a PR, sharing, shipping, publishing, merging, making it
    live, sending a link, or showing it to someone. The deployment needs the
    repo to exist — bringing it up at that moment is helpful, not nagging.
    Phrase it as a check, not a re-ask:
    "Quick check — Azure DevOps repo wasn't set up earlier. Want to wire it
    now before [action]?"`;

// ── Pipeline registration state ───────────────────────────────────────────────
const pipelineDone = existsSync(path.join(projectRoot, '.ids-pipeline-registered'));
const pipelineYml = 'azure-pipelines.yml';

// ── Explicit first-response decision (computed once, here, so the agent can't ─
// ── confuse repo state with pipeline state) ───────────────────────────────────
const firstResponseAction = (() => {
  if (!setupDone) {
    return `╔══════════════════════════════════════════════════════════════════════════╗
║ FIRST REPLY — DO THIS BEFORE ANYTHING ELSE                              ║
╚══════════════════════════════════════════════════════════════════════════╝
Your very first message back to the user MUST be this question, even if
they just said "hi" or asked something unrelated. Greet them inside the
same message — don't reply with a bare hello and ask later. Verbatim:

  "Hello! Before we dive in — the Azure DevOps repo for this project
  hasn't been wired up yet. Would you like me to set it up now?
    • \`npm run setup -- --yes\` — wire it up using the default project config
    • \`npm run setup -- --no\`  — defer for now"

DO NOT ask about the deploy pipeline yet; that comes after the repo is
wired. DO NOT reply with a generic greeting like "How can I help today?"
and skip the question.`;
  }
  if (!pipelineDone) {
    return `╔══════════════════════════════════════════════════════════════════════════╗
║ FIRST REPLY — DO THIS BEFORE ANYTHING ELSE                              ║
╚══════════════════════════════════════════════════════════════════════════╝
Your very first message back to the user MUST be this question, even if
they just said "hi" or asked something unrelated. Greet them inside the
same message — don't reply with a bare hello and ask later. Verbatim:

  "Hello! The Azure DevOps repo is wired up, but the deploy pipeline
  isn't registered yet — without it, pushes won't deploy anywhere. Want
  me to register it now? I'll run \`npm run setup-pipeline\`."

The repo IS already wired up (marker present or ADO remote detected) — do
NOT ask about repo setup. DO NOT reply with a generic greeting like "How
can I help today?" and skip the question.

If they agree, run \`npm run setup-pipeline\` via the Bash tool with
\`dangerouslyDisableSandbox: true\`. After it succeeds, just confirm:
"Pipeline registered. Pushes to main will trigger a deploy automatically."
Do NOT instruct them to open the pipeline URL, click Run, or Permit
service connections — those steps aren't needed; \`az pipelines create\`
handles authorisation as part of registration.`;
  }
  return `Setup state: both repo and pipeline are registered. Nothing to ask
proactively. Respond to whatever the user actually says. If they later
mention deploying/pushing/sharing/etc., remind them the pipeline
auto-deploys on push to main.`;
})();

const pipelineBlock = !setupDone
  ? '' // Don't mention pipeline until the repo itself is wired.
  : pipelineDone
  ? `Deploy pipeline: registered (marker present).
  • When the user mentions deploying, pushing, sharing, publishing, shipping,
    making it live, sending a link, or showing it to someone — remind them
    that the pipeline auto-deploys on push to main, in case they're unaware.`
  : `Deploy pipeline: NOT registered in Azure DevOps yet.
  • Early in this session (after the repo nudge if applicable), ask whether
    to register the deployment pipeline now. Default offer:
      "Want me to register the pipeline? I'll run \`npm run setup-pipeline\`."
    Do NOT present manual DevOps steps as a co-equal option — the script is
    the default and almost always works.
  • If they agree, run \`npm run setup-pipeline\` yourself via the Bash tool
    (with \`dangerouslyDisableSandbox: true\` — see the CRITICAL block at
    the top of this priming message). After success, just confirm pushes
    to main will now trigger deploys. Do NOT tell them to open the
    pipeline URL or Permit service connections — \`az pipelines create\`
    handles that.
  • Manual fallback — only use this if \`npm run setup-pipeline\` actually
    fails (e.g. because Azure CLI isn't installed or the azure-devops
    extension is missing) AND the script's own output tells the user to do
    it manually. Otherwise don't mention it. The manual recipe is:
      1. Go to https://dev.azure.com/intappdevops → your project → Pipelines → New pipeline
      2. Azure Repos Git → select this repo → Existing Azure Pipelines YAML file
      3. Select /${pipelineYml} → Continue → Save (not Run)
      4. Authorize any service connections when prompted (click Permit on each)
      5. Then run: \`npm run setup-pipeline -- --mark\` to record the marker.
  • If they defer, bring it up again when they mention deploying, pushing,
    opening a PR, sharing, shipping, publishing, merging, making it live,
    sending a link, or showing it to someone. The deploy needs the pipeline
    registered before any of those work, so raising it at that moment is
    helpful, not nagging. Phrase it as a check, not a re-ask:
    "Quick check — the deploy pipeline wasn't registered earlier. Want me
    to register it now (\`npm run setup-pipeline\`) before [action]?"`;

const message = `
${firstResponseAction}

────────────────────────────────────────────────────────────────────────────
The rest of this priming text is reference material. The block above is
the only action you MUST take in your very first reply, regardless of what
the user says first. Even if they just say "hello", lead with the question.
────────────────────────────────────────────────────────────────────────────

This project uses the Intapp Design System (IDS).

Before writing any code:
  1. Read CLAUDE.md and the @-imported docs under node_modules/@ids/*/claude/docs/.
  2. Use only IDS components, tokens, and icons. Never invent styles, components, or icon names.
  3. If something you need is not in the docs, ASK — do not guess.

How violations are handled:
  • A PreToolUse hook scans every Write/Edit. Violations (hardcoded colours,
    raw <button>, hallucinated UdsX components, invalid icon names, hardcoded
    px/rem) block the write and return structured remediation.
  • If you see lint errors, run \`npm run lint:fix\` first — many cases are
    auto-fixable.
  • For component-pattern requests ("build me a nav bar"), apply the heuristic
    in .claude/skills/build-component-options/SKILL.md: vague → variants under
    _ids-preview/<name>/, specific → direct build.

════════════════════════════════════════════════════════════════════════════
CRITICAL — Sandbox handling for Azure CLI, git, and npm registry commands:

  Every Bash invocation that runs ANY of these MUST be made with
  \`dangerouslyDisableSandbox: true\`:
    • \`npm run setup\` / \`npm run setup-pipeline\`
    • Any \`az ...\` command
    • Any git command that reaches a remote: \`git push\`, \`git pull\`,
      \`git fetch\`, \`git clone\`, \`git ls-remote\`. Local git ops
      (status, log, add, commit, diff, restore, etc.) DO NOT need the flag.
    • Any npm command that talks to a registry: \`npm install\`, \`npm ci\`,
      \`npm publish\`, \`npm pack\`, \`npm view\`, \`npm login\`, \`npm audit\`,
      and \`npx\` invocations that pull new packages. Local npm operations
      (\`npm run <script>\` for already-installed deps, \`npm test\`,
      \`npm run build\`) DO NOT need the flag — but if a script triggers
      install or hits the registry indirectly (e.g. \`predev\` running
      \`setup-repo.js\`), the flag IS needed.

  Why: these commands read credential stores that the default sandbox blocks.
    • Azure CLI reads ~/.azure (denied)
    • git reads ~/.git-credentials, ~/Library/Keychains (macOS), and the
      git-credential-manager cache (all denied)
    • npm reads ~/.npmrc and ~/.npm (both denied) — needed for Artifactory
      auth tokens on the @ids/* and product-specific scoped registries

  Failure modes you might see — DO NOT misdiagnose these:
    • az: cryptic Python tracebacks referencing _session.py
    • git push: "Azure DevOps is asking for credentials that aren't
      configured on this machine" / "Authentication failed" / repeated
      credential prompts
    • npm install: 401 Unauthorized from Artifactory, "Unable to authenticate"
      on @ids/* or scoped packages, or silent fallback to public registry
      with "package not found"
    • The scaffolder scripts will sometimes suggest the user run things
      in their terminal; the right action FOR YOU is to retry the SAME
      Bash call with \`dangerouslyDisableSandbox: true\`.

  DO NOT advise the user to:
    • Generate a PAT for git push (their credentials are already configured)
    • Install or reconfigure Azure CLI (it's already installed)
    • Set up git-credential-manager (already set up)
    • Re-run \`npm login\` for Artifactory (the token is already in ~/.npmrc)
  These will not fix the sandbox; they'll just waste the user's time.

  This is not optional. Treat the flag as required on every command
  matching the list above.
════════════════════════════════════════════════════════════════════════════

${firstResponseAction}

Setup state (reference — your first-response action is above; these blocks are
for behaviour after the first response, e.g. handling reactive nudges):
${setupBlock}
${pipelineBlock ? '\n' + pipelineBlock : ''}${emailWarning}${azWarning}

  • For @ids/* version drift, you can suggest \`npm run check-updates -- --yes\`
    (install all) or \`--skip\` (defer) at a natural pause point. Don't run it
    unprompted — surface it if the user mentions stale versions, lint errors
    that look version-related, or before deploying.

${(() => {
  // The deploy URL pattern depends on which template was scaffolded.
  // - nextjs:                     App Service per app (~10 min build+deploy)
  // - react-18 / react-19 / vanilla: shared CDN-fronted blob path
  if (template === 'nextjs') {
    return `Deploy URL handling (Next.js — App Service):
  • After ANY push (to main OR to a feature branch), surface the deploy
    URL to the user proactively. They don't need to open Azure DevOps to
    find it. Branch-specific framing is below in "Push & PR handling".
  • The URL is deterministic — compute it from package.json without
    needing to query Azure:
      1. Read \`intapp.authorHandle\` and \`name\` from package.json
      2. Concatenate as \`<authorHandle>-<name>\`
      3. Sanitise: lowercase, replace anything outside [a-z0-9-] with '-',
         truncate to 60 chars, strip leading/trailing hyphens
      4. URL is: \`https://<sanitised-name>.azurewebsites.net\`
  • Mention it's VPN-only.
  • If they ask before the pipeline finishes whether the URL works yet,
    you can poll the deploy stage via \`az pipelines runs list --top 1 ...\`
    (sandbox-disabled), but this is optional — just predicting the URL
    is usually enough.`;
  }
  if (template === 'react-18' || template === 'react-19' || template === 'vanilla') {
    return `Deploy URL handling (static — CDN blob):
  • After ANY push (to main OR to a feature branch), surface the deploy
    URL to the user proactively. They don't need to open Azure DevOps to
    find it. Branch-specific framing is below in "Push & PR handling".
  • The URL is deterministic — compute it from package.json:
      1. Read \`intapp.authorHandle\` and \`name\` from package.json
      2. URL is:
         \`https://datauicdnhjlbt54r2kzf0s4.blob.core.windows.net/uds/<authorHandle>/<name>/index.html\`
    (Note: no name sanitisation needed — blob paths accept the raw values.)
  • Mention it's VPN-only.`;
  }
  // Unknown template — skip the section rather than emit a wrong URL.
  return '';
})()}

Push & PR handling:
  • When you actually push (after the user agrees), check the current
    branch first with \`git rev-parse --abbrev-ref HEAD\`. The push flow
    differs by branch:

    PUSHING ON MAIN:
      Run \`git push origin main\` with \`dangerouslyDisableSandbox: true\`.
      If it succeeds: surface the deploy URL (see "Deploy URL handling"
      above) with framing like:
        "Pushed. The pipeline runs now (~10 min for Next.js, ~1-2 min for static). Your app will be at:
        https://<URL>. It's VPN-only."
      If it fails with a branch-policy / "TF402455: Pushes to this branch
      are not permitted; you must use a pull request" error: DO NOT retry
      the same push. Switch to the feature-branch flow below. Don't tell
      the user "your credentials are wrong" — branch protection is the
      cause.

    PUSHING ON A FEATURE BRANCH (or after a main push was rejected by
    branch protection):
      1. If you're still on main with uncommitted changes that were meant
         for a branch, create one first:
           git checkout -b <short-slug>
         Pick a slug from the work you've been doing (e.g., \`add-nav-bar\`,
         \`tweak-spacing\`). Keep it lowercase, hyphenated, under 40 chars.
      2. Push the branch:
           git push -u origin <branch-name>
         (with \`dangerouslyDisableSandbox: true\`)
      3. Invoke the \`create-pr\` skill (it's a globally-available Claude
         Code skill that opens an Azure DevOps PR for the current branch
         against main, generating title/description from the commits).
      4. Share BOTH:
           • The PR URL the skill returns (so they can review/approve)
           • The deploy URL (with framing: "Once this PR is merged to
             main, your app will be live at: https://<URL>. It's VPN-only.")

  • ALWAYS surface the deploy URL after any push, regardless of branch.
    The user wants to know where their app WILL be live, regardless of
    whether the push just deployed it (main) or queued it behind a merge
    (feature branch). Don't skip this — they said they want it surfaced
    every time.

Task-completion handling:
  • When the user signals they're done with what they came to do — phrases
    like "I'm done", "that's it", "looks good", "this is finished", "perfect",
    "thanks, that works", "I think we're good here" — check \`git status\`
    and \`git log @{u}..HEAD\` if a remote exists. If there are uncommitted
    changes OR unpushed commits, ask once whether they want to push:
      "Want to push these changes so the deploy pipeline picks them up?"
    Adjust the phrasing based on setup state (no repo → "wire Azure DevOps
    and push"; repo but no pipeline → "push, and register the deploy pipeline
    so it actually deploys"; both done → "push, the pipeline will deploy on
    main").
  • If they say yes, run \`git add\` / \`git commit\` / \`git push\` as
    appropriate. Pushing is a "pushing" trigger from the blocks above — if
    the repo or pipeline isn't set up yet, follow the existing nudges.
  • If they say no, respect that decision and don't ask again this session.
  • If \`git status\` is clean and there's nothing unpushed, don't ask. They
    were just confirming completion of something already committed.

Platform: Azure DevOps (not GitHub):
  • This project's remote is Azure DevOps, not GitHub. Do NOT use the GitHub
    CLI (\`gh\`) for any operation — \`gh pr create\`, \`gh issue\`, \`gh repo\`,
    etc. will fail with "none of the git remotes configured for this
    repository point to a known GitHub host".
  • For pull requests: prefer the \`create-pr\` skill if it's available in
    your environment (it knows the ADO conventions). If the skill isn't
    available, use \`az repos pr create --repository <repo> --source-branch
    <branch> --target-branch main --title <T> --description <D>\` directly.
  • For other ADO operations: use the \`az repos\` and \`az pipelines\`
    commands. Reach for \`az boards work-item\` for issue-equivalents.
  • Both \`az repos pr\` and the \`create-pr\` skill talk to Azure DevOps,
    which means they're covered by the sandbox rule above — invoke them
    with \`dangerouslyDisableSandbox: true\` on the Bash call.

Branch / worktree handling:
  • This is a scaffolded prototype project — one developer, no parallel
    feature branches, deploys on push to main. DO NOT create a git worktree
    for this work, and DO NOT invoke superpowers:using-git-worktrees.
    Work directly on the user's currently checked-out branch (usually main).
  • If the user explicitly asks for a worktree ("work on a branch", "make a
    feature branch", etc.), then create one. Otherwise stay where they are.
  • Commits and pushes happen on the current branch. The deploy pipeline
    triggers on main, so commits land on main unless the user says otherwise.

Overrides:
  • If a rule must genuinely be overridden, use \`// ids-allow: <reason>\`
    (or \`// ids-allow-file: <reason>\` at top of file).
  • You MUST confirm with the user before adding any override. State what
    you want to override, why, and at which level. Wait for approval.

Run \`npm run lint:overrides\` to audit accumulated overrides.
`.trim();

// Emit the message inside Claude Code's SessionStart hook envelope.
// Plain text on stdout is NOT delivered to the agent — only the
// `hookSpecificOutput.additionalContext` field is treated as context.
// See https://code.claude.com/docs/en/hooks.
process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: message,
    },
  }),
);
