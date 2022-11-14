import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";

export interface UserType {
    username: string;
    password: string;
    nickname: string;
    intro: string;
    profile_img: string;
}

export interface UserState {
    user: UserType | null;
}

const initialState: UserState = {
    user: null,
};

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (user: Pick<UserType, "username" | "password">, { dispatch }) => {
        const response = await axios.put('/api/v1/auth/login/', user);
        dispatch(userActions.loginUser(response.data));
    }
);

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_data, { dispatch }) => {
        const response = await axios.put('/api/v1/auth/logout/');
        dispatch(userActions.logoutUser(response.data));
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser: (
            state,
            action: PayloadAction<UserType>
        ) => {
            state.user = action.payload;
        },
        logoutUser: (
            state,
            _action: PayloadAction<UserType>
        ) => {
            state.user = null;
        },
    },
});

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;