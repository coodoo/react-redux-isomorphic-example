import React from 'react';
import { Link } from 'react-router';
import { pure, mapPropsOnChange, compose } from 'recompose';

// original stateless function
const ProductItem = (props) => {

	let { product } = props;

	console.log( '\nproductItem render' )
	return (
		<div className='uk-panel uk-panel-box uk-margin-bottom'>
			<img className='uk-thumbnail uk-thumbnail-mini uk-align-left' src={product.image} />
			<h4 className='uk-h4'>{product.title} - €{product.price}</h4>
			<p>inventory: {product.inventory}</p>
			<button className='uk-button uk-button-small uk-button-primary'
					onClick={props.onAddToCart}
					disabled={product.inventory > 0 ? '' : 'disabled'}>

					{product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
			</button>
			<Link to={`/${product.id}`}>details</Link>
		</div>
	);

};

// 用 compose() 來組合多個插件
export default compose(

	// 負責操作 bind 將 product 綁入 onAddToCart handler 內
	// 這樣 stateless component 可直接用
	mapPropsOnChange(

		['prodcut'],

		ownerProps => {
			// console.log( '\n→ mapProps 跑: ', ownerProps.product.toJS() )
			return {...ownerProps, onAddToCart: ownerProps.onAddToCart.bind( null, ownerProps.product ) };
		}),

	// 啟用 pureRenderMixin
	pure,

)(ProductItem)

// export default pure(ProductItem)
// export default ProductItem
