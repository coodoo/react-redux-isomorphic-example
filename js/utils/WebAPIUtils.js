var shop = require('../api/shop');

// WebAPIUitl 的角色是操作 remote REST API
// 並負責轉換取回的物件為正確的格式
export default {

    getAllProducts: function() {
        console.log( '\n\tWebAPIUtil::getAllProducts run' );

        if( 'undefined' == typeof window ||
            ('undefined' !== typeof window && window.$FETCHED == false) ){

            console.log( '撈原始資料' );
            window.$FETCHED = true;

            // on server, or first time on client
            return shop.getProducts().then( result => {
                console.log( 'WebAPIUtil 先看結果: ', result );
                return result;
            });

        }else{
            console.log( '撈 window.getProducts 資料' );
            // hack
            return Promise.resolve(window.getProducts().productsById);
        }

    },

    getOneProduct: function(id) {
        console.log( '\n\tWebAPIUtil::getOneProduct run' );
        return shop.getOneProduct(id);
    },

    addToCart: function(product){
        return shop.addToCart(product.id);
    },

    checkoutProducts: function(products) {
        return shop.buyProducts(products);
    }
};
