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

function closest(target, list) {
  let best = null, bestDist = Infinity;
  for (const c of list) {
    const d = levenshtein(target, c);
    if (d < bestDist) { bestDist = d; best = c; }
  }
  return bestDist <= 3 ? best : null;
}

const ICON_PROPS = new Set(['leftIcon', 'rightIcon', 'left-icon', 'right-icon', 'iconName', 'icon-name', 'icon']);

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Validate IDS icon names against installed icon manifest.' },
    messages: {
      invalidIcon: 'Icon "{{name}}" is not in the IDS icon manifest.{{suggestion}}',
    },
    schema: [{
      type: 'object',
      properties: { icons: { type: 'array', items: { type: 'string' } } },
      additionalProperties: false,
    }],
  },
  create(context) {
    const icons = context.options[0]?.icons ?? [];
    if (icons.length === 0) return {};
    return {
      JSXAttribute(node) {
        if (node.name.type === 'JSXIdentifier' && !ICON_PROPS.has(node.name.name)) return;
        if (!node.value || node.value.type !== 'Literal' || typeof node.value.value !== 'string') return;
        const name = node.value.value;
        if (icons.includes(name)) return;
        const guess = closest(name, icons);
        const suggestion = guess ? ` Did you mean "${guess}"?` : '';
        context.report({
          node: node.value,
          messageId: 'invalidIcon',
          data: { name, suggestion },
        });
      },
    };
  },
};
