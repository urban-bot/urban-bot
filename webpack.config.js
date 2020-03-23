const path = require('path');

module.exports = {
    mode: 'development',
    entry: './examples/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                            ],
                            '@babel/plugin-proposal-optional-chaining',
                        ],
                    },
                },
            },
        ],
    },
    target: 'node',
};
