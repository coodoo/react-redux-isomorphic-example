import { bindActionCreators } from 'redux';
import TodoApp from '../components/TodoApp';
import ProductsContainer from '../components/ProductsContainer';
import ProductDetail from '../components/ProductDetail';
import CartContainer from '../components/CartContainer';
import NotFound from '../components/NotFound';
import * as ShopActions from '../actions/ShopActions';

// 注意傳了 redux store 進來
export default function routes( store ) {

	// bind 一次之後可重覆用
	let actions = bindActionCreators(ShopActions, store.dispatch);

	// console.log( 'action 有貨: ', actions, ' >creator: ', bindActionCreators )

	// 目地：盡量讓這支 fn 可泛用
	// predicate 是條件式，用來判斷資料是否已存在，即不會重覆撈取；如果它返還 true 就不會繼續執行下去
	function fetchCommon( actionFn, predicate ){
		return (state, replaceState, callback) => {

			// debugger; // 看是否已撈過
			// console.log( '$fetched: ', store.getState().products.toJS() );

			// 例如 all data set 如已撈過，就不重抓
			// 傳入整包 store state 供條件式內部判斷
			if( predicate( store.getState(), state ) ){
				return callback();
			}

			// router 的 state.params 整包送進去 ShopAction，那裏再 destructuring 取出要的欄位即可
			actionFn( state.params )

			.then(
				result => callback(),
				err => callback(err) );
		}
	}

	// 除了共用 fetchCommon() 外，如需特別判斷邏輯，也可改用獨立的 fetch fn
	// 此時就可直接操作 action.readOne() 了，但一樣透過 state.params.id 取得參數
	function fetchOne(){
		return (state, replaceState, callback) => {

			console.log( '\n\nfetchOne: ', state )

			// 先檢查是否已撈過該筆資料，沒有的話才回 server 取
			let existed = store.getState().products.productsById.get(state.params.id) != null;

			// client 已還原 server 傳來的資料，就不需再撈一次
			// 直接觸發 callback 讓 react-router transition 順利進行下去
			if ('undefined' !== typeof window && window.$RESTORED == true ) callback();

			return callback()

			// foo = actions.readOne();

			// 一律整包 state.params 送進去 ShopAction，那裏再 destructuring 取出要的欄位即可
			// 注意多塞了 existed 屬性，避免重覆撈取已存在的資料
			actions.readOne( {...state.params, existed} )

			.then( result => callback(),
				   err => callback(err) );

		}
	}

	return {

		component: TodoApp,

		childRoutes: [

		  {
			path: "/",
			components: {main: ProductsContainer, cart: CartContainer},
			// 示範單純版的 async data-fetching 手法
			onEnter: fetchCommon( actions.readAll, (reduxState) => { return reduxState.products.$fetched==true} ),
		  },
		  {
			path: "/:id",
			components: {main: ProductDetail, cart: CartContainer},
			onEnter: ProductDetail.onEnter(store),  // 示範使用 @decorator 做 aysnc data-fetching
			// onEnter: fetchOne(), // 單純版的 async data-fetching 手法
		  },
		  {
			path: "*",
			components: {main: NotFound, cart: null},
			onEnter: (state, replaceState) => {
				console.log( 'Routing - 404 該上場了: ' );
			},
		  },
		],

	};
}
