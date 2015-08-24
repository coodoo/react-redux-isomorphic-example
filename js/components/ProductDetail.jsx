import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ShopActions from '../actions/ShopActions';
import {Link} from 'react-router';

@connect( state => {return {products: state.products}} )
export default class extends React.Component {

	constructor(props, context) {
	    super(props, context);
	    this.actions = bindActionCreators(ShopActions, props.dispatch);
	}

	render() {

		var p = this.props.products;
		var product = p.productsById.get( p.currentProductId );

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
