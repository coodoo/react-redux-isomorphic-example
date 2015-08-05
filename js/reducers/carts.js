
import assign from 'object-assign';
import Immutable from 'immutable';

import {
  ADD_TO_CART,
  CART_CHECKOUT_REQUEST,
  CART_CHECKOUT_SUCCESS,
  CART_CHECKOUT_ERROR,
} from '../constants/ActionTypes';

var CartState = Immutable.Record({
	idProducts: Immutable.List.of([])
})

const initialState = new CartState();

export default function carts( state = initialState, action ) {

	switch ( action.type ) {

		case ADD_TO_CART:
			var id = action.product.id;
			return state.update('idProducts', list => {
				return (list.indexOf(id) != -1) ? list : list.push(id);
			})

		case CART_CHECKOUT_REQUEST:
			return state;

		case CART_CHECKOUT_SUCCESS:
			return state.set('idProducts', state.idProducts.clear() );

		case CART_CHECKOUT_ERROR:
			return state;

		default:
			return state;
	}
}
