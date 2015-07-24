var React = require( 'react' );
var Cart = require( './Cart.jsx' );


export default class CartContainer extends React.Component {

	constructor(props, context){
		super(props, context);
	}

	//
	onCheckoutClicked() {

		// 購物車內沒東西就不處理
		if ( !this.props.carts.products.length ) {
			return;
		}

		this.props.actions.cartCheckout(this.props.carts.products);
	}

	render() {
		return (
			<Cart products= {this.props.carts.products}
			 	  total= {this.props.carts.total}
				  onCheckoutClicked= {this.onCheckoutClicked.bind(this)}
			/>
		);
	}

}
