/*
這支模擬 server REST API
為了擬真，它接收與返還的格式都是 JSON
*/

import products from './products.js';

const TIMEOUT = 100;	// 模擬網路連線所需時間

export default {

	getProducts: function( timeout = TIMEOUT ) {
		return new Promise( ( resolve, reject ) => {
			// 模擬 REST API 返還一個 JSON 字串
			setTimeout( () => resolve( JSON.stringify( products ) ), timeout );
		} )
	},

	getOneProduct: function( id, timeout = TIMEOUT ) {
		return new Promise( ( resolve, reject ) => {
			setTimeout( () => {
				for ( let item of products ) {
					if ( item.id == id ) {
						resolve( JSON.stringify( item ) );
					}
				}

				// 如果走到這一行，代表前面找不到需要的商品，自然就拋錯了
				reject( 'Product not found: ' + id );
			}, timeout );

		} )
	},

	// @todo: server 程式應該要檢查該貨品是否還有存貨，才允許購買
	addToCart: function( pid, timeout = TIMEOUT ) {
		return new Promise( ( resolve, reject ) => {
			setTimeout( function() {
				// console.log( 'products: ', products, ' >product: ', pid );

				let item = products.find( item => item.id == pid )

				if ( !item ) reject( 'item not found: ', pid );

				item.inventory--;
				item.quantity++;
				resolve( JSON.stringify( item ) );

			}, timeout );

		} )
	},

	//
	checkoutProducts: function( cartsByid, timeout = TIMEOUT ) {
		return new Promise( ( resolve, reject ) => {
			setTimeout( function() {
			console.log( 'shopdb > 虛擬購買完成: ', JSON.parse( cartsByid ) );
			resolve( JSON.stringify( {msg:'checkout completed'} ) );
		  }, timeout );

		} )
	},

}

