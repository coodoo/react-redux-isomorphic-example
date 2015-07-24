var shop = require('../api/shop');

export default {

    getAllProducts: function() {
        return shop.getProducts();
    },

    getOneProduct: function(id) {
        return shop.getOneProduct(id);
    },

    checkoutProducts: function(products) {
        return shop.buyProducts(products);
    }
};
