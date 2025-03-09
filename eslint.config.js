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
    plugins: { prettier: pluginPrettier },
    files: ['**/*.js'],
    ignores: ['node_modules/*', 'src/infrastructure/web/ui/**/*'],
    rules: {
      ...eslint.configs.recommended.rules,
      ...configPrettier.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: { prettier: pluginPrettier, html: pluginHTML },
    files: ['**/*.html', 'src/infrastructure/web/ui/**/*.js'],
    ignores: ['node_modules/*'],
    rules: {
      ...eslint.configs.recommended.rules,
      ...configPrettier.rules,
      'prettier/prettier': 'error',
    },
  },
];

export default config;
