var React = require('react');

var Product = React.createClass({
  render: function () {
    return <div>{this.props.children}</div>;
    }
});

export default React.createClass({

	render: function () {
	  let products = this.props.products.productsById;
	  let carts = this.props.carts.cartsById;

	  let hasProducts = carts.size > 0;

	  let nodes = !hasProducts ?
        <div>Please add some products to cart.</div> :
        carts.map( pid => {
          let p = products.get(pid);
  	      return <Product key={pid}>{p.title} - &euro;{p.price} x {p.quantity}</Product>
        })

      return (
        <div className="cart uk-panel uk-panel-box uk-panel-box-primary">
          <div className="uk-badge uk-margin-bottom">Your Cart</div>
          <div className="uk-margin-small-bottom">{nodes}</div>
          <div className="uk-margin-small-bottom">Total: &euro;{this.props.products.total}</div>
          <button className="uk-button uk-button-large uk-button-success uk-align-right"
            onClick={this.props.onCheckoutClicked}
            disabled={hasProducts ? '' : 'disabled'}>
            Checkout
          </button>
        </div>
      );
    },
});
