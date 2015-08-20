
import assign from 'object-assign';
import Immutable from 'immutable';
import {ProductState, ProductRecord, convertToRecordMap } from '../constants/Types';
import createReducer from '../utils/createReducer';
import * as types from '../constants/ActionTypes';


function READ_ALL_PRODUCTS_REQUEST( state, action ){
	return state;
}

function READ_ALL_PRODUCTS_SUCCESS( state, action ){
	return state.update( 'productsById', list => {
		return convertToRecordMap( action.result, ProductRecord );
	})
}

function READ_ALL_PRODUCTS_ERROR( state, action ){
	return state;
}

function ADD_TO_CART( state, action ){
	var id = action.product.id;

	state = state
	.update( 'productsById', list =>{
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
		return state.productsById.reduce( (acc, item) => {
			return acc + (item.quantity * item.price)
		}, 0 ).toFixed(2)
	})
}

function CART_CHECKOUT_SUCCESS( state, action ){
  	console.log( '結帳完成' );
  	return state
		  	.update('productsById', list => {
		 		 return list.map( item => item.set('quantity', 0) )
		  	})
		  	.update('total', num => '0');
}

function READ_ONE_PRODUCT_REQUEST( state, action ){
	return state;
}

function READ_ONE_PRODUCT_ERROR( state, action ){
	return state;
}

function READ_ONE_PRODUCT_SUCCESS( state, action ){
	return state.update('currentProductId', id => {
		return action.result.id;
	})
}

const handlers =
{
	[types.READ_ALL_PRODUCTS_REQUEST]: READ_ALL_PRODUCTS_REQUEST,
	[types.READ_ALL_PRODUCTS_SUCCESS]: READ_ALL_PRODUCTS_SUCCESS,
	[types.READ_ALL_PRODUCTS_ERROR]: READ_ALL_PRODUCTS_ERROR,
	[types.ADD_TO_CART]: ADD_TO_CART,
	[types.CART_CHECKOUT_SUCCESS]: CART_CHECKOUT_SUCCESS,
	[types.READ_ONE_PRODUCT_REQUEST]: READ_ONE_PRODUCT_REQUEST,
	[types.READ_ONE_PRODUCT_ERROR]: READ_ONE_PRODUCT_ERROR,
	[types.READ_ONE_PRODUCT_SUCCESS]: READ_ONE_PRODUCT_SUCCESS,
}

export default createReducer( new ProductState(), handlers );
