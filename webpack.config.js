'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {

  devtool: '#inline-source-map',

  entry: [
	'webpack-hot-middleware/client',
	'./client/index.js' // client app 的進入點
  ],

  //
  output: {
	path: path.join(__dirname, 'build'),
	filename: 'bundle.js',
	publicPath: '/static/'
  },

  //
  plugins: [
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin()
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
		  loader: 'babel',
		  exclude: /node_modules/,
		  include: __dirname,
		  query: {
		    presets: [ 'react-hmre', "es2015", "stage-0", "react" ],
		    plugins: [ "transform-decorators-legacy" ],
		  }
		  /*query: {
		    "presets": [ "es2015", "stage-0", "react"],
		    "plugins": [ "transform-decorators-legacy", 'react-transform'],
			// 這裏就是直接貼上原本寫在 .babelrc 內的設定字串
		    "env": {
		  	  "development": {
		  		"presets": ["react-hmre"]
		  	  }
		  	}
		  }*/
		},
		{
		  test: /\.css$/,
		  loader: "style!css",
		},
	]
  }
};
