import products from './products.js';

const TIMEOUT = 100;

export default {

	getProducts: function (timeout) {
	  timeout = timeout || TIMEOUT;
	  return new Promise( (resolve, reject) => {
		  setTimeout(function () {
		  	if( 'undefined' == typeof window ){
		  		// on server
		    	resolve(products);
		  	}else{
		  		resolve(window.getProducts().productsById)
		  	}
		  }, timeout);

	  })
	},

	getOneProduct: function (id, timeout) {

	  timeout = timeout || TIMEOUT;

	  return new Promise( (resolve, reject) => {

		  setTimeout(function () {

		  	for(let item of products ){
		  		if( item.id == id ){
		  			resolve(item);
		  		}
		  	}

		  	// 如果走到這一行，代表前面找不到需要的商品，自然就拋錯了
		  	// console.log( 'shop.js::shop > 失敗' );
		  	reject( 'Product not found' );

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
	}

}

