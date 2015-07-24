var React = require('react');
var ProductItem = require('./ProductItem.jsx');
var ProductsList = require('./ProductsList.jsx');
var ProductItemContainer = require('./ProductItemContainer.jsx');

export default class ProductsContainer extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {

      var nodes = this.props.products.map( product => {

        return <ProductItemContainer
                  key={product.id}
                  product={product}
                  onAddToCart={this.props.actions.addToCart} />;
      });

      return (
        <ProductsList title="Flux Shop Demo (Redux)">
          {nodes}
        </ProductsList>
      );
    }

};