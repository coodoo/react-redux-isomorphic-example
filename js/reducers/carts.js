
import {
  ADD_TO_CART,
  CART_CHECKOUT_REQUEST,
  CART_CHECKOUT_SUCCESS,
  CART_CHECKOUT_ERROR,
} from '../constants/ActionTypes';

const initialState = {
  products: [],	// products[102] = {quantity: 8, title:'aaa', price:'199.99'}
  total: '0' // 總金額
};

export default function carts( state = initialState, action ) {

	switch ( action.type ) {

		case ADD_TO_CART:

			// console.log( 'ADD_TO_CART run: ', action, ' >state: ', state );

			var product = action.product;
			var id = product.id;

			if(id in state.products) {
				state.products[id].quantity++;
			}else{
				product.quantity = 1;
				state.products[product.id] = product;
			}

			product.inventory--;

			var s = {
				total: state.products.reduce( (acc, item) => { return acc + (item.quantity * item.price) }, 0 ).toFixed(2),
				products: state.products
			}
			return s;

		case CART_CHECKOUT_REQUEST:
			// console.log( 'CART_CHECKOUT_REQUEST > action:', action );
			return state;

		case CART_CHECKOUT_SUCCESS:
			console.log( 'CART_CHECKOUT_SUCCESS > checkout completed!' );
			return {
				products: [],
				total: '0'
			}

		case CART_CHECKOUT_ERROR:
			// console.log( 'CART_CHECKOUT_ERROR' );
			return state;

		default:
			return state;
	}
}
