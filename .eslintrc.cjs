module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    plugins: ['svelte3', '@typescript-eslint', 'no-autofix'],
    ignorePatterns: ['*.cjs'],
    overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
    rules: {
        "prefer-const": "off",
        "no-autofix/prefer-const": "warn",
    },
    settings: {
        'svelte3/typescript': require('typescript')
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
};