import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import Routr from '../utils/routr';

// devTools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

//
export default class AppWrap extends Component {

	constructor(props, context){
		super(props, context);

		// 啟動 router
		// 會連帶觸發第一次　todoReadAll() 取回初始資料
		var routr = new Routr(props.store);
	}

	render() {

		var tool;
		if ('undefined' !== typeof window) {
			tool = <DebugPanel top right bottom>
					<DevTools store={this.props.store} monitor={LogMonitor} />
				   </DebugPanel>
		}

		tool = null;

		// <Provider> 唯一功能就是將 store 放入 context 供 <Connector> 取用
		return (
			<div>
				<Provider store={this.props.store}>
					{() => <TodoApp /> }
				</Provider>

				{ tool }
			</div>
		);
	}
}
