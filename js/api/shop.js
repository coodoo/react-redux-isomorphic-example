import products from './products.js';

const TIMEOUT = 100;	// 模擬網路連線所需時間

export default {

	getProducts: function (timeout) {
	  timeout = timeout || TIMEOUT;
	  return new Promise( (resolve, reject) => {
		  setTimeout( () => resolve(products), timeout );
	  })
	},

	getOneProduct: function (id, timeout) {

	  timeout = timeout || TIMEOUT;

	  return new Promise( (resolve, reject) => {

		// let p = ( 'undefined' == typeof window ) ? products : window.getProducts().productsById;

		setTimeout( () => {
			for(let item of products ){
				if( item.id == id ){
					resolve(item);
				}
			}
			// 如果走到這一行，代表前面找不到需要的商品，自然就拋錯了
			reject( 'Product not found' );
		}, timeout);

	  })
	},

	addToCart: function ( pid, timeout) {
	  timeout = timeout || TIMEOUT;

	  return new Promise( (resolve, reject) => {
		  setTimeout(function () {
		  	console.log( 'products: ', products, ' >product: ', pid );

		  	debugger
		  	let item = products.find( item => item.id == pid )

		  	if(!item) reject('item not found: ', pid);

  			item.inventory--;
  			item.quantity++;
			resolve(item);


		  }, timeout);

	  })
	},

	buyProducts: function (payload, timeout) {
	  timeout = timeout || TIMEOUT;

	  return new Promise( (resolve, reject) => {
		  setTimeout(function () {
			// console.log( 'shop.js::虛擬購買完成 > payload: ', payload );
			resolve(payload);
		  }, timeout);

	  })
	},

}

