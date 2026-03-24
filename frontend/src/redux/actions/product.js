import axios from "axios";
import { server } from "../../server";
// create product 

export const createProduct = (newForm) => async (dispatch) => {
    try{
        dispatch({
            type: "productCreateRequest",   
        });

        const config = {headers:{"Content-Type":"multipart/form-data"}};
        const {data} = await axios.post(`${server}/product/create-product`, newForm, config);
        dispatch({
            type: "productCreateSuccess",
            payload: data.product,
        });
        return {
            success: true,
            product: data.product,
        };
    }catch(error){
        const message = error.response?.data?.message || "Product could not be created.";
        dispatch({
            type: "productCreateFail",
            payload: message,
        });
        return {
            success: false,
            message,
        };
    }
    
}
