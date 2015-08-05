
import assign from 'object-assign';
import Immutable from 'immutable';

import {

  READ_ALL_PRODUCTS_REQUEST,
  READ_ALL_PRODUCTS_SUCCESS,
  READ_ALL_PRODUCTS_ERROR,

  READ_ONE_PRODUCT_REQUEST,
  READ_ONE_PRODUCT_SUCCESS,
  READ_ONE_PRODUCT_ERROR,

  ADD_TO_CART,
  CART_CHECKOUT_SUCCESS

} from '../constants/ActionTypes';

const ProductState = Immutable.Record({
	all: null,
	idCurrentProduct: null,
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


const initialState = new ProductState();

// convert plain js obj to Immutable.Record of type ProductRecord
function convertToRecord( arr, Def ){
	// 最終返還出去的是 List of ProductRecord
	return Immutable.List.of( ...arr.map( item => new Def(item) ) );
}

export default function products( state = initialState, action ) {

  switch ( action.type ) {

	  case READ_ALL_PRODUCTS_REQUEST:
		return state;

	  case READ_ALL_PRODUCTS_SUCCESS:
		return state.update( 'all', list => {
			return convertToRecord( action.result, ProductRecord );
		})

	  case READ_ALL_PRODUCTS_ERROR:
		return state;


	  case ADD_TO_CART:

		var id = action.product.id;

		state = state
		.update( 'all', list =>{
			return list.map( item => {
				if( item.id == id ){
					return item
							.set('quantity', item.quantity+1 )
							.set('inventory', item.inventory-1 )
				}else{
					return item;
				}
			})
		})

		return state.update('total', num => {
			return state.all.reduce( (acc, item) => {
				return acc + (item.quantity * item.price)
			}, 0 ).toFixed(2)
		})

	  case CART_CHECKOUT_SUCCESS:
	  	return state
			  	.update('all', list => {
			 		 return list.map( item => item.set('quantity', 0) )
			  	})
			  	.update('total', num => '0');


	  case READ_ONE_PRODUCT_REQUEST:
		return state;

	  case READ_ONE_PRODUCT_SUCCESS:
		return state.update('idCurrentProduct', id => {
			return action.result.id;
		})

	  case READ_ONE_PRODUCT_ERROR:
		return state;


	  default:
		return state;
  }
}
