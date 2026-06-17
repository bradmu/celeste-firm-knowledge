/**
 * Stylelint config for IDS-strict projects. Flags hex/rgb/named colours
 * and hardcoded px/rem/em on layout properties. All rules report at
 * `warning` severity — surfaces violations without blocking commits or
 * CI builds, letting authors clean up at their own pace. Honours
 * stylelint-disable comments AND ids-allow comments.
 */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-no-hex': [true, { message: 'Use var(--ids-color-*) tokens — see @ids/tokens.', severity: 'warning' }],
    'color-named': ['never', { message: 'Use var(--ids-color-*) tokens.', severity: 'warning' }],
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla'],
      { message: 'Use var(--ids-color-*) tokens.', severity: 'warning' },
    ],
    'declaration-property-unit-disallowed-list': [
      { '/^(margin|padding|gap|width|height|top|right|bottom|left|font-size)$/': ['px', 'rem', 'em'] },
      { message: 'Use var(--spacing-*) tokens for layout properties.', severity: 'warning' },
    ],
  },
  ignoreFiles: ['_ids-preview/**', 'node_modules/**', 'dist/**', 'build/**'],
};
