
import assign from 'object-assign';
import Immutable from 'immutable';
import {ProductState, ProductRecord, convertToRecordMap } from '../constants/Types';
import {CartState} from '../constants/Types';
import createReducer from '../utils/createReducer';
import * as types from '../constants/ActionTypes';

function READ_ALL_PRODUCTS_REQUEST( state, action ){ return state; }
function READ_ALL_PRODUCTS_ERROR( state, action ){ return state; }
function READ_ALL_PRODUCTS_SUCCESS( state, action ){

	return state.update( 'productsById', map => action.result )
				.set('$fetched', true);	// 標示 productsById 已 fetched，將來從 detail 頁回 listing 頁就不會重撈

}

function READ_ONE_PRODUCT_REQUEST( state, action ){ return state; }
function READ_ONE_PRODUCT_ERROR( state, action ){ console.error( action ); return state; }
function READ_ONE_PRODUCT_SUCCESS( state, action ){

	// 點選單筆資料時，會先判斷該資料是否已存在於 productsById map 內
	// 如果已存在，就不會再跟 server 撈資料，僅會傳來 id 供更新 currentProducId
	state = state.update('currentProductId', id => {
		return action.result.id;
	})

	// 但如果真的有回 server 撈資料，就要繼續跑這段
	if( !state.productsById.get(action.result.id) ){
		state = state.update('productsById', map => {
			return map.set( action.result.id, action.result );
		})
	}

	return state;
}

// REQUEST 事件時做 optimistic update 的下手處，這裏先改變資料狀態，觸發 view 重繪
// 通常是將物件加上 tid (transaction_id)
// 等 SUCCESS 事件時，再依 server 返還的正式 uuid 來更新物件內容
function ADD_TO_CART_REQUEST( state, action ){ return state; }
function ADD_TO_CART_ERROR( state, action ){ return state; }
function ADD_TO_CART_SUCCESS( state, action ){

	// marshalling always happens in reducer
	var addedProduct = action.result;

	state = state
	.update( 'productsById', idMap =>{
		return idMap.map( p => {
			return ( p.id == addedProduct.id ) ? addedProduct : p;
		})
	})

	// 計算新增一筆物件後的總金額
	return state.update('total', num => {
		return state.productsById.reduce( (acc, item) => {
			return acc + (item.quantity * item.price)
		}, 0 ).toFixed(2)
	})
}

function CART_CHECKOUT_SUCCESS( state, action ){
  	// console.log( '結帳完成' );
  	return state
		  	.update('productsById', list => {
		 		 return list.map( item => item.set('quantity', 0) )
		  	})
		  	.update('total', num => '0');
}


const handlers =
{
	[types.READ_ALL_PRODUCTS_REQUEST]: READ_ALL_PRODUCTS_REQUEST,
	[types.READ_ALL_PRODUCTS_SUCCESS]: READ_ALL_PRODUCTS_SUCCESS,
	[types.READ_ALL_PRODUCTS_ERROR]: READ_ALL_PRODUCTS_ERROR,
	[types.READ_ONE_PRODUCT_REQUEST]: READ_ONE_PRODUCT_REQUEST,
	[types.READ_ONE_PRODUCT_ERROR]: READ_ONE_PRODUCT_ERROR,
	[types.READ_ONE_PRODUCT_SUCCESS]: READ_ONE_PRODUCT_SUCCESS,
	[types.ADD_TO_CART_REQUEST]: ADD_TO_CART_REQUEST,
	[types.ADD_TO_CART_SUCCESS]: ADD_TO_CART_SUCCESS,
	[types.ADD_TO_CART_ERROR]: ADD_TO_CART_ERROR,
	[types.CART_CHECKOUT_SUCCESS]: CART_CHECKOUT_SUCCESS,
}

export default createReducer( new ProductState(), handlers );
