import { bindActionCreators } from 'redux';
import TodoApp from '../components/TodoApp';
import ProductsContainer from '../components/ProductsContainer';
import ProductDetail from '../components/ProductDetail';
import CartContainer from '../components/CartContainer';
import * as ShopActions from '../actions/ShopActions';

// 注意 store 偷傳進來了
export default function routes(store) {

    // bind 一次之後可重覆用
    const actions = bindActionCreators(ShopActions, store.dispatch);

    // 目地：盡量讓這支 fn 可泛用
    function fetchData( actionFn ){
        return (state, transition, callback) => {
            console.log( 'fetchData run' );
            console.log( 'state.params: ', state.params );
            // 一律整包 state.params 送進去 ShopAction，那裏再 destructuring 取出要的欄位即可
            actionFn( state.params )
            .then( result => callback(),
                   err => callback(err) );
        }
    }

    // 除了共用 fetchData() 外，如需特別判斷邏輯，也可改用獨立的 fetch fn
    // 此時就可直接操作 action.readOne() 了，但一樣透過 state.params.id 取得參睥
    function fetchOne(){
        return (state, transition, callback) => {

            console.log( '\nfetchOne run');

            // 先檢查是否已撈過該筆資料，沒有的話才回 server 取
            let existed = store.getState().products.productsById.get(state.params.id) != null;

            // 一律整包 state.params 送進去 ShopAction，那裏再 destructuring 取出要的欄位即可
            // 注意多塞了 existed 屬性，避免重覆撈取已存在的資料
            actions.readOne( {...state.params, existed} )
            .then( result => callback(),
                   err => callback(err) );
        }
    }

    return {
    // onEnter: TodoApp.onEnterCreator(store),
    component: TodoApp,
    childRoutes: [

      {
        path: "/",
        components: {main: ProductsContainer, cart: CartContainer},
        onEnter: fetchData( actions.readAll ),
      },
      {
        path: "/:id",
        components: {main: ProductDetail, cart: CartContainer},
        onEnter: fetchOne(),
        // onEnter: ProductDetail.onEnterCreator(store),
      },

      {
        path: "*",
        onEnter(state, transition) {
          // You may choose to render a 404 PageView here.
          transition.to("/");
        },
      },
    ],
    };
}
