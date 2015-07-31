
import assign from 'object-assign';

import {
  ADD_TO_CART,
  CART_CHECKOUT_REQUEST,
  CART_CHECKOUT_SUCCESS,
  CART_CHECKOUT_ERROR,
} from '../constants/ActionTypes';



const initialState = {
  idProducts: [],	// id of added products
};

export default function carts( state = initialState, action ) {

	// console.log( 'action.type: ', action.type );

	switch ( action.type ) {

		case ADD_TO_CART:

			// console.log( 'ADD_TO_CART: ', action, ' >state: ', state );

			var id = action.product.id;

			if( state.idProducts.indexOf(id) == -1 ) {
				return {idProducts: [...state.idProducts, id]};
			}else{
				return state
			}

		case CART_CHECKOUT_REQUEST:
			// console.log( 'CART_CHECKOUT_REQUEST > action:', action );
			return state;

		case CART_CHECKOUT_SUCCESS:
			console.log( 'CART_CHECKOUT_SUCCESS > checkout completed!' );
			return {
				idProducts: []
			}

		case CART_CHECKOUT_ERROR:
			// console.log( 'CART_CHECKOUT_ERROR' );
			return state;

		default:
			return state;
	}
}
