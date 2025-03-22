// eslint.config.js
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['node_modules', 'dist', 'build'], // Ignore unnecessary folders
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Disable linting of native JS calls
      'no-restricted-globals': 'off',
      'no-restricted-properties': 'off',

      // Recommended TypeScript rules
      '@typescript-eslint/no-unused-vars': 'warn',

      // React Rules
      'react/prop-types': 'off',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
];
