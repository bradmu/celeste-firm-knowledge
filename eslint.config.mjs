import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// IDS lint rules are disabled in this repo — see memory/feedback_ignore_uds_use_shadcn.
// To re-enable them, restore the original eslint.config.mjs from git history; the
// rule sources still live under ./lint/eslint-rules/.

export default [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // ShadCN vendored components reference React.ComponentProps etc. — TS handles
      // those at type level; no need for ESLint to flag them.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      // Silent catches are intentional in our scaffolded scripts (cache writes,
      // best-effort parses). Keep the rule on so empty if/while/etc. still error,
      // but allow `catch {}` specifically.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    // Don't lint vendored ShadCN files, the IDS preview route, or scaffolding.
    ignores: [
      '_ids-preview/**',
      'app/_ids-preview/**',
      'components/ui/**',
      'hooks/use-mobile.ts',
      'lint/**',
      'scripts/**',
      '.next/**',
    ],
  },
  prettierConfig,
];
