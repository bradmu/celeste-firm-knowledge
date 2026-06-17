#!/usr/bin/env node
/**
 * Walks the project root, finds all ids-allow / ids-allow-file comments,
 * prints them with their reason. Used by `npm run lint:overrides`.
 */
import fs from 'fs';
import path from 'path';

const root = process.argv[2] || process.cwd();
const SKIP = /(?:^|\/)(?:node_modules|\.git|dist|build|\.next|_ids-preview)(?:\/|$)/;
const FILE_RE = /\.(css|scss|sass|less|js|jsx|ts|tsx)$/;
const LINE = /(?:\/\/|\/\*)\s*ids-allow:\s*(.+?)(?:\s*\*\/)?$/;
const FILE_LINE = /(?:\/\/|\/\*)\s*ids-allow-file:\s*(.+?)(?:\s*\*\/)?$/;

let count = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (SKIP.test(full)) continue;
    if (entry.isDirectory()) walk(full);
    else if (FILE_RE.test(entry.name)) scan(full);
  }
}

function scan(file) {
  const lines = fs.readFileSync(file, 'utf-8').split('\n');
  const head = lines.slice(0, 5);
  for (let i = 0; i < head.length; i++) {
    const m = head[i].match(FILE_LINE);
    if (m) {
      console.log(`${file}: file-level override — ${m[1].trim()}`);
      count++;
      return; // file-level applies to the whole file; don't double-count line overrides
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(LINE);
    if (m) {
      console.log(`${file}:${i + 1} reason: ${m[1].trim()}`);
      count++;
    }
  }
}

walk(root);
console.log(`\n${count} override(s) found.`);
process.exit(0);
