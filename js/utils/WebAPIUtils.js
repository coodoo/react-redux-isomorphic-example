import shopdb from '../api/shopdb';
import {List, ProductRecord, convertToRecordMap } from '../constants/Types';

// WebAPIUitl 的角色是操作 remote REST API
// 並負責轉換取回的物件為正確的格式
export default {

    // 從 REST API 取回一包 JSON string，立即 parse 後再轉回為 Immutable.Record 物件
    // 然後才允許此物件進入系統內流通
    getAllProducts: function() {
        // console.log( '\n\tWebAPIUtil::getAllProducts run' );
        return shopdb.getProducts().then( result => {
            return convertToRecordMap( JSON.parse(result), ProductRecord )
        });
    },

    getOneProduct: function(id) {
        // console.log( '\n\tWebAPIUtil::getOneProduct run' );
        return shopdb.getOneProduct(id)
                     .then( result => new ProductRecord(JSON.parse(result)) )
                     /*.then(result=>{
                        console.log( '偷看 result: ', result.toJS() );
                        return result;
                     });*/
    },

    addToCart: function(product){
        // console.log( '\n\tWebAPIUtil::addToCart run' );
        return shopdb.addToCart(product.id)
                     .then( result => new ProductRecord(JSON.parse(result)) );
    },

    //
    checkoutProducts: function( cartsByid:List ) {
        // console.log( '\n\tWebAPIUtil::checkoutProducts run' );
        return shopdb.checkoutProducts( JSON.stringify(cartsByid) )
                     .then( result => JSON.parse(result) )
                     .catch( err => console.log( '交易出錯: ', err ) );
    }
};
