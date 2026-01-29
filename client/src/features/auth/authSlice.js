import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authAPI";

export const login = createAsyncThunk("auth/login", loginUser);
export const register = createAsyncThunk("auth/register", registerUser);

const initialState = {
    user: null,
    token: localStorage.getItem("token"),
    status: "idle",
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", action.payload.token);
        });
    },
});

export const { logout } = slice.actions;
export default slice.reducer;
