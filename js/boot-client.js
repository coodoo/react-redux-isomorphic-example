import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Router, Route} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import configureStore from './utils/configureStore';
import {ProductState, ProductRecord, CartState, convertMapToImmutable} from './constants/Types';

// 是否開啟 redux_devtool 面板
window.$REDUX_DEVTOOL = false;

// 資料是否已由 server 生成過，並在 client 還原了，如此可避免 client code 再撈一次資料
window.$RESTORED = false;

// 客戶端嚐試還原 state，如果有找到這個 elem 並且有內容，就代表為 isomorphic 版本
let state = undefined;
if ( window.$REDUX_STATE ) {

	// 解開 server 預先傳來的資料包，稍後會放入 store 成為 initState
	state = window.$REDUX_STATE;

	// begin marshalling data into Immutable types
	state.products = new ProductState( {
		$fetched: document.location.pathname == '/',
		productsById: convertMapToImmutable( state.products.productsById, ProductRecord ),
		total: state.products.total,
		currentProductId: state.products.currentProductId,
	} );

	state.carts = new CartState( {
		cartsById: Immutable.List.of( ...state.carts.cartsById ),
	} );

	// 用完就刪掉
	delete window.$REDUX_STATE;

	window.$RESTORED = true;

	console.log( 'server-rendering state restored: ', state );
}

const history = createBrowserHistory();
const store = configureStore( state );

// 啟動 router，偷傳 store 進去方便它內部在每條 routing rule 啟動前先撈資料
const routes = require( './routes/routing' )( store );

ReactDOM.render(
	<Provider store={store}>
		<Router history={history} children={routes} />
	</Provider>,

	document.querySelector( '.container' )
);
