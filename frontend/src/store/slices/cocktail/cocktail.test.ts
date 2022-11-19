import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import { Filterparam } from "../../../InitPage/InitPage";
import reducer, { CocktailItemType, CocktailDetailType, IngredientPrepareType, CocktailInfo, cocktailActions, editCocktail, FilterParamType } from "./cocktail";
import { fetchCustomCocktailList, fetchStandardCocktailList, fetchMyCocktailList } from "./cocktail";
import { getCocktail, postCocktail } from "./cocktail"

describe("userInfo reducer", () => {
    let store: EnhancedStore<
        { cocktail: CocktailInfo },
        AnyAction,
        [ThunkMiddleware<{ cocktail: CocktailInfo }, AnyAction, undefined>]
    >;

    const fakeCocktailItemCS = {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1", "CS2"],
        author_id: 1,
        rate: 1,
    }
    const fakeCocktailItemST = {
        id: 1,
        name: "name",
        image: "img",
        type: "ST",
        tags: ["ST1", "ST2"],
        author_id: 1,
        rate: 1,
    }
    const fakeCocktailItemST_2 = {
        id: 2,
        name: "name",
        image: "img",
        type: "ST",
        tags: ["ST1", "ST2"],
        author_id: 1,
        rate: 1,
    }


    const fakeIngredients = {
        id: 1,
        name: "iname",
        image: "iimg",
        ABV: 1,
        price: 1,
        introduction: "iintro",
        amount: 1,
    }
    const fakeDetailCS = {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1", "CS2"],
        author_id: 1,
        rate: 1,
        introduction: "intro",
        recipe: "recipe",
        ABV: 1,
        price_per_glass: 1,
        created_at: "2020-10-10",
        updated_at: "2020-10-10",
        ingredients: [{
            id: 1,
            name: "iname",
            image: "iimg",
            ABV: 1,
            price: 1,
            introduction: "iintro",
            amount: 1,
        }]
    }
    const fakeDetailOmit = {
        id: 1,
        name: "name",
        image: "img",
        tags: ["ST1", "ST2"],
        author_id: 1,
        introduction: "intro",
        recipe: "recipe",
        ABV: 1,
        price_per_glass: 1,
        ingredients: []
    }


    beforeAll(() => {
        store = configureStore({ reducer: { cocktail: reducer } });
    });

    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            cocktailList: [],
            cocktailItem: null,
            itemStatus: "loading",
            listStatus: "loading"
        });
    });

    it("should handle fetchStandardCocktailList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: { cocktails: [fakeCocktailItemST] } });
        const mockFilterParam: FilterParamType = { type_one: [], type_two: [], type_three: [], name_param: [], my_ingredient_id_list: [] }
        await store.dispatch(fetchStandardCocktailList(mockFilterParam));
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemST])
    });
    it("should handle fetchStandardCocktailList when failed", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => {
            throw {
                response: {
                    data: {
                        message: 'Error',
                    },
                },
            };
        });
        const mockFilterParam: FilterParamType = { type_one: [], type_two: [], type_three: [], name_param: [], my_ingredient_id_list: [] }
        await store.dispatch(fetchStandardCocktailList(mockFilterParam));
        expect(store.getState().cocktail.listStatus).toEqual('failed')
    });
    it("should handle fetchCustomCocktailList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: { cocktails: [fakeCocktailItemCS] } });
        const mockFilterParam: FilterParamType = { type_one: [], type_two: [], type_three: [], name_param: [], my_ingredient_id_list: [] }
        await store.dispatch(fetchCustomCocktailList(mockFilterParam));
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle fetchCustomCocktailList when failed", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => {
            throw {
                response: {
                    data: {
                        message: 'Error',
                    },
                },
            };
        });
        const mockFilterParam: FilterParamType = { type_one: [], type_two: [], type_three: [], name_param: [], my_ingredient_id_list: [] }
        await store.dispatch(fetchCustomCocktailList(mockFilterParam));
        expect(store.getState().cocktail.listStatus).toEqual('failed')
    });
    it("should handle fetchMyCocktailList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: { cocktails: [fakeCocktailItemCS] } });
        await store.dispatch(fetchMyCocktailList());
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle fetchMyCocktailList when failed", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => {
            throw {
                response: {
                    data: {
                        message: 'Error',
                    },
                },
            };
        });
        await store.dispatch(fetchMyCocktailList());
        expect(store.getState().cocktail.listStatus).toEqual('failed')
    });

    it("should handle getCocktail", async () => {
        axios.get = jest.fn().mockResolvedValueOnce({ data: [fakeIngredients] }).mockResolvedValueOnce({ data: fakeDetailCS });
        await store.dispatch(getCocktail(1));
        expect(store.getState().cocktail.itemStatus).toEqual("success")
        expect(store.getState().cocktail.cocktailItem).toEqual(fakeDetailCS)
    });
    it("should handle getCocktail when failed", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => {
            throw {
                response: {
                    data: {
                        message: 'Error',
                    },
                },
            };
        });
        await store.dispatch(getCocktail(1));
        expect(store.getState().cocktail.itemStatus).toEqual('failed')
    });

    it("should handle postCocktail", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: fakeCocktailItemST });
        await store.dispatch(postCocktail(fakeDetailOmit));
        //expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });

    it("should handle editCocktail", async () => {
        axios.put = jest.fn().mockResolvedValue({ data: fakeCocktailItemST });
        await store.dispatch(editCocktail(fakeDetailOmit));
        //expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle editCocktail when different id exists", async () => {
        axios.put = jest.fn().mockResolvedValue({ data: fakeCocktailItemST_2 });
        await store.dispatch(editCocktail(fakeDetailOmit));
        //expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });

});
