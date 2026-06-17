import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CACHE_FILE = path.join(projectRoot, 'node_modules', '.intapp-update-check');

// Mirror the Tuesday→Wednesday cadence of check-ids-updates.js.
function mostRecentWednesdayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const daysBack = (d.getDay() - 3 + 7) % 7;
  d.setDate(d.getDate() - daysBack);
  return d.getTime();
}

const isAutoCheck = process.env.npm_lifecycle_event === 'predev';
if (isAutoCheck && existsSync(CACHE_FILE)) {
  const lastCheck = parseInt(readFileSync(CACHE_FILE, 'utf8') || '0', 10);
  if (lastCheck >= mostRecentWednesdayMs()) process.exit(0);
}

const pkgPath = path.join(projectRoot, 'package.json');
if (!existsSync(pkgPath)) process.exit(0);
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const marker = pkg.intapp;
if (!marker?.scaffoldVersion) process.exit(0);

let latest;
try {
  latest = execSync('npm show @ids/create-intapp-app version', { encoding: 'utf8', stdio: 'pipe' }).trim();
} catch {
  // Registry unreachable — exit silently
  process.exit(0);
}
try { writeFileSync(CACHE_FILE, String(Date.now())); } catch {}

if (latest === marker.scaffoldVersion) process.exit(0);

console.log();
console.log(`  ℹ  create-intapp-app updates available (you're on ${marker.scaffoldVersion}, latest is ${latest}).`);
console.log('     Run `npx create-intapp-app upgrade` to apply.');
console.log();
