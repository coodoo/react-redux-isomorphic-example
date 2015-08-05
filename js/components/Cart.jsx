var React = require('react');

var Product = React.createClass({
  render: function () {
    return <div>{this.props.children}</div>;
    }
});

export default React.createClass({

	render: function () {
	  var products = this.props.products;
	  var carts = this.props.carts.idProducts;

	  var hasProducts = carts.size > 0;

	  var nodes = !hasProducts ?
	  	<div>Please add some products to cart.</div> :
	    products.all.map( p =>
	    	(carts.indexOf(p.id) != -1) ?
	      		<Product key={p.id}>{p.title} - &euro;{p.price} x {p.quantity}</Product> :
	      		null
	    );

      return (
        <div className="cart uk-panel uk-panel-box uk-panel-box-primary">
          <div className="uk-badge uk-margin-bottom">Your Cart</div>
          <div className="uk-margin-small-bottom">{nodes}</div>
          <div className="uk-margin-small-bottom">Total: &euro;{products.total}</div>
          <button className="uk-button uk-button-large uk-button-success uk-align-right"
            onClick={this.props.onCheckoutClicked}
            disabled={hasProducts ? '' : 'disabled'}>
            Checkout
          </button>
        </div>
      );
    },
});
