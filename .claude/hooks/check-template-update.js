#!/usr/bin/env node
/**
 * SessionStart hook. When a newer create-intapp-app is published, emit
 * additionalContext so the agent can proactively offer to upgrade the
 * scaffolded project.
 *
 * Cadence: cached at node_modules/.intapp-update-check; checks at most once
 * per Tuesday→Wednesday window (same cadence as the predev nudge).
 *
 * Test bypass: INTAPP_LATEST_VERSION_OVERRIDE skips both the npm registry
 * call and the cadence cache so tests are deterministic.
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const CACHE_FILE = path.join(projectRoot, 'node_modules', '.intapp-update-check');

function mostRecentWednesdayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const daysBack = (d.getDay() - 3 + 7) % 7;
  d.setDate(d.getDate() - daysBack);
  return d.getTime();
}

// Honor the cadence cache unless an override is set (tests bypass it).
if (!process.env.INTAPP_LATEST_VERSION_OVERRIDE && existsSync(CACHE_FILE)) {
  const lastCheck = parseInt(readFileSync(CACHE_FILE, 'utf8') || '0', 10);
  if (lastCheck >= mostRecentWednesdayMs()) process.exit(0);
}

const pkgPath = path.join(projectRoot, 'package.json');
if (!existsSync(pkgPath)) process.exit(0);
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const marker = pkg.intapp;
if (!marker?.scaffoldVersion) process.exit(0);

let latest = process.env.INTAPP_LATEST_VERSION_OVERRIDE;
if (!latest) {
  try {
    latest = execSync('npm show @ids/create-intapp-app version', {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
  } catch {
    // Registry unreachable — exit silently.
    process.exit(0);
  }
}

if (!process.env.INTAPP_LATEST_VERSION_OVERRIDE) {
  try {
    writeFileSync(CACHE_FILE, String(Date.now()));
  } catch {
    // Cache write failure is non-fatal.
  }
}

if (latest === marker.scaffoldVersion) process.exit(0);

const msg =
  `create-intapp-app ${latest} is available (this project is on ${marker.scaffoldVersion}). ` +
  `The user can run \`npx create-intapp-app upgrade\` or ask you to update the project.`;

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: msg,
    },
  }),
);
