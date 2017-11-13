var path = require('path');
var webpack = require('webpack');

var config = {
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

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            include: /\.min\.js$/
        })
    ],

    module: {
        loaders: [{
            test: /\.tsx?$/,
            loaders: [
                'babel-loader',
                'awesome-typescript-loader'
            ],
            exclude: /node_modules/
        }]
    }
};

module.exports = config;
