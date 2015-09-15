// export { default as products } from "./ProductReducer";
// export { default as carts } from "./CartReducer";

import { combineReducers } from 'redux';

import products from "./ProductReducer";
import carts from "./CartReducer";

export default combineReducers({
  products,
  carts,
});
