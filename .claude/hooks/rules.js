import path from 'path';
import { fileIsAllowlisted, lineIsAllowlisted } from './overrides.js';

const SKIP_PATH = /(?:^|\/)(?:node_modules|_ids-preview|dist|build|\.next)(?:\/|$)/;

const HEX_RE = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;
const RGB_RE = /\brgba?\s*\(/i;
const HSL_RE = /\bhsla?\s*\(/i;
const NAMED_COLOURS = new Set([
  'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink',
  'black', 'white', 'gray', 'grey', 'cyan', 'magenta',
]);

const STYLE_PROP_RE =
  /\b(?:color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?(?:-color)?|fill|stroke|outline-color)\s*:/i;
const LENGTH_RE = /(\d+(?:\.\d+)?)(px|rem|em)\b/g;
const ALLOWED_LENGTHS = new Set(['0px', '1px', '2px']);

const RAW_ELEMENTS = ['button', 'input', 'select', 'textarea'];
const RAW_INTERACTIVE_RE = new RegExp(
  `<(${RAW_ELEMENTS.join('|')})\\b`,
  'g',
);
const RAW_LINK_WITH_HANDLER_RE = /<a\b[^>]*\bonClick=/g;

const UDS_TAG_RE = /<(Uds[A-Z]\w*)\b/g;
const WC_TAG_RE = /<(uds-[a-z][a-z0-9-]*)\b/g;
const ICON_PROP_RE =
  /(?:leftIcon|rightIcon|left-icon|right-icon|iconName|icon-name|icon)\s*=\s*["']([^"']+)["']/g;

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function closestMatch(target, set) {
  let best = null;
  let bestDist = Infinity;
  for (const candidate of set) {
    const d = levenshtein(target, candidate);
    if (d < bestDist) {
      bestDist = d;
      best = candidate;
    }
  }
  return bestDist <= 3 ? best : null;
}

function stripInlineComments(line) {
  // Remove /* ... */ block comments (single-line ones) and // line comments.
  // Crude but sufficient for our use — we're checking presence of patterns
  // in code, not semantics.
  return line.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/, '');
}

function scanColours(line, lineNo, violations) {
  const codeOnly = stripInlineComments(line);
  const reasons = [];
  if (HEX_RE.test(codeOnly)) reasons.push('hex literal');
  if (RGB_RE.test(codeOnly)) reasons.push('rgb()/rgba()');
  if (HSL_RE.test(codeOnly)) reasons.push('hsl()/hsla()');
  if (STYLE_PROP_RE.test(codeOnly)) {
    for (const name of NAMED_COLOURS) {
      const re = new RegExp(`\\b${name}\\b`, 'i');
      if (re.test(codeOnly.split(':').slice(1).join(':'))) {
        reasons.push(`named colour "${name}"`);
        break;
      }
    }
  }
  if (reasons.length === 0) return;
  violations.push({
    type: 'hardcoded-colour',
    line: lineNo,
    snippet: line.trim(),
    remediation:
      `Use a token: var(--ids-color-...). See @ids/tokens. ` +
      `Reasons: ${reasons.join(', ')}.`,
  });
}

function scanLengths(line, lineNo, violations) {
  if (!STYLE_PROP_RE.test(line) && !/\b(?:margin|padding|gap|width|height|top|right|bottom|left)\s*:/.test(line)) return;
  let m;
  LENGTH_RE.lastIndex = 0;
  while ((m = LENGTH_RE.exec(line)) !== null) {
    const literal = `${m[1]}${m[2]}`;
    if (ALLOWED_LENGTHS.has(literal)) continue;
    violations.push({
      type: 'hardcoded-length',
      line: lineNo,
      snippet: line.trim(),
      remediation: `Use var(--ids-space-*) instead of ${literal}.`,
    });
    return;
  }
}

function scanRawInteractive(line, lineNo, violations) {
  RAW_INTERACTIVE_RE.lastIndex = 0;
  let m;
  while ((m = RAW_INTERACTIVE_RE.exec(line)) !== null) {
    const tag = m[1];
    const replacement = {
      button: '<UdsButton label="..." onClick={...} />',
      input: '<UdsInput value={...} onChange={...} />',
      select: '<UdsSelect ... />',
      textarea: '<UdsTextarea ... />',
    }[tag];
    violations.push({
      type: 'raw-interactive-element',
      line: lineNo,
      snippet: line.trim(),
      remediation: `Replace <${tag}> with ${replacement}.`,
    });
  }
  if (RAW_LINK_WITH_HANDLER_RE.test(line)) {
    violations.push({
      type: 'raw-interactive-element',
      line: lineNo,
      snippet: line.trim(),
      remediation: 'Use <UdsButton variant="link" ...> for clickable links.',
    });
  }
}

function scanUdsComponents(line, lineNo, violations, components) {
  if (components.size === 0) return;
  let m;
  UDS_TAG_RE.lastIndex = 0;
  while ((m = UDS_TAG_RE.exec(line)) !== null) {
    if (!components.has(m[1])) {
      const suggestion = closestMatch(m[1], components);
      violations.push({
        type: 'unknown-uds-component',
        line: lineNo,
        snippet: line.trim(),
        remediation: suggestion
          ? `<${m[1]}> not in manifest. Did you mean <${suggestion}>?`
          : `<${m[1]}> not in manifest. List components from @ids/<pkg>/manifest.json.`,
      });
    }
  }
}

function scanIcons(line, lineNo, violations, iconNames) {
  if (iconNames.size === 0) return;
  let m;
  ICON_PROP_RE.lastIndex = 0;
  while ((m = ICON_PROP_RE.exec(line)) !== null) {
    const name = m[1];
    if (!iconNames.has(name)) {
      const suggestion = closestMatch(name, iconNames);
      violations.push({
        type: 'invalid-icon',
        line: lineNo,
        snippet: line.trim(),
        suggestion,
        remediation: suggestion
          ? `Icon "${name}" not found. Did you mean "${suggestion}"?`
          : `Icon "${name}" not found in @ids-icons/assets/icons.json.`,
      });
    }
  }
}

function scanWebComponents(line, lineNo, violations, components) {
  if (!components || components.size === 0) return;
  WC_TAG_RE.lastIndex = 0;
  let m;
  while ((m = WC_TAG_RE.exec(line)) !== null) {
    const tag = m[1];
    if (!components.has(tag)) {
      const suggestion = closestMatch(tag, components);
      violations.push({
        type: 'unknown-web-component',
        line: lineNo,
        snippet: line.trim(),
        suggestion,
        remediation: suggestion
          ? `<${tag}> not in manifest. Did you mean <${suggestion}>?`
          : `<${tag}> not in manifest. List components from @ids/web-components/manifest.json.`,
      });
    }
  }
}

export function scanContent({ filePath, content, manifests, family }) {
  if (typeof content !== 'string' || !filePath) return [];
  if (SKIP_PATH.test(filePath)) return [];
  if (path.extname(filePath) === '.md') return [];

  const isHtml = /\.html?$/i.test(filePath);
  const isStyle = /\.(css|scss|sass|less)$/.test(filePath);
  const isJsx = /\.(jsx|tsx)$/.test(filePath);

  // Only scan files we know how to handle. HTML only enters scope for the
  // web-components family.
  if (!isStyle && !isJsx && !(isHtml && family === 'web-components')) {
    return [];
  }

  if (fileIsAllowlisted(content, filePath)) return [];

  const violations = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;
    if (lineIsAllowlisted(line)) continue;

    if (isStyle) {
      scanColours(line, lineNo, violations);
      scanLengths(line, lineNo, violations);
    }
    if (isJsx) {
      scanRawInteractive(line, lineNo, violations);
      scanUdsComponents(line, lineNo, violations, manifests.components);
      scanIcons(line, lineNo, violations, manifests.iconNames);
      // Inline styles on JSX should also be colour-checked
      if (/style\s*=\s*\{\{/.test(line)) {
        scanColours(line, lineNo, violations);
      }
    }
    if (isHtml && family === 'web-components') {
      scanWebComponents(line, lineNo, violations, manifests.components);
    }
  }
  return violations;
}
