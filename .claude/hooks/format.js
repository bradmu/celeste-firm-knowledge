export function formatBlockMessage({ filePath, pkgName, violations }) {
  const lines = [
    `IDS rule violation — write blocked.`,
    `File: ${filePath}`,
    `IDS package: ${pkgName}`,
    ``,
    `Violations:`,
  ];
  for (const v of violations) {
    lines.push(`  • [${v.type}] line ${v.line}: ${v.snippet}`);
    lines.push(`      → ${v.remediation}`);
  }
  lines.push(
    ``,
    `Reference: node_modules/${pkgName}/claude/docs/`,
    ``,
    `Override (if genuinely needed): add \`// ids-allow: <reason>\` on the same`,
    `line, or \`// ids-allow-file: <reason>\` at the top of the file. You MUST`,
    `confirm with the user before using any override. Default action is to`,
    `fix the violation.`,
  );
  return lines.join('\n');
}
