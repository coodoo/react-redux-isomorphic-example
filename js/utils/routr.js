var page = require('page');
import * as ShopActions from '../actions/ShopActions';

export default class Routr {

	// 重要：傳入包好的 route() 才能觸發 changeRoute()
	constructor( store ) {

		// 由於最常用到，因此額外包一支方便之後切換路徑
		this.route = function(path){
			this.doAction('changeRoute')(path);
		}

		// 方便操作各種 actions 指令
		this.doAction = function(action){
			return function(){
				// console.log( 'doAction > action: ', action );
				// 這裏返還 Promise，因此可偵知 data fetching 整套跑完
				return store.dispatch(ShopActions[action].apply( null, arguments));
			}
		}

		// page() 是最重要的 routing 啟始指令，之後才會開始處理所有 routing rule
		// 並且只有在 browser 環境內才需要啟動以提供 client-side routing 服務
		// 重要：必需確保等到 Stores 已向 Dispatcher 註冊完後才能跑，不然所有 actions.XXX() 操作都沒意義
		if ('undefined' !== typeof window) {

			// 讀取 routing table 並註冊 routing rules
			var routines = require('../routing.js');

			routines.forEach((item) => {
				page( item.path, this[item.handler].bind(this) );
			})

			setTimeout( () => {
				// 真正啟動 router，注意它只負責 client-side routing
				// console.log('Client Router 啟動');

				// isomorphic 時這裏看 store.__restored__ 來判斷是否已還原過值
				// 如果 true，則不要發出 initial 事件，以避免 todoReadAll()又去拉一次資料
				page({dispatch: !store.__restored__});
			}, 0)
		}
	}

	//================================================================================
	// 以下各支 routing method 是 client/server 共用的

	//
	todoReadAll(ctx) {

		// 手法1：等資料取回後再廣播更新畫面
		this.doAction('toggleLoading')(true, '載入中請稍候');	// 顯示 loading spinner

		// server rendering 時可偵聽這裏返還出去的 Promise，即能偵知 data fetching 完成
		// 並且此期間先顯示 loading 訊息
		return this.doAction('readAll')()
				   .then( () => {
				   		// 資料抓好了，廣播切換畫面
				   		// 意義等同這句 this.doAction('changeRoute')('master');
				   		this.route('master');
				   		this.doAction('toggleLoading')(false); // 關掉 loading spinner
				   		// console.log( '資料抓好囉 - master' );
				   	});

		// 手法2: 先切換畫面，再載入資料
		/*
		this.route('master');
		console.log( 'todoReadAll 觸發，設定 view' );

		this.doAction('readAll')('foo', 'bar')
			.then( result => console.log( 'result: ', result ) )
		*/

	}

	// ctx.params 可取得傳入的參數
	todoReadOne(ctx) {
		console.log( '\n\n拿到參數: ', ctx.params );
		var id = ctx.params.id;

		this.doAction('toggleLoading')(true, '載入中請稍候');	// 顯示 loading spinner

		return this.doAction('readOne')(id)
				   .then( () => {
				   		this.route('detail');
				   		this.doAction('toggleLoading')(false); // 關掉 loading spinner
				   	});
	}

}
