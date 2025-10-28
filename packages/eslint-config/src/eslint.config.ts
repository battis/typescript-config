import eslint from '@eslint/js';
import markdown from '@eslint/markdown';
import eslintConfigPrettier from 'eslint-config-prettier';
import html from 'eslint-plugin-html';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.html'],
    plugins: { html }
  },
  {
    files: ['**/*.md'],
    plugins: {
      markdown
    },
    extends: ['markdown/recommended']
  },
  { languageOptions: { globals: globals.node } },
  { ignores: ['**/dist/*'] }
);
