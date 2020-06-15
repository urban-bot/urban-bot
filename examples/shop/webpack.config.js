const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => ({
    entry: './src/index.ts',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : undefined,
    plugins: [],
    externals: [
        nodeExternals(),
        nodeExternals({
            modulesDir: path.resolve(__dirname, '../../node_modules'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /.+/,
                exclude: /node_modules|(\.(jsx?|tsx?|json)$)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    target: 'node',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
});
