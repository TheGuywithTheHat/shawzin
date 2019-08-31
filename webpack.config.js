const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([{ from: path.join(__dirname, 'public'), to: path.join(__dirname, 'build') }]),
        //new CompressionPlugin(),
        new VueLoaderPlugin(),
    ]
};