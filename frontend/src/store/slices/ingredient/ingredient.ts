import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface IngredientType {
    id: number,
    name: string,
    name_eng: string,
    image: string,
    ABV: number,
    price: number,
    introduction: string,
    unit: string[],
    color: string
}

interface CocktailShortInfo {
    name: string;
    type: string;
    id: number;
}

interface AvailableCocktailMap {
    ingredient_id: number;
    cocktails: CocktailShortInfo[]

}

export interface IngredientInfo {
    ingredientList: IngredientType[],
    myIngredientList: IngredientType[],
    ingredientItem: IngredientType | null,
    recommendIngredientList: IngredientType[],
    availableCocktails: AvailableCocktailMap[],
    itemStatus: string,
    listStatus: string
}



const initialState: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    recommendIngredientList: [],
    availableCocktails: [],
    itemStatus: "loading",
    listStatus: "loading"
}

export const fetchIngredientList = createAsyncThunk(
    "ingredient/fetchIngredientList", async (params: string | null) => {
        if(!params){
            const response = await axios.get('/api/v1/ingredients/');
            return response.data
        }
        else{
            const response = await axios.get('/api/v1/ingredients/',{
                params: {
                    search: params
                },
            });
            return response.data
        }
    },
)


export const fetchMyIngredientList = createAsyncThunk(
    "cocktail/fetchMyIngredientList", async (token: string | null) => {
        const response = await axios.get(`/api/v1/store/`,{
            headers: {
                Authorization: `Token ${token}`,
            },
        });
        return response.data
    },
)

export const getRecommendIngredientList = createAsyncThunk(
    "cocktail/getRecommendIngredientList", async (token : string | null) => {
        const response = await axios.get(`/api/v1/ingredients/recommend/`,{
            headers: {
                Authorization: `Token ${token}`,
            },
        });
        return response.data
    },
)



export interface PostIngredientProps {
    id: number;
    ingredients: number[] // ingredient ids
    token: string | null
}
export const postMyIngredients = createAsyncThunk(
    "cocktail/postMyIngredientList", async (param: PostIngredientProps, { dispatch }) => {
        const response = await axios.post(`/api/v1/store/`, param,{
            headers: {
                Authorization: `Token ${param.token}`,
            },
        });
        // dispatch(fetchMyIngredientList(param.token))
        return response.data
    },
)

export interface DeleteIngredientProps {
    user_id: number;
    ingredient_id: number; // ingredient ids
    token: string | null
}

export const deleteMyIngredients = createAsyncThunk(
    "cocktail/deleteMyIngredientList", async (param: DeleteIngredientProps, { dispatch }) => {
        const response = await axios.delete(`/api/v1/store/${param.ingredient_id}/`,{
            headers: {
                Authorization: `Token ${param.token}`,
            },
        });
        // dispatch(fetchMyIngredientList(param.token))
        return response.data
    },
)



export const getIngredient = createAsyncThunk(
    "ingredient/getIngredient",
    async (id: IngredientType["id"]) => {
        const response = await axios.get(`/api/v1/ingredients/${id}/`)
        return response.data;
    }
)

export const ingredientSlice = createSlice({
    name: "ingredient",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchIngredientList.fulfilled, (state, action) => {
            state.ingredientList = action.payload.Ingredients;
            state.listStatus = "success"
        });
        builder.addCase(fetchIngredientList.pending, (state) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchIngredientList.rejected, (state) => {
            state.listStatus = "failed";
        });
        builder.addCase(getIngredient.pending, (state) => {
            state.itemStatus = "loading"
        });
        builder.addCase(getIngredient.fulfilled, (state, action) => {
            state.ingredientItem = action.payload;
            state.itemStatus = "success"
        });
        builder.addCase(getIngredient.rejected, (state) => {
            state.itemStatus = "failed"
        })
        builder.addCase(fetchMyIngredientList.fulfilled, (state, action) => {
            state.myIngredientList = action.payload.Ingredients;
            state.listStatus = "success"
        });
        builder.addCase(fetchMyIngredientList.pending, (state) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchMyIngredientList.rejected, (state) => {
            state.listStatus = "failed";
        });
        // 추천
        builder.addCase(getRecommendIngredientList.fulfilled, (state, action) => {
            state.recommendIngredientList = action.payload.Ingredients;
            state.availableCocktails = action.payload.possible_cocktails;
            state.listStatus = "success"
        });
        builder.addCase(getRecommendIngredientList.pending, (state) => {
            state.listStatus = "loading";
        });
        builder.addCase(getRecommendIngredientList.rejected, (state) => {
            state.listStatus = "failed";
        });
        builder.addCase(postMyIngredients.fulfilled, (state, action) => {
            const added_cocktails = action.payload.Ingredients
            for (let i = 0; i < added_cocktails.length; i++) {
                state.myIngredientList.push(added_cocktails[i])
            }
        });
        builder.addCase(deleteMyIngredients.fulfilled, (state, action) => {
            state.myIngredientList.splice(
                state.myIngredientList.findIndex(function(ingr) {return ingr.id === action.payload.ingredient}), 1
            )
        });
    },
})

export const ingredientActions = ingredientSlice.actions;
export const selectIngredient = (state: RootState) => state.ingredient;

export default ingredientSlice.reducer;
