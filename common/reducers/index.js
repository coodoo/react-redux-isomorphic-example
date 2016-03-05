import { combineReducers } from 'redux';

import products from "./ProductReducer";
import carts from "./CartReducer";

export default combineReducers({
  products,
  carts,
});
