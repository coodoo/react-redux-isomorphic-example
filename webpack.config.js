'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    './js/boot-client' // client app 的進入點
  ],

  //
  output: {
    path: './build',
    filename: 'bundle.js',
    publicPath: '/build/'
  },

  //
  plugins: [
      /*new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          mangle: true,
          compress: {warnings: false}
      })*/
  ],

  //
  resolve: {
    alias: {
    },
    // require() 時不用加 .suffix
    extensions: ['', '.js', '.jsx']
  },

  // jx: 記得設定 babel 的 stage=0 才支援最新 es7 語法
  module: {
    loaders: [

    {
      test: /\.jsx?$/,
      loaders: ['babel?stage=0&compact=false'],
      exclude: /node_modules/,
      include: __dirname
    },

    {
      test: /\.css$/,
      loader: "style!css",
    },
    ]
  }
};
