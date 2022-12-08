import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import reducer, {
    UserInfo,
    UserType
} from "./user";
import { registerUser, loginUser, logoutUser, getUser } from "./user"

const localStorageMock = (function () {
    const store: any = {};

    return {
        getItem(key: string) {
            return store[key];
        },
        setItem(key: string, value: string) {
            store[key] = value;
        },
        removeItem(key: string) {
            delete store[key]
        }
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const setLocalStorage = (id: string, data: string) => {
    window.localStorage.setItem(id, data);
};
const removeLocalStorage = (id: string) => {
    window.localStorage.removeItem(id);
};

describe("user reducer", () => {
    let store: EnhancedStore<
        { user: UserInfo },
        AnyAction,
        [ThunkMiddleware<{ user: UserInfo }, AnyAction, undefined>]
    >;

    const user: UserType = {
        id: "1",
        username: "name",
        password: "pw",
        nickname: "nick",
        intro: "intro",
        profile_img: "img"
    }
    const notUser: UserType = {
        id: null,
        username: null,
        password: null,
        nickname: null,
        intro: null,
        profile_img: null
    }

    setLocalStorage("token", "Token")

    beforeEach(() => {
        setLocalStorage("token", "Token")
        setLocalStorage("token", "Token")
        window.localStorage.setItem("token", "Token")
        console.log(localStorage.getItem("token"))
        store = configureStore({ reducer: { user: reducer } });
        console.log(store.getState().user.token)
    });

    it("should handle initial state", () => {
        window.localStorage.setItem("token", "Token")
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            user: {
                id: null,
                username: null,
                password: null,
                nickname: null,
                intro: null,
                profile_img: null,
            },
            token: null,
            isLogin: false
        });
    });

    it("should handle registerUser", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: "success" });
        const res = await store.dispatch(registerUser({ username: "name", password: "pw" }));
        expect(res.type).toEqual("user/registerUser/fulfilled")
    });

    it("should handle loginUser", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: { user_data: user, token: 'Token' } });
        await store.dispatch(loginUser({ username: "name", password: "pw" }));
        expect(store.getState().user).toEqual({ user: user, token: 'Token', isLogin: true })
    });

    it("should handle Error loginUser", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: { user_data: notUser, token: null } });
        await store.dispatch(loginUser({ username: "name", password: "pw" }));
        expect(store.getState().user).toEqual({ user: notUser, token: null, isLogin: true })
    });

    it("should handle logoutUser", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: { user_data: user, token: 'Token' } });
        await store.dispatch(logoutUser("Token"));
        expect(store.getState().user).toEqual({ user: null, token: null, isLogin: false })
    });

    it("should handle getUser", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: user });
        const res = await store.dispatch(getUser("token"));
        expect(res.payload).toEqual(user)
    });
});