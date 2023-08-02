module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  globals: {
    HTMLElement: 'readonly',
    HTMLButtonElement: 'readonly',
    HTMLInputElement: 'readonly',
    JSX: true,
    document: 'readonly',
    fetch: true,
    localStorage: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      jsx: true,
      tsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'sort-class-members',
    'sort-destructure-keys',
    '@typescript-eslint',
    'react',
    'react-hooks',
    'prettier',
    'deprecation'
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': [
      'warn',
      {
        allowSingleExtends: true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'deprecation/deprecation': 'off',
    'lines-between-class-members': 'error',
    'no-console': 'warn',
    'no-unused-vars': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'react/prop-types': 'off',
    semi: ['error', 'always'],
    'sort-class-members/sort-class-members': [
      2,
      {
        accessorPairPositioning: 'getThenSet',
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]'
        ]
      }
    ],
    'sort-destructure-keys/sort-destructure-keys': 2
  },
  ignorePatterns: ['public/*'],
  settings: {
    react: {
      version: 'detect'
    }
  }
};