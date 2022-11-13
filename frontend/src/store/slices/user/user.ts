import { createSlice } from "@reduxjs/toolkit";
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

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {},
});

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;