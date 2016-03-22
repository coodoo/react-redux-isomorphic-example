import React, { Component, PropTypes } from 'react';
import Cart from './Cart.jsx';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ShopActions from '../actions/ShopActions';

class CartContainer extends Component {

	constructor(props, context){
		super(props, context);
		this.actions = bindActionCreators(ShopActions, props.dispatch);
	}

	onCheckoutClicked() {

		if ( this.props.carts.cartsById.size == 0 ) {
			return;
		}

		this.actions.cartCheckout(this.props.carts.cartsById);
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

export default connect( (state, ownProps) => (state) )(CartContainer);
