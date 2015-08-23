import React from 'react';
import ProductItem from './ProductItem.jsx';
import ProductsList from './ProductsList.jsx';
import ProductItemContainer from './ProductItemContainer.jsx';
import { connect } from 'react-redux';

@connect( state => state )
export default class ProductsContainer extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
      let products = this.props.products;
      var nodes = products.map( product => {
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