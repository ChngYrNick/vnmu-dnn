import eslint from '@eslint/js';
import globals from 'globals';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

const config = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: { prettier: pluginPrettier },
    ignores: ['node_modules/*'],
    rules: {
      ...eslint.configs.recommended.rules,
      ...configPrettier.rules,
    },
  },
];

export default config;
