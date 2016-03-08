import React, { Component, PropTypes } from 'react';
// import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'; // devTools

if ( 'undefined' !== typeof window ) {
	require( '../../client/assets/css/main.css' );
}

export default class TodoApp extends Component {

	static contextTypes = {
		store: React.PropTypes.object.isRequired,
	};

	render() {

		// toggle redux-devPanel
		let tool;
		// if ( 'undefined' !== typeof window && window.$REDUX_DEVTOOL == true ) {
		// 	tool = <DebugPanel top right bottom>
		// 			<DevTools store={this.context.store} monitor={LogMonitor} />
		// 			 </DebugPanel>
		// }

		let nodes = (
			<div>
				{this.props.main}
				{this.props.cart}
				{tool}
			</div>
		)

		return nodes;
	}

}
