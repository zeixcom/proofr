var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./config/webpack.base.config');

module.exports = env => {
  if (env.NODE_ENV === 'dev') {
    return baseWebpackConfig;
  } else {
    return merge(baseWebpackConfig, {
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compres: {
            warnings: false,
          },
          sourceMap: true
        })
      ]
    })
  }
}