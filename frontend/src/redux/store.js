import { configureStore} from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import { productReducer } from "./reducers/product";
const Store = configureStore({
    reducer: {
        user: userReducer,
        products: productReducer,
    }       
})

export default Store;