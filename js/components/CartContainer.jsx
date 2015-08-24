import React from 'react';
import Cart from './Cart.jsx';
import { connect } from 'react-redux';

@connect( state => {return state} )
export default class CartContainer extends React.Component {

	constructor(props, context){
		super(props, context);
	}

	//
	onCheckoutClicked() {

		// 購物車內沒東西就不處理
		if ( this.props.carts.cartsById.size == 0 ) {
			return;
		}

		this.props.actions.cartCheckout(this.props.carts.cartsById);
	}

	render() {

		return (
			<Cart products= {this.props.products}
				  carts= {this.props.carts}
				  onCheckoutClicked= {this.onCheckoutClicked.bind(this)}
			/>
		);
	}

}
