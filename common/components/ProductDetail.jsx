import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ShopActions from '../actions/ShopActions';
import { Link } from 'react-router';
import { fetchNeeds } from '../utils/fetchComponentData';

export default class ProductDetail extends Component {

	static needs = [
		ShopActions.readOne
	];

	constructor(props, context) {
	    super( props, context );
	    this.actions = bindActionCreators( ShopActions, props.dispatch );
	}

	render() {

		const { productsById } = this.props.products;
		const { id:currentProductId } = this.props.params;	// 一律由 router params 內直接取 id
		const product = productsById.get( currentProductId );

		if(!product){
			// debugger;
			fetchNeeds( this.props, ProductDetail.needs )

			return <div>Product Not Found</div>
		}

		var styles = {
			backgroundColor: '#FFDC00'
		}

		return (
			<div className="uk-panel uk-panel-box uk-margin-bottom" style={styles}>
				<h2><Link to='/'>← BACK </Link></h2>
				<img className="uk-thumbnail uk-thumbnail-mini uk-align-left" src={product.image} />
				<h4 className="uk-h4">{product.title} - &euro;{product.price}</h4>
				<p>inventory: {product.inventory}</p>
				<button className="uk-button uk-button-small uk-button-primary"
					onClick={this.onAddToCartClicked.bind(this, product)}
					disabled={product.inventory > 0 ? '' : 'disabled'}>
					{product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
				</button>
			</div>
		);
	}

	onAddToCartClicked( p, evt ) {
		this.actions.addToCart( p );
	}
}

// 在 decorator 還沒正規化前，暫時不用
// @connect( (state, ownProps) => { products: state.products } )
export default connect( (state, ownProps) => ({ products: state.products }) )(ProductDetail)
