import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
    name: "user",
    initialState: {
        user: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        LoadingUserRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        LoadingUserSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        LoadingUserFail: (state, action) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = action.payload;
        },
        clearErrors: (state) =>{    
            state.error = null;
        }
    }
});

export const { LoadingUserRequest, LoadingUserSuccess, LoadingUserFail, clearErrors } = userReducer.actions;
export default userReducer.reducer;
