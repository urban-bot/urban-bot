module.exports = {
    parser: 'babel-eslint',
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jest/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    rules: {
        'react/prop-types': 0,
        'no-unused-vars': [2, { varsIgnorePattern: '_.+' }],
    },
};
