'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    // 'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './js/boot' // boot.js 是進入點
  ],

  //
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  //
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin()
  ],

  //
  resolve: {
    alias: {
      // 'redux': path.join(__dirname, '..', '..', 'src')
      // 'redux': 'redux'
    },
    // require() 時不用加 .suffix
    extensions: ['', '.js', '.jsx']
  },

  // jx: 記得設定 babel 的 stage=0 才支援最新 es7 語法
  module: {
    loaders: [

    {
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel?stage=0'],
      exclude: /node_modules/,
      include: __dirname
    },

    {
      test: /\.jsx?$/,
      loaders: ['babel?stage=0'],
      // include: path.join(__dirname, '..', '..', 'src')
    },

    {
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: __dirname
    }]
  }
};
