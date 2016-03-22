import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';


class ProductItem extends Component {

	static propTypes = {
		product: React.PropTypes.shape( {
		  image: React.PropTypes.string.isRequired,
		  title: React.PropTypes.string.isRequired,
		  price: React.PropTypes.number.isRequired,
		  inventory: React.PropTypes.number.isRequired
		} ).isRequired,

		onAddToCartClicked: React.PropTypes.func.isRequired
	}

  // 這裏沒有 props 屬性，但可透過 this.props 取值
  foo = ( nativeEvent, unknown, reactEvent) => {
	console.log( 'foo > this.props: ', this.props.product.toJS() )
  }

  render() {
	var product = this.props.product;

	console.log( 'render > props: ', this.props.product.toJS() )

	return (
		<div className="uk-panel uk-panel-box uk-margin-bottom">

			<div onClick={this.foo}>foooo</div>

			<img className="uk-thumbnail uk-thumbnail-mini uk-align-left" src={product.image} />
			<h4 className="uk-h4">{product.title} - &euro;{product.price}</h4>
			<p>inventory: {product.inventory}</p>
			<button className="uk-button uk-button-small uk-button-primary"
					onClick={this.props.onAddToCartClicked}
					disabled={product.inventory > 0 ? '' : 'disabled'}>

					{product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
			</button>
			<br/>
			<br/>
			<br/>
			<Link to={`/${product.id}`}>details</Link>
			<br/>
		</div>
	);
  }

}


export default ProductItem;
