
// process.stdout.write('\u001B[2J\u001B[0;0f');

var fs = require('fs');
var express = require('express');
var path = require('path');

import React from 'react'
import { renderToString } from 'react-dom/server'

import { Router, RouterContext, match } from 'react-router';
import routes from '../common/routes/routing';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';

import promiseMiddleware from '../common/middlewares/PromiseMiddleware';
import combinedReducers from '../common/reducers';

const finalCreateStore = applyMiddleware(promiseMiddleware)( createStore );

// console.log( '環境: ', process.env.NODE_ENV )

var app = express();
// app.use('/build', express.static(path.join(__dirname, '../build')))
app.use('/assets', express.static(path.join(__dirname, '../client/assets')))

//----------------------------
// 啟用新版 webpack HMR 功能
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('../webpack.config')
var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))
//
//----------------------------


/*
// 重要：切換是否要啟用 server-rendering
const $UNIVERSAL = false;
if( $UNIVERSAL ){

	require('./boot-server')(app);

}else{

    const index = fs.readFileSync('assets/index.html', {encoding: 'utf-8'});
    // 如果要關掉 server rendering 時，手法如下：
    // 手法就是同樣在 server 上模擬一個空白的字串返還，讓 client 端有東西可解開就好
    const str = index.replace('${markup}', '').replace('${state}', null);
    app.get('*', (req, res) => {
      // 將組合好的 html 字串返還，request 處理至此完成
      res.status(200).send(str);
    });

}*/

app.use( handleRouting );

function handleRouting( req, res, next ) {

	let store = finalCreateStore(combinedReducers);
	let childRoutes = routes( store );

	match( {routes: childRoutes, location: req.url}, ( error, redirectLocation, renderProps ) => {

		if ( error ) {

			res.status(500).send( error.message );

		} else if ( redirectLocation ) {

			res.redirect( 302, redirectLocation.pathname + redirectLocation.search );

		} else if ( renderProps == null ) {

			// 找不到 match 的 routing，就丟出去給外層處理
			// if(transition.isCancelled){
			// 	return next();
			// }

			// 也可噴錯，丟出去給外層處理
			// return next('err msg: route not found');

			// 目前是直接返還 404 訊息，就結束此輪請求
			res.status(404).send( 'Not found' );

		} else {

			console.log('\n\nserver 處理請求 > renderProps:\n', renderProps );

			let html = renderToString(
				<Provider store={store}>
					<RouterContext {...renderProps}/>
				</Provider>
			)

			// console.log('\n生成 markup:\n', html);

			let state = JSON.stringify( store.getState() );
			// console.log( '\n\n要送出的 state: ', state )

			let page = renderFullPage( html, state )
			// console.log( '\n生成 html:\n', page );

			// 將組合好的 html 字串返還，request 處理至此完成
			return res.status(200).send( page );

		}
	} );
};

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html lang="utf-8">
      <head>
        <title>Universal Redux Example</title>
        <link rel="shortcut icon" type="image/png" href="assets/images/react.png">
        <link rel="stylesheet" href="/assets/css/uikit.almost-flat.min.css">
      </head>
      <body>
      <div class="container">${html}</div>
        <script>window.$REDUX_STATE = ${initialState}</script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}


// 示範可以正確在 server 上處理 404 頁面
app.get('*', function(req, res) {
    res.status(404).send('Server.js > 404 - Page Not Found');
})

// Catch server error，注意要四個參數
app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
  console.log( 'uncaughtException: ', evt );
})

app.listen(3000, function(){
    console.log('Listening on port 3000');
});


