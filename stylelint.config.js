/**
 * Stylelint config for the Celeste prototype. The IDS hex/rgb rules
 * stay as warnings (advisory only). The shadcn-based prototype uses
 * its own Tailwind v4 tokens in `app/globals.css`, so we skip
 * stylelint-config-standard's strict formatting rules that flag the
 * shadcn token block.
 */
export default {
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
