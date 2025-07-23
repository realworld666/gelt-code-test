import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import eslintPluginImport from 'eslint-plugin-import';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import { getTsconfig } from 'get-tsconfig';
import path from 'path';

const tsconfig = getTsconfig();
if (tsconfig == null) {
  throw new Error('Unable to find tsconfig.json');
}

const config = [
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parser: {
          js: 'espree',
          ts: typescriptEslintParser,
        },
      },
    },
    plugins: {
      vue: vuePlugin,
      import: eslintPluginImport,
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      // General rules
      'no-console': 'off',
      'no-debugger': 'error',
      'no-shadow': 'off',
      // Vue recommended rules
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/no-mutating-props': 'error',
      'vue/no-v-html': 'off',
      'vue/require-v-for-key': 'error',
      'vue/require-valid-default-prop': 'error',
      'vue/no-template-shadow': 'error',
      'vue/no-reserved-component-names': 'error',
      'vue/no-reserved-keys': 'error',
      'vue/no-dupe-keys': 'error',
      'vue/no-duplicate-attributes': 'error',
      'vue/no-parsing-error': 'error',
      'vue/no-shared-component-data': 'error',
      'vue/require-component-is': 'error',
      // TypeScript rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.js'],
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/order': 'off',
      'import/prefer-default-export': 'off',
      'no-restricted-syntax': [
        'off',
        { selector: 'ForInStatement' },
        { selector: 'ForOfStatement' },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: path.basename(tsconfig.path),
        tsconfigRootDir: path.dirname(tsconfig.path),
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      import: eslintPluginImport,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },
];

export default config;
