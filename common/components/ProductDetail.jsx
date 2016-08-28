import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ShopActions from '../actions/ShopActions';
import { Link } from 'react-router';
import { fetchNeeds } from '../utils/fetchComponentData';

export class ProductDetail extends Component {

	static needs = [
		ShopActions.readOne
	];

	constructor(props, context) {
	    super( props, context );
	    this.actions = bindActionCreators( ShopActions, props.dispatch );
	}

	componentDidMount(){
		// check if product already existed to avoid unnecessary fetching
		if( !this.props.products ){
			fetchNeeds( ProductDetail.needs, this.props )
			return <div>Loading...</div>
		}
	}

	render() {

		const { productsById } = this.props.products;
		const { id:currentProductId } = this.props.params;	// provided by router params
		const product = productsById.get( currentProductId );


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

// refer from using decorator before it became a standarized
// @connect( (state, ownProps) => { products: state.products } )
export default connect( (state, ownProps) => ({ products: state.products }) )(ProductDetail)
