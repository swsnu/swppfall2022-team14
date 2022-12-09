import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import reducer, {
    RateInfo,
    RateType,
    PostRateType
} from "./rate";
import { getMyRate, postRate, editRate, deleteRate, updateRate } from "./rate"

describe("rate reducer", () => {
    let store: EnhancedStore<
        { rate: RateInfo },
        AnyAction,
        [ThunkMiddleware<{ rate: RateInfo }, AnyAction, undefined>]
        >;

    const rate: RateType = {
        id: 1,
        cocktail_id: 1,
        user_id: 1,
        score: 1
    }
    const postRateUser: PostRateType = {
        id: 1,
        cocktail_id: 1,
        user_id: 1,
        score: 1,
        token: "token"
    }
    const postRateErr: PostRateType = {
        id: 1,
        cocktail_id: 1,
        user_id: 1,
        score: 1,
        token: null
    }

    beforeEach(() => {
        store = configureStore({ reducer: { rate: reducer } });
    });

    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            rate: null,
            myRate: null
        });
    });

    it("should handle getMyRate Exist", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: 2 });
        const res = await store.dispatch(getMyRate(postRateUser));
        expect(store.getState().rate.myRate).toEqual(2)
    });

    it("should handle getMyRate Not Exist", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: null });
        const res = await store.dispatch(getMyRate(postRateUser));
        expect(store.getState().rate.myRate).toEqual(null)
    });

    it("should handle postRate", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: { rate, score: 5 } });
        await store.dispatch(postRate(postRateUser));
        expect(store.getState().rate.rate).toEqual({ rate, score: 5 })
        expect(store.getState().rate.myRate).toEqual(5)
    });

    it("should handle editRate", async () => {
        axios.put = jest.fn().mockResolvedValue({ data: { rate, score: 5 } });
        await store.dispatch(editRate(postRateUser));
        expect(store.getState().rate.rate).toEqual({ rate, score: 5 })
        expect(store.getState().rate.myRate).toEqual(5)
    });

    it("should handle deleteRate", async () => {
        axios.delete = jest.fn().mockResolvedValue({ data: { rate, score: 5 } });
        await store.dispatch(deleteRate(postRateUser));
        expect(store.getState().rate.myRate).toEqual(null)
    });

    it("should handle updateRate", async () => {
        axios.get = jest.fn().mockResolvedValueOnce( {data: { score: 4 }} );
        await store.dispatch(updateRate(1));
        expect(store.getState().rate.rate).toEqual(4)
    });

    it("should handle updateRate 0 value", async () => {
        axios.get = jest.fn().mockResolvedValueOnce( {data: { score: null }} );
        await store.dispatch(updateRate(1));
        expect(store.getState().rate.rate).toEqual(0)
    });
});