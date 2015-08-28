import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ShopActions from '../actions/ShopActions';
import {Link} from 'react-router';
import fetchData from '../utils/FetchDataDecorator'

// 示範使用 fetchData decorator 來獲取 async data
// 這樣做的好處是 data-fetching logic 與 view 放在一起，較好管理
// 缺點是要多寫一個 decorator
@fetchData( (store, routerState, routerCallback ) => {

	// 先檢查是否已撈過該筆資料，沒有的話才回 server 取
	let existed = store.getState().products.productsById.get(routerState.params.id) != null;

	// 一律整包 routerState.params 送進去 ShopAction，那裏再 destructuring 取出要的欄位即可
	// 注意多塞了 existed 屬性，避免重覆撈取已存在的資料
	return store.dispatch( ShopActions.readOne( {...routerState.params, existed} ) );

} )

@connect( state => {return {products: state.products}} )
export default class extends React.Component {

	constructor(props, context) {
	    super(props, context);
	    this.actions = bindActionCreators(ShopActions, props.dispatch);
	    // console.log( 'detail constructor 跑了 > actions: ', this.actions );
	}

	render() {

		var p = this.props.products;
		var product = p.productsById.get( p.currentProductId );

		if(!product) return null;

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
