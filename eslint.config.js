// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

import unusedImports from 'eslint-plugin-unused-imports'

export default [
  ...tanstackConfig,
  {
    name: 'tanstack/temp',
    rules: {
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-shadow': 'off',
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'vitest.config.ts',
      'tsup.config.ts',
    ],
  },
]
