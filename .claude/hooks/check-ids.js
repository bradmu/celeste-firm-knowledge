#!/usr/bin/env node
/**
 * PreToolUse hook for Claude Code and Cursor 2.4+. Reads a JSON payload on
 * stdin, validates the proposed Write/Edit content against the live IDS
 * package set, and exits:
 *   0 — clean (allow write) or fail-open (unknown payload, internal error)
 *   1 — skip with non-blocking warning (e.g. node_modules not installed)
 *   2 — block; structured remediation on stderr
 *
 * Project root for manifest discovery defaults to the directory containing
 * the file being written, walking up to find package.json. Override with
 * IDS_HOOK_PROJECT_ROOT for tests.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalisePayload } from './payload.js';
import { detectPackageFamily } from './package-family.js';
import { loadManifests } from './manifests.js';
import { scanContent } from './rules.js';
import { formatBlockMessage } from './format.js';

const LOG_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'check-ids.log',
);

function log(msg) {
  try {
    fs.appendFileSync(LOG_PATH, `[${new Date().toISOString()}] ${msg}\n`);
  } catch {}
}

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(''));
  });
}

function findProjectRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

async function main() {
  let raw;
  try {
    const text = await readStdin();
    raw = text ? JSON.parse(text) : null;
  } catch (e) {
    log(`stdin parse error: ${e.message}`);
    process.exit(0);
  }

  const payload = normalisePayload(raw);
  if (!payload) {
    log('payload not actionable; allow');
    process.exit(0);
  }

  const explicitRoot = process.env.IDS_HOOK_PROJECT_ROOT;
  const projectRoot = explicitRoot ?? findProjectRoot(path.dirname(payload.filePath));

  if (!projectRoot) {
    log('project root not found; allow');
    process.exit(0);
  }

  let pkgJson;
  try {
    pkgJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
  } catch (e) {
    // If the caller explicitly set the project root, treat missing package.json
    // as "not installed yet" — exit 1 (non-blocking skip) rather than fail-open.
    // If we discovered the root automatically, fail-open to avoid false positives.
    if (explicitRoot) {
      process.stderr.write(
        `IDS hook: project root set to ${projectRoot} but package.json is missing ` +
        `or unreadable — skipping checks. Run \`npm install\` to enable strict IDS validation.\n`,
      );
      process.exit(1);
    }
    log(`cannot read package.json at ${projectRoot}: ${e.message}`);
    process.exit(0);
  }

  const family = detectPackageFamily(pkgJson);
  if (!family) {
    log('no @ids/* package family detected; allow');
    process.exit(0);
  }

  const manifests = loadManifests({
    nodeModulesPath: path.join(projectRoot, 'node_modules'),
    pkgName: family.pkgName,
    family: family.family,
  });
  if (!manifests) {
    process.stderr.write(
      `IDS hook: ${family.pkgName} not installed yet — skipping checks. ` +
      `Run \`npm install\` to enable strict IDS validation.\n`,
    );
    process.exit(1);
  }

  let violations;
  try {
    violations = scanContent({
      filePath: payload.filePath,
      content: payload.newContent,
      manifests,
      family: family.family,
    });
  } catch (e) {
    log(`scan error: ${e.message}`);
    process.exit(0);
  }

  if (violations.length === 0) process.exit(0);

  process.stderr.write(
    formatBlockMessage({
      filePath: payload.filePath,
      pkgName: family.pkgName,
      violations,
    }) + '\n',
  );
  process.exit(2);
}

main().catch((e) => {
  log(`unhandled: ${e.message}`);
  process.exit(0);
});
