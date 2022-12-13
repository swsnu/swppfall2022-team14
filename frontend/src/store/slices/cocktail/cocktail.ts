import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";
import { IngredientType } from "../ingredient/ingredient";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface CocktailItemType {
    id: number,
    name: string,
    image: string,
    type: "CS" | "ST",
    tags: string[],
    author_id: number | null,
    rate: number,
    is_bookmarked: boolean,
    ABV: number,
    price_per_glass: number,
}

export interface CocktailDetailType {
    id: number,
    name: string,
    name_eng: string,
    color: string,
    filter_type_one: string,
    filter_type_two: string,
    image: string,
    introduction: string,
    recipe: string,
    ABV: number,
    price_per_glass: number
    tags: string[],
    type: "CS" | "ST",
    author_id: number | null,
    author_name: string | null,
    created_at: Date,
    updated_at: Date,
    rate: number,
    ingredients: IngredientPrepareType[],
    is_bookmarked: boolean,
    score: number
}

export interface IngredientPostType extends Omit<IngredientType, 'unit'> {
    unit: string;
    amount: string;
}

export interface CocktailPostType extends Omit<CocktailDetailType, "id" | "type" | "author_name" | "name_eng" | "created_at" | "updated_at" | "rate" | "is_bookmarked" | "score" | "ingredients"> {
    name_eng: string | null
    ingredients: IngredientPostType[];

}

export interface IngredientPrepareType extends IngredientType {
    amount: string;
    recipe_unit: string;
}

export interface CocktailInfo {
    cocktailList: CocktailItemType[],
    cocktailItem: CocktailDetailType | null,
    itemStatus: string,
    listStatus: string
}

export interface PostForm {
    cocktail: CocktailPostType
    token: string;
}

const initialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading"
}



export interface FilterParamType {
    type_one: string[];
    type_two: string[];
    type_three: string[];
    name_param: string[];
    available_only: boolean
    color: string | null;

}

export const fetchStandardCocktailList = createAsyncThunk(
    "cocktail/fetchStandardCocktailList", async (params: FilterParamType | null) => {
        if (!params) {
            const response = await axios.get(`/api/v1/cocktails/init/?type=standard`);
            return response.data
        }
        else {
            const response = await axios.get(`/api/v1/cocktails/?type=standard`,
                {
                    params: params,
                }
            );
            return response.data
        }

    },
)

export const fetchCustomCocktailList = createAsyncThunk(
    "cocktail/fetchCustomCocktailList", async (params: FilterParamType | null) => {
        if (!params) {
            const response = await axios.get(`/api/v1/cocktails/init/?type=custom`);
            return response.data
        }
        else {
            const response = await axios.get(`/api/v1/cocktails/?type=custom`,
                {
                    params: params
                }
            );
            return response.data
        }

    },
)


export const fetchMyBookmarkCocktailList = createAsyncThunk(
    "cocktail/fetchMyBookmarkCocktailList", async (token: string) => {
        const response = await axios.get('/api/v1/bookmark/me/', {
            headers: {
                Authorization: `Token ${token}`,
            }
        });
        return response.data
    },
)


export const fetchMyCocktailList = createAsyncThunk(
    "cocktail/fetchMyCocktailList", async (token: string) => {
        const response = await axios.get('/api/v1/cocktails/me/', {
            headers: {
                Authorization: `Token ${token}`,
            }
        });
        return response.data
    },
)

export const getCocktail = createAsyncThunk(
    "cocktail/getCocktail",
    async (id: CocktailItemType["id"]) => {
        const ingredient_response = await axios.get(`/api/v1/cocktails/${id}/ingredients/`)

        const response = await axios.get(`/api/v1/cocktails/${id}/`)

        if (response.data.author_id > 0) {
            const author_response = await axios.get(`/api/v1/user/${response.data.author_id}/`);
            return { ...response.data, ingredients: ingredient_response.data, author_name: author_response.data.username };
        } else {
            return { ...response.data, ingredients: ingredient_response.data };
        }
    }
)

export const postCocktail = createAsyncThunk(
    "cocktail/postCocktail",
    async (cocktail: CocktailPostType, { dispatch }) => {
        const response = await axios.post<CocktailDetailType>('/api/v1/cocktails/', cocktail);
        dispatch(cocktailActions.addCocktail(response.data));
        return response.data;
    }
)

