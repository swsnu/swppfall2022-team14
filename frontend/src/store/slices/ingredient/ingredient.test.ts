import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";

import reducer, {
    IngredientType,
    IngredientInfo,
    fetchMyIngredientList,
    getRecommendIngredientList,
    postMyIngredients, deleteMyIngredients
} from "./ingredient";
import { fetchIngredientList, getIngredient } from "./ingredient";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

describe("ingredient reducer", () => {
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
            availableCocktails: [],
            ingredientList: [],
            ingredientItem: null,
            myIngredientList: [],
            itemStatus: "loading",
            listStatus: "loading",
            recommendIngredientList: []
        });
    });

    it("should handle fetchIngredientList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: { Ingredients: [fakeIngredient] } });
        await store.dispatch(fetchIngredientList());
        expect(store.getState().ingredient.ingredientList).toEqual([fakeIngredient])
    });
    it("should handle Error fetchIngredientList", async () => {
        axios.get = jest.fn().mockRejectedValue({ data: { Ingredients: [fakeIngredient] } });
        await store.dispatch(fetchIngredientList());
        expect(store.getState().ingredient.listStatus).toEqual("failed")
    });

    it("should handle fetchMyIngredientList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: { Ingredients: [fakeIngredient] } });
        await store.dispatch(fetchMyIngredientList("token"));
        expect(store.getState().ingredient.myIngredientList).toEqual([fakeIngredient])
    });
    it("should handle Error fetchMyIngredientList", async () => {
        axios.get = jest.fn().mockRejectedValue({ data: { Ingredients: [fakeIngredient] } });
        await store.dispatch(fetchMyIngredientList("token"));
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

    it("should handle getRecommendIngredientList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakeIngredient });
        const response = await store.dispatch(getRecommendIngredientList("token"));
        expect(response.payload).toEqual(fakeIngredient)
    });

    it("should handle postMyIngredients", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: fakeIngredient });
        const response = await store.dispatch(postMyIngredients({ id: 1, ingredients: [1], token: "token" }));
        expect(response.payload).toEqual(fakeIngredient)
    });

    it("should handle deleteMyIngredients", async () => {
        axios.delete = jest.fn().mockResolvedValue({ data: fakeIngredient });
        const response = await store.dispatch(deleteMyIngredients({ user_id: 1, ingredient_id: 1, token: "token" }));
        expect(response.payload).toEqual(fakeIngredient)
    });

});