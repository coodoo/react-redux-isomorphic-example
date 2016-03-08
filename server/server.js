
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

import AsyncProps, { loadPropsOnServer } from '../common/utils/AsyncProps'

const finalCreateStore = applyMiddleware(promiseMiddleware)( createStore );

// console.log( '環境: ', process.env.NODE_ENV )

var app = express();
// app.use('/build', express.static(path.join(__dirname, '../build')))
app.use('/assets', express.static(path.join(__dirname, '../client/assets')))

// 啟用新版 webpack HMR 功能
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('../webpack.config')
var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// 切換是否要啟用 server-rendering
const $UNIVERSAL = true;

$UNIVERSAL ?
			app.use( handleRouting ) :
			app.get('*', (req, res) => res.status(200).send( renderFullPage( '', null )));


function handleRouting( req, res, next ) {

	let store = finalCreateStore(combinedReducers);
	let html;

	match( {routes, location: req.url}, ( error, redirectLocation, renderProps ) => {

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

			// console.log('\n\nserver 處理請求 > renderProps:\n', renderProps );


			// 當 server-rendering 時，loadPropsOnServer()會觸發每個 component.loadProps() 先撈資料
			// 而我進一步在 loadProps() 內直接操作 redux action，因此當資料取回後會觸發 reducer 最終進入 reudx store.state 內
			// 最後只要透過 store.getState() 取出完整資料即可繪出頁面
			// 這個手法主要的好處有二
			// 1、browser/server 可共用同一手法，不需寫兩份
			// 2、直接使用 redux action/reducer/state 更易理解
			//
			// 此手法與之前不同之處在於，不再使用 react-router 的 onEnter 事件做為資料存取進入點，
			// 因為官方認為那會拖慢畫面顯示速度，他建議改用 Router.render 事件來做此事
			// 為此我調查了幾個不同 libs，後來決定用官方的 async-props 為基礎並加上 redux 支援
			// 這也是最終我獨立維護一份 /common/utils/AsyncProps.js 的原因
			//
			// renderProps: 所有原始資料都會傳來，例如 routes, router, history, components...
			// asyncProps: 是 asyncProps.loadPropsOnServer()處理完後返還的 propsArray[], componentsArray[]
			// 在 redux 的情境下用不到，與 scriptTag 分可忽略
			loadPropsOnServer( {...renderProps, customProps: {store} }, (err, asyncProps, scriptTag) => {

				html = renderToString(
					// server rendering 時需依靠 loadPropsOnServer() 來取回資料，而手法是操作原本的 action methods,
					// 這代表此時即需將 redux store 傳入，後面的 action 操作才能順利取得 store.dispatch(action(xxx))
					// 以接入 redux 系統，這是為何我直接 patch async-props js 的原因
					<Provider store={store}><AsyncProps {...renderProps} customProps={{store}} /></Provider>
				)

				// console.log('\n生成 html:\n', html);

				let state = JSON.stringify( store.getState() );
				// console.log( '\n\n要送出的 state: ', state )

				let page = renderFullPage( html, state )
				// console.log( '\n生成 page:\n', page );

				// 將組合好的 html 字串返還，request 處理至此完成
				return res.status(200).send( page );

			})


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


