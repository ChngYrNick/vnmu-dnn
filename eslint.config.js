import eslint from '@eslint/js';
import globals from 'globals';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginHTML from 'eslint-plugin-html';

const config = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: { prettier: pluginPrettier, html: pluginHTML },
    files: ['**/*.html'],
    ignores: ['node_modules/*'],
    rules: {
      ...eslint.configs.recommended.rules,
      ...configPrettier.rules,
    },
  },
];

export default config;
