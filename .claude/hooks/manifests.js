import fs from 'fs';
import path from 'path';

function readJsonIfExists(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

function loadComponents(nodeModulesPath, pkgName) {
  const base = path.join(nodeModulesPath, pkgName);
  if (!fs.existsSync(base)) return null;
  const candidates = [
    path.join(base, 'manifest.json'),
    path.join(base, 'dist', 'manifest.json'),
    path.join(base, 'claude', 'docs', 'components.json'),
  ];
  for (const c of candidates) {
    const data = readJsonIfExists(c);
    if (data && Array.isArray(data.components)) return new Set(data.components);
  }
  return new Set();
}

function loadIcons(nodeModulesPath) {
  const candidates = [
    path.join(nodeModulesPath, '@ids-icons', 'assets', 'icons.json'),
    path.join(nodeModulesPath, '@ids-icons', 'icons.json'),
  ];
  for (const c of candidates) {
    const data = readJsonIfExists(c);
    if (data && Array.isArray(data.icons)) return new Set(data.icons);
  }
  return new Set();
}

/**
 * Loads the live IDS validation set from an installed node_modules tree.
 * Returns null if the components package itself is missing (signals "skip
 * with non-blocking warning"). Returns empty sets for tokens/icons if those
 * are missing — the violation rules treat empty sets as "anything goes".
 */
export function loadManifests({ nodeModulesPath, pkgName, family }) {
  const components = loadComponents(nodeModulesPath, pkgName);
  if (components === null) return null;
  return {
    components,
    iconNames: loadIcons(nodeModulesPath),
    family,
    pkgName,
  };
}
