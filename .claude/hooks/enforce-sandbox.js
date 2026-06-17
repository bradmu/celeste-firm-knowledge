#!/usr/bin/env node
/**
 * PreToolUse hook for Bash. Enforces `dangerouslyDisableSandbox: true` on
 * commands that read credential paths the default sandbox blocks.
 *
 * Why this exists: session-prime tells the agent to set the flag on these
 * commands, but instruction-following is unreliable — agents intermittently
 * forget and the commands fail with cryptic errors (401s, "credentials not
 * configured", Python tracebacks). This hook turns "soft guidance" into
 * "hard enforcement": if the flag isn't set, the call is denied with a
 * specific reason and the agent retries with the flag.
 *
 * Exit 0 always — hook failures should never block legitimate work.
 */
import { readFileSync } from 'node:fs';

let payload;
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // Malformed input — let the call through rather than block
}

// Only enforce on Bash tool calls
if (payload.tool_name !== 'Bash') process.exit(0);

const cmd = payload.tool_input?.command || '';
const sandboxDisabled = payload.tool_input?.dangerouslyDisableSandbox === true;

// Patterns for commands that read sandbox-denied credential paths.
//   - az ...                          → reads ~/.azure
//   - git push/pull/fetch/clone/ls-remote → reads ~/.git-credentials, Keychain
//   - npm install/ci/publish/pack/view/login/audit → reads ~/.npmrc
//   - npx <anything>                  → may pull from registry → reads ~/.npmrc
//   - npm run setup/setup-pipeline/dev → invoke az/git/npm via predev hooks
const SANDBOX_REQUIRING_PATTERNS = [
  /\baz(\s|$)/,
  /\bgit\s+(push|pull|fetch|clone|ls-remote)(\s|$)/,
  /\bnpm\s+(install|i|ci|publish|pack|view|login|audit)(\s|$)/,
  /\bnpm\s+run\s+(setup|setup-pipeline|dev|predev)(\s|$)/,
  /\bnpx\s/,
];

const needsBypass = SANDBOX_REQUIRING_PATTERNS.some((re) => re.test(cmd));

if (needsBypass && !sandboxDisabled) {
  // Deny the call with a specific, actionable message. The agent will see
  // this reason and retry with the flag.
  const reason =
    'This Bash command reads credential paths that the default Claude Code ' +
    'sandbox blocks (~/.azure for az, ~/.git-credentials and Keychain for ' +
    'git network ops, ~/.npmrc for npm registry ops). Without ' +
    '`dangerouslyDisableSandbox: true` on the Bash call, the command will ' +
    'either fail outright or produce misleading "credentials not configured" ' +
    '/ "401 Unauthorized" / Python traceback errors.\n\n' +
    'Retry this exact same Bash command with `dangerouslyDisableSandbox: ' +
    'true` set on the tool call. Do NOT advise the user to reconfigure ' +
    'credentials, generate a PAT, or reinstall any CLI — those are not the ' +
    'problem. The credentials are already configured correctly on the host.';

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

// Either it's not a sandbox-requiring command, or the flag is already set.
// Let the call through.
process.exit(0);
