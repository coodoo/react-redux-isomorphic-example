var React = require( 'react' );

export default React.createClass( {

	render: function() {

		var product = this.props.product;

		var styles = {
			backgroundColor: '#FFDC00'
		}

		return (
			<div className="uk-panel uk-panel-box uk-margin-bottom" style={styles}>
				<h2><a href='/'>← BACK </a><br/></h2>
				<img className="uk-thumbnail uk-thumbnail-mini uk-align-left" src={product.image} />
				<h4 className="uk-h4">{product.title} - &euro;{product.price}</h4>

				<button className="uk-button uk-button-small uk-button-primary"
					onClick={this.onAddToCartClicked}
					disabled={product.inventory > 0 ? '' : 'disabled'}>
					{product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
				</button>
			</div>
		);
	},

	onAddToCartClicked: function() {
		this.props.actions.addToCart( this.props.product );
	}
} );
