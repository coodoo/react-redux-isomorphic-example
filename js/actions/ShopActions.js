
import types from '../constants/ActionTypes'
import WebAPIUtils from '../utils/WebAPIUtils'

export function readAll() {
	return {
		// 為了 optimistic update，可透過 REQUEST | SUCCESS | ERROR 三狀態來決定 store 內做何種細微處理
		// 這裏宣告三種狀態要用的真實名稱
		types: [ types.READ_ALL_PRODUCTS_REQUEST, types.READ_ALL_PRODUCTS_SUCCESS, types.READ_ALL_PRODUCTS_ERROR ],
		// WebAPIUtils 會操作遠端 REST API 獲取資料
		promise: WebAPIUtils.getAllProducts()//.then( result => console.log( '先看結果: ', result ) )
	};
}

// readOne tricky 的地方在於它有兩種情況
// 1. 從 listing 頁過來，此時該單筆資料必然已存在於 mem 內(例如state.products.productsById.get(a2))
// 		因此我不希望再回 server 重覆下載該筆資料，但又必需配合跑完 action → reducer 的傳統流程，
// 		才能讓 productReducer 內正確更新 state.products.currentProductId 的值，將來 view 顯示才會正常
// 		因此這裏模擬正常的操作流程，但直接送一個 resolved promise 出去
// 2. 如果是直接從網址列輸入 localhost:3000/a3 想看單筆資料，此時本機 mem 內必然無資料，
// 		此時就要跑完整流程回 server 撈
export function readOne( {id, existed} ) {

	// console.log( 'readOne 拿到 id: ', id, ' >existed: ', existed );

	// 物件已存在時，直接偽造一個 resolved promise 物件，目地是觸發 ProductReducer::READ_ONE_PRODUCT_SUCCESS
	// 正確設定 currentProductId 的值，但又不會真的回 server 撈資料(以節省時間)
	if( existed ){
		// console.log( '單筆資料已存在，不重撈' );
		return {
			types: [ null, types.READ_ONE_PRODUCT_SUCCESS, null],
			promise: Promise.resolve({id}),
		}
	} else {
		// 正常流程會進到這裏，例如網址列直接存取 /a2 這個物件
		return {
			types: [ types.READ_ONE_PRODUCT_REQUEST, types.READ_ONE_PRODUCT_SUCCESS, types.READ_ONE_PRODUCT_ERROR ],
			promise: WebAPIUtils.getOneProduct(id)
		};
	}


}

export function addToCart(product) {
	return {
		types: [ types.ADD_TO_CART_REQUEST, types.ADD_TO_CART_SUCCESS, types.ADD_TO_CART_ERROR ],
		promise: WebAPIUtils.addToCart(product)
	};
}


export function cartCheckout(products) {
	return {
		types: [ types.CART_CHECKOUT_REQUEST, types.CART_CHECKOUT_SUCCESS, types.CART_CHECKOUT_ERROR ],
		promise: WebAPIUtils.checkoutProducts(products),
		products
	};
}