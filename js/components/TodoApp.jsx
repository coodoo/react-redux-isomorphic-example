import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ShopActions from '../actions/ShopActions';
import CartContainer from './CartContainer';
import ProductsContainer from './ProductsContainer';

export default class TodoApp extends Component {

  render() {

	return (
		<div>
			{this.props.main}
			{this.props.cart}
		</div>
	);
  }

}