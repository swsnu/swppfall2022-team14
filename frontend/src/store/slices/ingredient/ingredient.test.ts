import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import reducer, {IngredientType, IngredientInfo} from "./ingredient";
import {fetchIngredientList, getIngredient} from "./ingredient";

describe("userInfo reducer", () => {
    let store: EnhancedStore<
        { ingredient: IngredientInfo },
        AnyAction,
        [ThunkMiddleware<{ ingredient: IngredientInfo }, AnyAction, undefined>]
        >;

    const fakeIngredient = {
            id: 1,
            name: 'name',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            introduction: '소개',
            ABV: 42.4,
            price: 200
        }

    beforeAll(() => {
        store = configureStore({ reducer: { ingredient: reducer } });
    });

    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            ingredientList: [],
            ingredientItem: {
                id: 1,
                name: 'name',
                image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
                introduction: '소개',
                ABV: 42.4,
                price: 200
            },
            itemStatus: "loading",
            listStatus: "loading"
        });
    });

    it("should handle fetchIngredientList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: {Ingredients: [fakeIngredient]} });
        await store.dispatch(fetchIngredientList());
        expect(store.getState().ingredient.ingredientList).toEqual([fakeIngredient])
    });
    it("should handle Error fetchIngredientList", async () => {
        axios.get = jest.fn().mockRejectedValue({ data: {Ingredients: [fakeIngredient]} });
        await store.dispatch(fetchIngredientList());
        expect(store.getState().ingredient.listStatus).toEqual("failed")
    });

    it("should handle getIngredient", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakeIngredient });
        await store.dispatch(getIngredient(1));
        expect(store.getState().ingredient.ingredientItem).toEqual(fakeIngredient)
        expect(store.getState().ingredient.ingredientItem?.id).toEqual(1)
    });
    it("should handle Error getIngredient", async () => {
        axios.get = jest.fn().mockRejectedValue({ data: fakeIngredient });
        await store.dispatch(getIngredient(1));
        expect(store.getState().ingredient.itemStatus).toEqual("failed")
    });

});