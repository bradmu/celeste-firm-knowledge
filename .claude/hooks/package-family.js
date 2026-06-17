const PRIORITY = [
  { family: 'react-next', pkgName: '@ids/react-next' },
  { family: 'react', pkgName: '@ids/react' },
  { family: 'web-components', pkgName: '@ids/web-components' },
];

export function detectPackageFamily(pkgJson) {
  if (!pkgJson || typeof pkgJson !== 'object') return null;
  const deps = { ...(pkgJson.dependencies ?? {}), ...(pkgJson.devDependencies ?? {}) };
  for (const candidate of PRIORITY) {
    if (deps[candidate.pkgName]) return candidate;
  }
  return null;
}
