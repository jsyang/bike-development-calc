const path = require('path');
const webpack = require('webpack');
const webpackConfigAssign = require('webpack-config-assign');
const baseConfig = require('./webpack.config.base');

const clientEntry = (process.env.NODE_ENV === 'production') ?
    {
        main: './src/index.tsx',
    } :
    { 
        main: ['webpack-hot-middleware/client', './src/index.tsx']
    };

module.exports = [
    webpackConfigAssign({
        name: 'client',
        target: 'web',
        entry: clientEntry,
        output: {
            publicPath: '/',
            filename: '[name].js'
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    // https://webpack.js.org/guides/code-splitting-libraries/#implicit-common-vendor-chunk
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            })
        ]
    }, baseConfig)
];