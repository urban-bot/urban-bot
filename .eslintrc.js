module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    env: {
        node: true,
        es6: true,
    },
    rules: {
        'react/prop-types': 0,
        'no-unused-vars': [2, { varsIgnorePattern: '_.+' }],
    },
};
