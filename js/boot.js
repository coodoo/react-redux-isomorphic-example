/*
	這是 non-isomorphic 版本的進入點
	由它負責建立 composedReducers, finalCreateStore 與 store instance

	如果是 isomorphic 版，則由 srever.js 負責做這些事

 */
import React, { Component } from 'react';
import AppWrap from './components/AppWrap';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import * as reducers from './reducers';
import promiseMiddleware from './utils/PromiseMiddleware';
import Immutable from 'immutable';

// devTools
import { devTools, persistState } from 'redux-devtools';

const ProductState = Immutable.Record({
	all: null,
	idCurrentProduct: undefined,
	total: '0'
})

const ProductRecord = Immutable.Record({
	id: null,
	image: "",
	inventory: 0,
	quantity: 0,
	price: 0,
	title: ""
})

const CartState = Immutable.Record({
	idProducts: Immutable.List.of([])
})

function convertToRecord( arr, Def ){
	// 最終返還出去的是 List of ProductRecord
	return Immutable.List.of( ...arr.map( item => new Def(item) ) );
}

// 客戶端嚐試還原 state，如果有找到這個 elem 並且有內容，就代表為 isomorphic 版本
let state = null;
if( window.reduxState ){

	state = window.reduxState;

	// begin marshalling
	state.products = new ProductState({
		all: convertToRecord(state.products.all, ProductRecord),
		total: state.products.total,
		idCurrentProduct: state.products.idCurrentProduct
	})
	state.carts = new CartState({
		idProducts: Immutable.List.of(...state.carts.idProducts)
	})

	// 用完就刪掉
	delete window.reduxState
}

// 就是 composeStores(), 將所有 stores 合併起來成為一個 composition(state, action) 指令
// 將來操作它就等於操作所有 reducers
const composedReducers = combineReducers(reducers);

// 加掛上 reudx-devtools
// buggy, disabled for now @Jul 28, 2015 16:54
var cs = compose(
	devTools(),
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
