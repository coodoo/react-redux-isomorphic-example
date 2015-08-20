
import assign from 'object-assign';
import Immutable from 'immutable';
import {CartState} from '../constants/Types';
import createReducer from '../utils/createReducer';
import * as types from '../constants/ActionTypes';

function ADD_TO_CART( state, action ){
	var id = action.product.id;
	return state.update('cartsById', list => {
		return (list.indexOf(id) != -1) ? list : list.push(id);
	})
}

function CART_CHECKOUT_REQUEST( state, action ){
	return state;
}

function CART_CHECKOUT_ERROR( state, action ){
	return state;
}

function CART_CHECKOUT_SUCCESS( state, action ){
	return state.set('cartsById', state.cartsById.clear() );
}

const handlers =
{
	[types.ADD_TO_CART]: ADD_TO_CART,
	[types.CART_CHECKOUT_REQUEST]: CART_CHECKOUT_REQUEST,
	[types.CART_CHECKOUT_ERROR]: CART_CHECKOUT_ERROR,
	[types.CART_CHECKOUT_SUCCESS]: CART_CHECKOUT_SUCCESS,
}

export default createReducer( new CartState(), handlers );
