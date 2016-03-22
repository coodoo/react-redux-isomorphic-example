import React from 'react'
import ProductItem from './ProductItem.jsx'

export default React.createClass( {
	render: function() {
		return (
			<ProductItem product={this.props.product}
						 onAddToCartClicked={this.props.onAddToCart.bind(this, this.props.product)} />
		);
	}
} );