export const authPostCocktail = createAsyncThunk(
    "cocktail/postCocktail",
    async (cocktail: PostForm, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post<CocktailDetailType>('/api/v1/cocktails/post/', cocktail.cocktail, {
                headers: {
                    Authorization: `Token ${cocktail.token}`,
                },
            });
            dispatch(cocktailActions.addCocktail(response.data));
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response.data["code"])
        }
    }
)

export const editCocktail = createAsyncThunk(
    "cocktail/editCocktail",
    async (cocktail: { data: PostForm, id: number }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.put<CocktailDetailType>(`/api/v1/cocktails/${cocktail.id}/edit/`, cocktail.data.cocktail, {
                headers: {
                    Authorization: `Token ${cocktail.data.token}`
                }
            });
            dispatch(cocktailActions.editCocktail(response.data));
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response.data["code"])
        }
    }
)

export const deleteCocktail = createAsyncThunk(
    "cocktail/deleteCocktail",
    async (data: { cocktail_id: number, token: string }) => {
        await axios.delete(`/api/v1/cocktails/${data.cocktail_id}/delete/`, {
            headers: {
                Authorization: `Token ${data.token}`,
            },
        });
        return { cocktail_id: data.cocktail_id }
    }
)

export const toggleBookmark = createAsyncThunk(
    "cocktail/toggleBookmark",
    async (data: { cocktail_id: number, token: string }) => {
        await axios.put(`/api/v1/bookmark/cocktails/${data.cocktail_id}/`, null, {
            headers: {
                Authorization: `Token ${data.token}`,
            },
        });
        return { cocktail_id: data.cocktail_id }
    }
)



export const cocktailSlice = createSlice({
    name: "cocktail",
    initialState,
    reducers: {
        addCocktail: (state, action: PayloadAction<CocktailDetailType>) => {
            state.cocktailList.push(action.payload)
        },
        editCocktail: (state, action: PayloadAction<CocktailDetailType>) => {
            const editted = state.cocktailList.map((cocktail) => {
                if (cocktail.id === action.payload.id) {
                    return { ...cocktail, name: action.payload.name, image: action.payload.image, tags: action.payload.tags };
                } else {
                    return cocktail;
                }
            });
            state.cocktailList = editted;
        },
    },
    extraReducers: (builder) => {
        //CustomCocktailList
        builder.addCase(fetchCustomCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
            state.listStatus = "success";
        });
        builder.addCase(fetchCustomCocktailList.pending, (state) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchCustomCocktailList.rejected, (state) => {
            state.listStatus = "failed";
        });
        //StandardCocktailList
        builder.addCase(fetchStandardCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
            state.listStatus = "success";
        });
        builder.addCase(fetchStandardCocktailList.pending, (state) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchStandardCocktailList.rejected, (state) => {
            state.listStatus = "failed";
        });

        //MyCocktailList
        builder.addCase(fetchMyCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
            state.listStatus = "success";
        });
        builder.addCase(fetchMyCocktailList.pending, (state) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchMyCocktailList.rejected, (state) => {
            state.listStatus = "failed";
        });

        //MyCocktailList
        builder.addCase(fetchMyBookmarkCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
            state.listStatus = "success";
        });
        builder.addCase(fetchMyBookmarkCocktailList.pending, (state) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchMyBookmarkCocktailList.rejected, (state) => {
            state.listStatus = "failed";
        });

        //CocktailItem
        builder.addCase(getCocktail.fulfilled, (state, action) => {
            state.cocktailItem = action.payload;
            state.itemStatus = "success";
        });
        builder.addCase(getCocktail.pending, (state) => {
            state.itemStatus = "loading";
        });
        builder.addCase(getCocktail.rejected, (state) => {
            state.itemStatus = "failed";
        });

        //Bookmark
        builder.addCase(toggleBookmark.fulfilled, (state, action) => {
            state.cocktailList.forEach((c, i) => {
                if (c.id === action.payload.cocktail_id) {
                    state.cocktailList[i].is_bookmarked = !state.cocktailList[i].is_bookmarked
                }
            })

            if (state.cocktailItem && state.cocktailItem.id === action.payload.cocktail_id) {
                state.cocktailItem.is_bookmarked = !state.cocktailItem.is_bookmarked
            }
        });

        //Rate
    },
})
export const cocktailActions = cocktailSlice.actions;
export const selectCocktail = (state: RootState) => state.cocktail;

export default cocktailSlice.reducer;