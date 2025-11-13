import type { Config } from 'prettier';

/**
 * @see https://prettier.io/docs/configuration
 */
const config: Config = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react(.*)',
    '^next(.*)',
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$',
    '^[./]',
  ],
};

export default config;

