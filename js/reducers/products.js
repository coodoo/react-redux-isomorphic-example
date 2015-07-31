
import assign from 'object-assign';

import {

  READ_ALL_PRODUCTS_REQUEST,
  READ_ALL_PRODUCTS_SUCCESS,
  READ_ALL_PRODUCTS_ERROR,

  READ_ONE_PRODUCT_REQUEST,
  READ_ONE_PRODUCT_SUCCESS,
  READ_ONE_PRODUCT_ERROR,

  ADD_TO_CART

} from '../constants/ActionTypes';

const initialState = {
	all: [],
	currentProduct: {id: 1, title: 'fake', price: '0.00', inventory: 0, image:'/assets/images/ipad-mini.png'},
  total: '0'
};

export default function products( state = initialState, action ) {

  switch ( action.type ) {

  case READ_ALL_PRODUCTS_REQUEST:
	// console.log( 'READ_ALL_PRODUCT_REQUEST run: ', action, ' >state: ', state );
	return state;

  case READ_ALL_PRODUCTS_SUCCESS:
	// console.log( 'READ_ALL_PRODUCT_SUCCESS run: ', action );
	var s = {
		all: action.result,
		currentProduct: state.currentProduct
	}
	return s;

  case READ_ALL_PRODUCTS_ERROR:
	// console.log( 'READ_ALL_PRODUCT_ERROR run: ', action, ' >state: ', state );
	return state;


  case ADD_TO_CART:

	// console.log( 'ADD_TO_CART run: ', action, ' >state: ', state );

	var id = action.product.id;
	var product = state.all.find( p => p.id == id );

	if( !product ) return state;

	var all = state.all.map( p =>
		p.id == id ?
			assign({}, p, { quantity: p.quantity+1, inventory: p.inventory-1 }) :
			p
	)

	var s = {
		...state,
		all,
		total: all.reduce( (acc, item) => { return acc + (item.quantity * item.price) }, 0 ).toFixed(2)
	}

	// console.log( 'products 算完: ', s );
	return s;



  case READ_ONE_PRODUCT_REQUEST:
	// console.log( 'READ_ONE_PRODUCT_REQUEST run: ', action, ' >state: ', state );
	return state;

  case READ_ONE_PRODUCT_SUCCESS:
	// console.log( 'READ_ONE_PRODUCT_SUCCESS run: ', action );
	var s = {
		all: state.all,
		currentProduct: action.result
	}
	return s;

  case READ_ONE_PRODUCT_ERROR:
	// console.log( 'READ_ONE_PRODUCT_ERROR run: ', action, ' >state: ', state );
	return state;


  default:
	return state;
  }
}
