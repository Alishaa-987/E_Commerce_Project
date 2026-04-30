import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import { productReducer } from "./reducers/product";
import { eventReducer } from "./reducers/event";
import { sellerReducer } from "./reducers/seller";
import { cartReducer } from "./reducers/cart";
import { orderReducer } from "./reducers/order";

import { conversationReducer } from "./reducers/conversation";
import { messageReducer } from "./reducers/message";

const Store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    seller: sellerReducer,
    events: eventReducer,
    cart: cartReducer,
    order: orderReducer,
    conversations: conversationReducer,
    messages: messageReducer,
  },
});

export default Store;
