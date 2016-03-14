
import types from '../constants/ActionTypes'
import WebAPIUtils from '../utils/WebAPIUtils'

export function readAll() {
	console.log( 'readAll run' )
	return {
		// 為了 optimistic update，可透過 REQUEST | SUCCESS | ERROR 三狀態來決定 store 內做何種細微處理
		// 這裏宣告三種狀態要用的真實名稱
		types: [ types.READ_ALL_PRODUCTS_REQUEST, types.READ_ALL_PRODUCTS_SUCCESS, types.READ_ALL_PRODUCTS_ERROR ],
		// WebAPIUtils 會操作遠端 REST API 獲取資料
		promise: WebAPIUtils.getAllProducts()//.then( result => console.log( '先看結果: ', result ) )
	};
}

// 如果是直接從網址列輸入 localhost:3000/a3 想看單筆資料，此時本機 mem 內必然無資料，此時要跑完整流程回 server 撈
export function readOne( {id} ) {

	console.log( 'readOne >id: ', id, ' >arguments: ', arguments );

	// 正常流程會進到這裏，例如網址列直接存取 /a2 這個物件
	return {
		types: [ types.READ_ONE_PRODUCT_REQUEST, types.READ_ONE_PRODUCT_SUCCESS, types.READ_ONE_PRODUCT_ERROR ],
		promise: WebAPIUtils.getOneProduct(id)
	};

}

export function addToCart(product) {

	// optimistic update: add transacation_id for updating the object after it's returned from server
	product = product.set( 'tid', 't_' + Math.random()*100 );

	return {
		types: [ types.ADD_TO_CART_REQUEST, types.ADD_TO_CART_SUCCESS, types.ADD_TO_CART_ERROR ],
		promise: WebAPIUtils.addToCart(product),
		result: product,
	};
}


export function cartCheckout(products) {
	return {
		types: [ types.CART_CHECKOUT_REQUEST, types.CART_CHECKOUT_SUCCESS, types.CART_CHECKOUT_ERROR ],
		promise: WebAPIUtils.checkoutProducts(products),
		products
	};
}
