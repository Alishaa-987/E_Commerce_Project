// add to cart

export const addToCart = (data) => async(dispatch, getState) =>{
    dispatch({
        type: "addToCart",
        payload: data,
    });

    localStorage.setItem("cart", JSON.stringify(getState().cart.cart));
    return data;
};

// remve from cart 

export const removeFromCart = (data) => async(dispatch, getState) =>{
    dispatch({
        type: "removeFromCart",
        payload: data,
    });

    localStorage.setItem("cart", JSON.stringify(getState().cart.cart));
    return data;
};
