import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProductItem from './ProductItem.jsx';
import ProductsList from './ProductsList.jsx';
import ProductItemContainer from './ProductItemContainer.jsx';
import * as ShopActions from '../actions/ShopActions';
import { fetchNeeds } from '../utils/fetchComponentData';

class ProductsContainer extends Component {

	static needs = [
		ShopActions.readAll
	];

	// props contains dispatch fn and all reducers, passed in by @connect
	// dispatch: function
	// products: Record
	// carts: Record
	constructor(props, context) {
		super(props, context);
		this.actions = bindActionCreators(ShopActions, props.dispatch);
	}

	componentDidMount() {
		fetchNeeds( ProductsContainer.needs, this.props )
	}

	render() {

	  let products = this.props.products;

	  // if( !products ) debugger;

	  // convert Immutable.Map to Sequence, e.g. [ReactElement, ReactElement, ReactElement]
	  var nodes = products.productsById.valueSeq().map( product => {
		return <ProductItemContainer
				  key={product.id}
				  product={product}
				  onAddToCart={this.actions.addToCart} />;
	  });

	  return (
		<ProductsList title="Universal Redux Demo" key="productList">
		  {nodes}
		</ProductsList>
	  );
	}

};

// 使用 connect 精準獲取這個 view 需要的資料源，如此可減少日後不必要的 redraw
export default connect( (state, ownProps) => ({ products: state.products }) )(ProductsContainer);
