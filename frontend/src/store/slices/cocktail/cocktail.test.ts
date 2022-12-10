import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import { Filterparam } from "../../../InitPage/InitPage";
import reducer, {
    CocktailItemType,
    CocktailDetailType,
    IngredientPrepareType,
    CocktailInfo,
    cocktailActions,
    editCocktail,
    FilterParamType,
    PostForm, fetchMyBookmarkCocktailList, authPostCocktail, toggleBookmark, deleteCocktail
} from "./cocktail";
import { fetchCustomCocktailList, fetchStandardCocktailList, fetchMyCocktailList } from "./cocktail";
import { getCocktail, postCocktail } from "./cocktail"

describe("cocktail reducer", () => {
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
        is_bookmarked: false,
    }
    const fakeCocktailItemST = {
        id: 1,
        name: "name",
        image: "img",
        type: "ST",
        tags: ["ST1", "ST2"],
        author_id: 1,
        rate: 1,
        is_bookmarked: false,
    }
    const fakeCocktailItemST_2 = {
        id: 2,
        name: "name",
        image: "img",
        type: "ST",
        tags: ["ST1", "ST2"],
        author_id: 1,
        rate: 1,
        is_bookmarked: false,
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
    const fakeDetailCSNeg = {
        id: -2,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1", "CS2"],
        author_id: -2,
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
        }],
        is_bookmarked: false,
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
        }],
        is_bookmarked: false,
    }
    const fakeDetailOmit: PostForm = {
        cocktail: {
            name: "name",
            name_eng: "name_eng",
            color: "ffffff",
            image: "img",
            tags: ["ST1", "ST2"],
            author_id: 1,
            introduction: "intro",
            recipe: "recipe",
            ABV: 1,
            price_per_glass: 1,
            ingredients: []
        },
        token: 'Token',
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
        const mockFilterParam: FilterParamType = { type_one: [], type_two: [], type_three: [], name_param: [], available_only: true }
        await store.dispatch(fetchStandardCocktailList(mockFilterParam));
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemST])
    });
    it("should handle fetchStandardCocktailList no params", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: { cocktails: [fakeCocktailItemST] } });
        await store.dispatch(fetchStandardCocktailList(null));
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
        const mockFilterParam: FilterParamType = { type_one: [], type_two: [], type_three: [], name_param: [], available_only: true }
        await store.dispatch(fetchStandardCocktailList(mockFilterParam));
        expect(store.getState().cocktail.listStatus).toEqual('failed')
    });
    it("should handle fetchCustomCocktailList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: { cocktails: [fakeCocktailItemCS] } });
        const mockFilterParam: FilterParamType = { type_one: [], type_two: [], type_three: [], name_param: [], available_only: true }
        await store.dispatch(fetchCustomCocktailList(mockFilterParam));
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle fetchCustomCocktailList no params", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: { cocktails: [fakeCocktailItemCS] } });
        await store.dispatch(fetchCustomCocktailList(null));
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
        const mockFilterParam: FilterParamType = { type_one: [], type_two: [], type_three: [], name_param: [], available_only: true }
        await store.dispatch(fetchCustomCocktailList(mockFilterParam));
        expect(store.getState().cocktail.listStatus).toEqual('failed')
    });
    it("should handle fetchMyCocktailList", async () => {
        const token = 'Token'
        axios.get = jest.fn().mockResolvedValue({ data: { cocktails: [fakeCocktailItemCS] } });
        await store.dispatch(fetchMyCocktailList(token));
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle fetchMyCocktailList when failed", async () => {
        const token = 'Token';
        (axios.get as jest.Mock).mockImplementationOnce(() => {
            throw {
                response: {
                    data: {
                        message: 'Error',
                    },
                },
            };
        });
        await store.dispatch(fetchMyCocktailList(token));
        expect(store.getState().cocktail.listStatus).toEqual('failed')
    });

    it("should handle getCocktail", async () => {
        axios.get = jest.fn().mockResolvedValueOnce({ data: [fakeIngredients] }).mockResolvedValueOnce({ data: fakeDetailCS }).mockResolvedValueOnce({data : {username: "user"}});
        await store.dispatch(getCocktail(1));
        expect(store.getState().cocktail.itemStatus).toEqual("success")
        expect(store.getState().cocktail.cocktailItem).toEqual({...fakeDetailCS, author_name: "user"})
    });
    it("should handle getCocktail -1 Auth", async () => {
        axios.get = jest.fn().mockResolvedValueOnce({ data: [fakeIngredients] }).mockResolvedValueOnce({ data: fakeDetailCSNeg }).mockResolvedValueOnce({data : {username: "user"}});
        await store.dispatch(getCocktail(1));
        expect(store.getState().cocktail.itemStatus).toEqual("success")
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
        await store.dispatch(postCocktail(fakeDetailOmit.cocktail));
        //expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle authPostCocktail", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: fakeCocktailItemST });
        await store.dispatch(authPostCocktail(fakeDetailOmit));
        //expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });

    it("should handle editCocktail", async () => {
        axios.put = jest.fn().mockResolvedValue({ data: fakeCocktailItemST });
        await store.dispatch(editCocktail({ data: fakeDetailOmit, id: 11 }));
        //expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle editCocktail when different id exists", async () => {
        axios.put = jest.fn().mockResolvedValue({ data: fakeCocktailItemST_2 });
        await store.dispatch(editCocktail({ data: fakeDetailOmit, id: 11 }));
        //expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });


    it("should handle fetchMyBookmarkCocktailList", async () => {
        const token = 'Token'
        axios.get = jest.fn().mockResolvedValue({ data: { cocktails: [fakeCocktailItemCS] } });
        await store.dispatch(fetchMyBookmarkCocktailList(token));
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle fetchMyBookmarkCocktailList when failed", async () => {
        const token = 'Token';
        axios.get = jest.fn().mockImplementationOnce(() => {
            throw {
                response: {
                    data: {
                        message: 'Error',
                    },
                },
            };
        });
        await store.dispatch(fetchMyBookmarkCocktailList(token));
        expect(store.getState().cocktail.listStatus).toEqual('failed')
    });

    it("should handle toggleBookmark", async () => {
        axios.get = jest.fn().mockResolvedValueOnce({ data: [fakeIngredients] }).mockResolvedValueOnce({ data: fakeDetailCS }).mockResolvedValueOnce({data : {username: "user"}});
        await store.dispatch(getCocktail(1));
        const token = 'Token'
        axios.put = jest.fn().mockResolvedValue({ data: { cocktail_id: 1 } });
        await store.dispatch(toggleBookmark({ cocktail_id: 1, token: token }));
    });
    it("should handle toggleBookmark", async () => {
        const token = 'Token'
        axios.put = jest.fn().mockResolvedValue({ data: { cocktail_id: 111 } });
        await store.dispatch(toggleBookmark({ cocktail_id: 111, token: token }));
    });

    it("should handle deleteCocktail", async () => {
        const token = 'Token'
        axios.delete = jest.fn().mockResolvedValue({ data: { cocktail_id: 111 } });
        await store.dispatch(deleteCocktail({cocktail_id: 1, token: token}));
    });


});
