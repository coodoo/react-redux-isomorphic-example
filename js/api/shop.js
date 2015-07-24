
var Shop = exports;

import _products from './products.js';

var TIMEOUT = 100;

Shop.getProducts = function (timeout) {
  timeout = timeout || TIMEOUT;
  return new Promise( (resolve, reject) => {
	  setTimeout(function () {
	  	// console.log( 'shop.js::shop 取得: ', _products );
	    resolve(_products);
	  }, timeout);

  })
};

Shop.getOneProduct = function (id, timeout) {

  timeout = timeout || TIMEOUT;

  return new Promise( (resolve, reject) => {

	  setTimeout(function () {

	  	for(let item of _products ){
	  		if( item.id == id ){
	  			// console.log( 'shop.js::shop 一筆取得: ', item );
	  			resolve(item);
	  		}
	  	}

	  	// 如果走到這一行，代表前面找不到需要的商品，自然就拋錯了
	  	// console.log( 'shop.js::shop > 失敗' );
	  	reject( 'Product not found' );

	  }, timeout);

  })
};

Shop.buyProducts = function (payload, timeout) {
  timeout = timeout || TIMEOUT;

  return new Promise( (resolve, reject) => {
	  setTimeout(function () {
	  	// console.log( 'shop.js::虛擬購買完成 > payload: ', payload );
	    resolve(payload);
	  }, timeout);

  })
};
