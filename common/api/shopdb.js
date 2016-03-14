/*
Simulate server's REST API
everything goes in and out of it should be serialized in JSON format, so data could be transmitted across the wire
*/

import products from './products.js';

const TIMEOUT = 100;	// simluate network delay

export default {

	getProducts: function( timeout = TIMEOUT ) {
		return new Promise( ( resolve, reject ) => {
			// REST API always return JSON string
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

				// product not found, throw an exception
				reject( 'Product not found: ' + id );
			}, timeout );

		} )
	},

	addToCart: function( product, timeout = TIMEOUT ) {
		return new Promise( ( resolve, reject ) => {
			setTimeout( function() {
				// console.log( 'products: ', products, ' >product: ', id );

				let { id, tid } = product;

				let item = products.find( item => item.id == id )

				if ( !item ) reject( 'item not found: ', id );

				// added for optimistic update, sending tid back to client so it can update itself there
				item.tid = tid;

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
			console.log( 'shopdb > purchase completed: ', JSON.parse( cartsByid ) );
			resolve( JSON.stringify( {msg:'checkout completed'} ) );
		  }, timeout );

		} )
	},

}

