// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      prettier,
      importPlugin.flatConfigs?.recommended,
      unicornPlugin.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
    ],
    plugins: {
      tsdoc: tsdocPlugin,
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json'],
        createDefaultProgram: true,
      },
      globals: {
        ...globals.builtin,
        ...globals.jasmine,
        ...globals.node,
      },
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      'import/no-unresolved': 'error', // Reporta erros para importações não resolvidas
      'import/order': [ // Regras para ordem das importações
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            ['sibling', 'parent'],
            'index',
            'unknown',
          ],
          'newlines-between': 'always',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': false,
          },
        },
      ],
      'sort-imports': [ // Regras para ordenar as importações
        'error',
        {
          'ignoreCase': false,
          'ignoreDeclarationSort': true,
          'ignoreMemberSort': false,
          'allowSeparatedGroups': true,
          'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
        },
      ],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'always-multiline'],
      'complexity': ['error', { max: 20 }],
      'curly': 'error',
      'eol-last': ['error', 'always'],
      'max-lines': ['off', 400],
      'max-len': ['error', { code: 140, ignoreComments: true }],
      'multiline-ternary': ['error', 'always-multiline'],
      'no-debugger': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': 'error',
      'no-empty': 'error',
      'no-extra-bind': 'error',
      'no-extra-semi': 'error',
      'no-fallthrough': 'error',
      'no-lonely-if': 'error',
      'no-multi-spaces': 'error',
      'no-new-func': 'error',
      'no-plusplus': 'off',
      'no-redeclare': 'error',
      'no-restricted-syntax': ['error'],
      'no-return-await': 'error',
      'no-sequences': 'error',
      'no-shadow': 'off',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-undef': 'warn',
      'no-underscore-dangle': 'off',
      'no-unneeded-ternary': 'error',
      'no-void': 'error',
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: 'case',
          next: 'case',
        },
        {
          blankLine: 'always',
          prev: 'const',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'const',
          next: 'const',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'let',
        },
        {
          blankLine: 'any',
          prev: 'let',
          next: 'let',
        },
        {
          blankLine: 'always',
          prev: 'block',
          next: '*',
        },
      ],
      'prefer-object-spread': 'error',
      'prefer-template': 'error',
      'quotes': ['error', 'single'],
      'require-await': 'off',
      'semi': ['error', 'always'],
      'space-before-blocks': 'error',
      'space-in-parens': ['error', 'never'],
      'spaced-comment': ['error', 'always'],
      'yoda': 'error',
      'no-console': 'error', // Reporta warnings para chamadas de console
      'arrow-body-style': 'off', // Desativa regra de estilo para corpos de arrow functions
      'prefer-arrow-callback': 'off', // Desativa preferência por callbacks de arrow functions
      'no-empty-function': 'off', // Desativa a regra de funções vazias
      '@typescript-eslint/no-non-null-assertion': 'off', // Desativa regra de non-null assertion
      '@typescript-eslint/no-explicit-any': 'off', // Desativa regra de any explícito
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
      ],
      'unicorn/no-array-callback-reference': ['off'],
      'unicorn/no-null': ['off'],
      'unicorn/no-process-exit': ['off'],
      'unicorn/numeric-separators-style': ['off'],
      'unicorn/prefer-module': ['off'],
      'unicorn/prefer-top-level-await': ['off'],
      'unicorn/import-style': ['off'],
      'unicorn/no-await-expression-member': ['off'],
      'unicorn/prevent-abbreviations': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/member-ordering': [ 'off' ],    
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-extraneous-class': [
        'error',
        {
          'allowEmpty': true,
          'allowStaticOnly': true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    ignores: [
      'commitlint.config.js',
      'eslint.config.mjs',
      'dist',
      'node_modules',
      'src/config/swagger/metadata.ts',
      'statics',
      'dist/**/*.d.ts'
    ],
  },
);
