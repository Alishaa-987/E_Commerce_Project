import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import { productReducer } from "./reducers/product";
import { eventReducer } from "./reducers/event";
import { sellerReducer } from "./reducers/seller";

const Store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    seller: sellerReducer,
    events: eventReducer,
  },
});

export default Store;
