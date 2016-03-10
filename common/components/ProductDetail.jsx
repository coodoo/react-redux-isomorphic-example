import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ShopActions from '../actions/ShopActions';
import { Link } from 'react-router';

export default class ProductDetail extends Component {

	static needs = [
		ShopActions.readOne
	];

	/*// <AsyncProps> 專用的指令
	static loadProps( params, callback) {

		// console.log( '\n\n**loadProps 跑: ', params )

		// double destructruing
		let {customProps:{store}} = params;

		// 先檢查是否已撈過該筆資料，沒有的話才回 server 取
		let existed = store.getState().products.productsById.get( params.id ) != null;
		// console.log( 'existed: ', existed )

		// 一律整包 params 送進去 ShopAction，那裏再 destructuring 取出要的欄位即可
		// 注意多塞了 existed 屬性，避免重覆撈取已存在的資料
		// 這裏就成功接上 redux 系統的 action/reducer 操作，撈回資料後會觸發 view 更新
		// 重點在 server rendering 時會等到 data fetching 完成才繪出並返還頁面
		store.dispatch( ShopActions.readOne( {...params, existed} ) )
			 .then( result => callback(), err => callback(err) );
	}*/

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
			let { params, dispatch } = this.props;
			ProductDetail.needs.map( need => dispatch(need(params)) )

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
