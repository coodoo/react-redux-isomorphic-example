import shopdb from '../api/shopdb';
import {List, ProductRecord, convertToRecordMap } from '../constants/Types';

// WebAPIUitl is responsible to interacting with remote REST APIs
export default {

    // 從 REST API 取回一包 JSON string，立即 parse 後再轉回為 Immutable.Record 物件
    // 然後才允許此物件進入系統內流通
    getAllProducts: function() {
        console.log( '\tWebAPIUtil::getAllProducts run' );
        return shopdb.getProducts().then( result => {
            return convertToRecordMap( JSON.parse(result), ProductRecord )
        });
    },

    getOneProduct: function(id) {
        console.log( '\tWebAPIUtil::getOneProduct run' );
        return shopdb.getOneProduct(id)
                     .then( result => new ProductRecord(JSON.parse(result)) )
                     /*.then(result=>{
                        console.log( '偷看 result: ', result.toJS() );
                        return result;
                     });*/
    },

    addToCart: function(product){
        // console.log( '\n\tWebAPIUtil::addToCart run' );

        // product is a Immutable.Record, need to serialize it before sending back to server
        return shopdb.addToCart( product.toJSON() )
        			 // when we get the result back need to marshall it into Immutable.Record again
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
