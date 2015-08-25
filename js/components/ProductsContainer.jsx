import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProductItem from './ProductItem.jsx';
import ProductsList from './ProductsList.jsx';
import ProductItemContainer from './ProductItemContainer.jsx';
import * as ShopActions from '../actions/ShopActions';

// 使用 @connect 精準獲取這個 view 需要的資料源，如此可減少日後不必要的 redraw
@connect( state => {return {products: state.products}} )
export default class ProductsContainer extends React.Component {

	// 重要，props 包含 dispatch fn 與所有 reducers 物件，是由 @connect 傳入的
	// dispatch: function
	// products: Record
	// carts: Record
	constructor(props, context) {
		super(props, context);
		this.actions = bindActionCreators(ShopActions, props.dispatch);
	}

	render() {
	  let products = this.props.products;
	  var nodes = products.productsById.map( product => {
		return <ProductItemContainer
				  key={product.id}
				  product={product}
				  onAddToCart={this.actions.addToCart} />;
	  });

	  return (
		<ProductsList title="Flux Shop Demo (Redux)">
		  {nodes}
		</ProductsList>
	  );
	}

};