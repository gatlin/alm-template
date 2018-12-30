var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var config = (env, argv) => ({
    devtool: 'inline-source-map',
    entry: {
        'main': './src/main.ts',
        'main.min': './src/main.ts'
    },

    output: {
        path: path.resolve(__dirname, 'js'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx' ]
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: false,
                parallel: true,
                uglifyOptions: {
                    compress: true,
                    ecma: 5,
                    mangle: true
                }
            })
        ]
    },

    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        },{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }]
    }
});

module.exports = config;
