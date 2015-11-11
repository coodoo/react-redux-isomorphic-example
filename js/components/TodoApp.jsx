import React, { Component, PropTypes } from 'react';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'; // devTools

if ( 'undefined' !== typeof window ) {
	require( '../../assets/css/main.css' );
}


export default class TodoApp extends Component {

	static contextTypes = {
		store: React.PropTypes.object.isRequired,
	};

	render() {

		// isTransitioning is gone in react-router 1.0.0-rc1, pending request to put it back
		const { isTransitioning } = this.props || false ;

		// toggle redux-devPanel
		var tool;
		if ( 'undefined' !== typeof window && window.$REDUX_DEVTOOL == true ) {
			tool = <DebugPanel top right bottom>
					<DevTools store={this.context.store} monitor={LogMonitor} />
					 </DebugPanel>
		}

		let nodes;

		if ( isTransitioning ) {

			nodes = (
				<div>
					{<div>LOADING...</div>}
					{tool}
				</div>
			)

		}else {

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
