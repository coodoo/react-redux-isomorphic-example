import fs from 'fs';
import path from 'path';

import React from 'react';
import ReactDOM from 'react-dom/server';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';

import promiseMiddleware from './middlewares/PromiseMiddleware';
import combinedReducers from './reducers';

import {Router} from 'react-router';
import { RoutingContext, match } from 'react-router'
import createLocation from 'history/lib/createLocation'
import routes from './routes/routing';
// import Location from 'react-router/lib/Location';


// const index = fs.readFileSync( path.resolve('../assets/index.html'), {encoding: 'utf-8'});
const index = fs.readFileSync( './assets/index.html', {encoding: 'utf-8'});
const finalCreateStore = applyMiddleware( promiseMiddleware )(createStore);

// routing middleware where server-rendering magic happens
// @TODO: we shall check whether this request will be handled by react-router (matching one of it's rules) or not,
// if not, call next() and let server.js shows 404 page,
// for now there's no reliable way to do this, `Router.match()` just got scraped on the main branch.
function handleRouting(req, res, next){

	let location = createLocation(req.url);
	let store = finalCreateStore( combinedReducers );
	let childRoutes = routes(store);

	match({ routes: childRoutes, location }, (error, redirectLocation, renderProps) => {

		if (redirectLocation) {

			res.redirect(301, redirectLocation.pathname + redirectLocation.search);

		} else if (error) {

			res.send(500, error.message);

		} else if (renderProps == null){

			// 找不到 match 的 routing，就丟出去給外層處理
			// if(transition.isCancelled){
			// 	return next();
			// }

			// 也可噴錯，丟出去給外層處理
			// return next('err msg: route not found');

			// 目前是直接返還 404 訊息，就結束此輪請求
			res.send(404, 'Not found');

		} else {

			var markup = ReactDOM.renderToString(
				<Provider store={store}>
					<RoutingContext {...renderProps}/>
				</Provider>,
			);

			// console.log( '\n生成 markup:\n', markup );

			let state = JSON.stringify(store.getState());

			var str = index
					  .replace('${markup}', markup)
					  .replace('${state}', state);

			// console.log( '\n生成 html:\n', str );

			// 將組合好的 html 字串返還，request 處理至此完成
			res.send(str);

			// res.send(renderToString(<RoutingContext {...renderProps}/>))
		}
	})
};

module.exports = function(app){
	app.use(handleRouting);
}
