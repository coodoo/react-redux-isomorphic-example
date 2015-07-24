
import types from '../constants/ActionTypes'
import WebAPIUtils from '../utils/WebAPIUtils'

export function readAll() {
	return {
		// 為了 optimistic update，可透過 REQUEST | SUCCESS | ERROR 三狀態來決定 store 內做何種細微處理
		// 這裏宣告三種狀態要用的真實名稱
		types: [ types.READ_ALL_PRODUCTS_REQUEST, types.READ_ALL_PRODUCTS_SUCCESS, types.READ_ALL_PRODUCTS_ERROR ],

		// 就是進行遠方 async 操作，例如 WebAPIUtil.getUsers()
		promise: WebAPIUtils.getAllProducts()//.then( result => console.log( '先看結果: ', result ) )
	};
}

export function readOne(id) {
	return {
		types: [ types.READ_ONE_PRODUCT_REQUEST, types.READ_ONE_PRODUCT_SUCCESS, types.READ_ONE_PRODUCT_ERROR ],
		promise: WebAPIUtils.getOneProduct(id)
	};
}

// routr.js 操作這支指令來切換 stateTree.routes.currentView 值
// 它在 routr.js 裏會 alias 為 this.route(view)
export function changeRoute(view) {
	return {
		type: types.ROUTE_CHANGE,
		view
	};
}

// 例如切換畫面或載入資料時，畫面上顯示 loading spinner
export function toggleLoading( show:Boolean, msg:String ) {
	// console.log( '\ntoggleLoading: ', show, ' >msg: ', msg );
	return {
		type: types.TOGGLE_LOADING,
		msg,
		show
	};
}

export function addToCart(product) {
	return {
		type: types.ADD_TO_CART,
		product
	};
}


export function cartCheckout(products) {
	return {
		types: [ types.CART_CHECKOUT_REQUEST, types.CART_CHECKOUT_SUCCESS, types.CART_CHECKOUT_ERROR ],

		promise: WebAPIUtils.checkoutProducts(products),//.then( result => console.log( '先看結果: ', result ) )

		products
	};
}