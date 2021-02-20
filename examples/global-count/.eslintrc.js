module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jest/recommended',
    ],
    plugins: ['prettier', 'react', 'jest', 'react-hooks'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    rules: {
        'react/prop-types': 'off',
        'no-unused-vars': ['error', { varsIgnorePattern: '_.+', argsIgnorePattern: '_.+' }],
        'prettier/prettier': 'warn',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx'],
            },
        },
        react: {
            version: 'detect',
        },
    },
    ignorePatterns: ['webpack.config.js'],
};
