var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: {
    '../dist/index.js': './src/js/index.js',
    '../dist/main.css': './src/css/main.scss'
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-formatter-pretty')
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: ['node_modules']
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: 'inline'
              }
            }
          ]
        }),
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name]',
      allChunks: true,
    }),
    new StyleLintPlugin({ syntax: 'scss' }),
  ],
};
