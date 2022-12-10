import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface UserType {
    id: string | null,
    username: string | null;
    password: string | null;
    nickname: string | null;
    intro: string | null;
    profile_img: string | null;
}

export interface UserInfo {
    user: UserType | null;
    token: string | null;
    isLogin: boolean;
}

const initialState: UserInfo = {
    user: {
        id: (localStorage.getItem("id") === null) ? null : localStorage.getItem("id"),
        username: (localStorage.getItem("username") === null) ? null : localStorage.getItem("username"),
        password: null,
        nickname: (localStorage.getItem("nickname") === null) ? null : localStorage.getItem("nickname"),
        intro: (localStorage.getItem("intro") === null) ? null : localStorage.getItem("intro"),
        profile_img: (localStorage.getItem("profile_img") === null) ? null : localStorage.getItem("profile_img"),
    },
    token: (localStorage.getItem("token") === null) ? null : localStorage.getItem("token"),
    isLogin: (localStorage.getItem("token") !== null)
};

export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (user: Pick<UserType, "username" | "password">) => {
        await axios.post('/api/v1/auth/signup/', user)
            .then(function (response) {
                return response.data;
            })
    }
)

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (user: Pick<UserType, "username" | "password">, { dispatch }) => {
        await axios.post('/api/v1/auth/login/', user)
            .then(function (response) {
                dispatch(userActions.loginUser(response.data.user_data));
                dispatch(userActions.setToken(response.data.token))
                return response.data
            })
    }
);

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (token: string | null, { dispatch }) => {
        localStorage.removeItem("token")
        localStorage.removeItem("id")
        localStorage.removeItem("username")
        localStorage.removeItem("intro")
        localStorage.removeItem("profile_img")
        localStorage.removeItem("nickname")

        await axios.post('/api/v1/auth/logout/', {}, {
            headers: {
                Authorization: `Token ${token}`,
            },
        })
            .then(function (response) {
                dispatch(userActions.logoutUser());
                alert("로그아웃이 성공적으로 수행되었습니다.")
                return response.data
            })
            .catch(function () {
                dispatch(userActions.logoutUser());
                alert(
                    "이미 로그아웃 되었습니다."
                )
            });
    }
);

export const getUser = createAsyncThunk(
    "user/getUser",
    async (token: string | null) => {
        const response = await axios.get('/api/v1/user/me/',{
            headers: {
                Authorization: `Token ${token}`,
            },
        });
        return response.data
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setToken: (
            state,
            action: PayloadAction<string>
        ) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload)
        },
        loginUser: (
            state,
            action: PayloadAction<UserType>
        ) => {
            state.isLogin = true;
            state.user = action.payload;
            if (action.payload.id) {
                localStorage.setItem("id", action.payload.id)
            }
            if (action.payload.username) {
                localStorage.setItem("username", action.payload.username)
            }
            if (action.payload.intro) {
                localStorage.setItem("intro", action.payload.intro)
            }
            if (action.payload.profile_img) {
                localStorage.setItem("profile_img", action.payload.profile_img)
            }
            if (action.payload.nickname) {
                localStorage.setItem("nickname", action.payload.nickname)
            }
        },
        logoutUser: (
            state,
        ) => {
            state.user = null;
            state.token = null;
            state.isLogin = false;
        },
    },
});

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;