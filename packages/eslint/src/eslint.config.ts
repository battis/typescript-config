import eslint from '@eslint/js';
import { TSESLint } from '@typescript-eslint/utils';
import eslintConfigPrettier from 'eslint-config-prettier';
import html from 'eslint-plugin-html';
import markdown from 'eslint-plugin-markdown';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  markdown.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.html'],
    plugins: { html }
  },
  { languageOptions: { globals: globals.node } },
  { ignores: ['**/dist/*'] }
) as TSESLint.FlatConfig.ConfigArray;
