import { execSync } from 'child_process';
import { createInterface } from 'readline';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CACHE_FILE = path.join(projectRoot, 'node_modules', '.ids-update-check');

// Flags (any of these may be passed via `npm run check-updates -- <flag>`).
const args = process.argv.slice(2);
const flagYes = args.includes('--yes') || args.includes('--update');
const flagSkip = args.includes('--skip') || args.includes('--no');

// IDS ships new versions on Tuesdays. For automated (predev) runs, only
// re-check after a Tuesday→Wednesday boundary since the last check —
// surfacing each release cycle's updates the next day a project is opened,
// and not re-prompting again until the following cycle. Explicit
// `npm run check-updates` always checks, regardless of weekday.
function mostRecentWednesdayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  // getDay(): Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  const daysBack = (d.getDay() - 3 + 7) % 7;
  d.setDate(d.getDate() - daysBack);
  return d.getTime();
}

const isAutoCheck = process.env.npm_lifecycle_event === 'predev';

if (isAutoCheck && !flagYes && existsSync(CACHE_FILE)) {
  const lastCheck = parseInt(readFileSync(CACHE_FILE, 'utf8') || '0', 10);
  if (lastCheck >= mostRecentWednesdayMs()) process.exit(0);
}

// Find @ids/* and @ids-icons/* packages declared in package.json.
const pkgJson = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
const idsPkgs = Object.keys(allDeps).filter(
  (p) => p.startsWith('@ids/') || p.startsWith('@ids-icons/'),
);

if (idsPkgs.length === 0) process.exit(0);

// Check the registry for updates — npm show respects .npmrc registry settings.
const updates = [];
for (const pkg of idsPkgs) {
  try {
    const installedPath = path.join(projectRoot, 'node_modules', pkg, 'package.json');
    if (!existsSync(installedPath)) continue;
    const installed = JSON.parse(readFileSync(installedPath, 'utf8')).version;
    const latest = execSync(`npm show ${pkg} version`, {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
    if (installed !== latest) updates.push({ pkg, installed, latest });
  } catch {
    // Registry unreachable or package not found — skip silently.
  }
}

try { writeFileSync(CACHE_FILE, String(Date.now())); } catch {}

if (updates.length === 0) process.exit(0);

const installArgs = updates.map((u) => `${u.pkg}@latest`).join(' ');

console.log('\n  📦 IDS package updates available:');
for (const { pkg, installed, latest } of updates) {
  console.log(`     ${pkg}  ${installed} → ${latest}`);
}
console.log();

// Decide what to do based on flags / TTY.
if (flagYes) {
  console.log('  Installing updates...');
  execSync(`npm install ${installArgs}`, { cwd: projectRoot, stdio: 'inherit' });
  console.log('  ✔ Updated. Restart the dev server for changes to take effect.\n');
  process.exit(0);
}

if (flagSkip) {
  console.log(`  Skipped — run \`npm install ${installArgs}\` when ready.\n`);
  process.exit(0);
}

if (!process.stdin.isTTY) {
  console.log('  Non-interactive — to install:  npm run check-updates -- --yes');
  console.log('                       or skip:  npm run check-updates -- --skip\n');
  process.exit(0);
}

// Interactive prompt for humans.
const rl = createInterface({ input: process.stdin, output: process.stdout });
const answer = await new Promise((resolve) => rl.question('  Update now? (y/N) ', resolve));
rl.close();

if (!answer.trim().toLowerCase().startsWith('y')) {
  console.log(`  Skipped — run \`npm install ${installArgs}\` when ready.\n`);
  process.exit(0);
}

console.log('\n  Installing updates...');
execSync(`npm install ${installArgs}`, { cwd: projectRoot, stdio: 'inherit' });
console.log('  ✔ Updated. Restart the dev server for changes to take effect.\n');
