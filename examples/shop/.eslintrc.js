module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jest/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['@typescript-eslint', 'prettier', 'react', 'jest', 'react-hooks'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: '.',
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
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '_.+', argsIgnorePattern: '_.+' }],
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'prettier/prettier': 'warn',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        react: {
            version: 'detect',
        },
    },
    ignorePatterns: ['webpack.config.js'],
};
