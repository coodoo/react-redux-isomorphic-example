import Immutable from 'immutable';
import {CartState} from '../constants/Types';
import createReducer from '../utils/createReducer';
import types from '../constants/ActionTypes';

// optimistic update
// while we are waiting for server to ack persisting result, we can up date the view first
// the only thing we need from server is the object's unique id
function ADD_TO_CART_REQUEST( state, action ){

	let { id, tid } = action.result;

	console.log( '[optimisitc update] transaction id: ', tid )

	return state.update('cartsById', list => {
		return (list.indexOf(id) != -1) ? list : list.push(id);
	})

}

function ADD_TO_CART_SUCCESS( state, action ){

	let { id, tid } = action.result;

	// hint: use tid to update local record's unqiute id, as returned by server
	// console.log( 'obj transaction id: ', tid )

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
	[types.ADD_TO_CART_REQUEST]: ADD_TO_CART_REQUEST,
	[types.ADD_TO_CART_SUCCESS]: ADD_TO_CART_SUCCESS,
	[types.CART_CHECKOUT_REQUEST]: CART_CHECKOUT_REQUEST,
	[types.CART_CHECKOUT_ERROR]: CART_CHECKOUT_ERROR,
	[types.CART_CHECKOUT_SUCCESS]: CART_CHECKOUT_SUCCESS,
}

export default createReducer( new CartState(), handlers );
