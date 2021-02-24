const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => ({
    entry: './src/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : undefined,
    plugins: [],
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /.+/,
                exclude: /node_modules|(\.(jsx?|json)$)/,
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
        extensions: ['.js', '.jsx', '.json'],
    },
});
