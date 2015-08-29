import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ShopActions from '../actions/ShopActions';
import CartContainer from './CartContainer';
import ProductsContainer from './ProductsContainer';

if ("undefined" !== typeof window) {
	require('../../assets/css/main.css');
}

// devTools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

export default class TodoApp extends Component {

	static contextTypes = {
	  store: React.PropTypes.object.isRequired
	};

  render() {
  	// console.log( 'TodoApp > props: ', this.props );

  	const { isTransitioning } = this.props;

  	// toggle redux-devPanel
	var tool;
	if ('undefined' !== typeof window && window.$REDUX_DEVTOOL == true ) {
		tool = <DebugPanel top right bottom>
				<DevTools store={this.context.store} monitor={LogMonitor} />
			   </DebugPanel>
	}

	let nodes;

	if(isTransitioning){
		nodes = (
			<div>
				{<div>LOADING...</div>}
				{tool}
			</div>
		)

	}else{

		nodes = (
			<div>
				{this.props.main}
				{this.props.cart}
				{tool}
			</div>
		)
	}

	return nodes;
  }

}