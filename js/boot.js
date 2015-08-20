/*
	這是 non-isomorphic 版本的進入點
	由它負責建立 composedReducers, finalCreateStore 與 store instance

	如果是 isomorphic 版，則由 srever.js 負責做這些事

 */
import React, { Component } from 'react';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import Immutable from 'immutable';
import { Provider } from 'react-redux';
import * as reducers from './reducers';
import promiseMiddleware from './utils/PromiseMiddleware';
import AppWrap from './components/AppWrap';
import {ProductState, ProductRecord, CartState, convertMapToImmutable} from './constants/Types';

// devTools
// import { devTools, persistState } from 'redux-devtools';

// 客戶端嚐試還原 state，如果有找到這個 elem 並且有內容，就代表為 isomorphic 版本
let state = null;
if( window.$REDUX_STATE ){

	// 解開 server 預先傳來的資料包，稍後會放入 store 成為 initState
	state = window.$REDUX_STATE;

	// begin marshalling data into Immutable types
	state.products = new ProductState({
		productsById: convertMapToImmutable(state.products.productsById, ProductRecord),
		total: state.products.total,
		currentProductId: state.products.currentProductId
	})
	state.carts = new CartState({
		cartsById: Immutable.List.of(...state.carts.cartsById)
	})

	// 用完就刪掉
	delete window.$REDUX_STATE
}

// 就是 composeStores(), 將所有 stores 合併起來成為一個 composition(state, action) 指令
// 將來操作它就等於操作所有 reducers
const composedReducers = combineReducers(reducers);

// 加掛上 reudx-devtools
// buggy, disabled for now @Jul 28, 2015 16:54
var cs = compose(
	// devTools(),
	// persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
	createStore);

const finalCreateStore = applyMiddleware( promiseMiddleware )(cs);

// 由於要用 Promise middleware，因此改用 applyMiddleware()
// const finalCreateStore = applyMiddleware( promiseMiddleware )(createStore);

let store = finalCreateStore(composedReducers, state);

// mocked API
window.getProducts = function(){
	return store.getState().products;
}

// 基礎版 - 不需 promiseMiddleware 時，可用原本的 createStore() 來建立 store instance
// const store = createStore(composedReducers);

// isomorphic 應用時，標示這個 store 內 state 已還原
// 將阻止 routr 內另發一個請求去撈初始化資料
store.__restored__ = (state != null);

React.render(
  <AppWrap store={store} />,
  document.querySelector('.container')
);
