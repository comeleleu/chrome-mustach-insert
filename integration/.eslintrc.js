module.exports = {
    env: {
        browser: true,
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        allowImportExportEverywhere: true,
    },
    extends: 'airbnb-base',
    plugins: ['html'],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
    },
};
