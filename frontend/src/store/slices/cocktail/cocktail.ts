import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";
import ingredient, { IngredientType } from "../ingredient/ingredient";


export interface CocktailItemType {
    id: number,
    name: string,
    image: string,
    type: string,
    tags: string[],
    author_id: number | null,
    rate: number
}

export interface CocktailDetailType {
    id: number,
    name: string,
    image: string,
    introduction: string,
    recipe: string,
    ABV: number,
    price_per_glass: number
    tags: string[],
    type: string,
    author_id: number | null,
    created_at: Date,
    updated_at: Date,
    rate: number,
    ingredients: IngredientPrepareType[]
}

export interface IngredientPrepareType extends IngredientType {
    amount: number;
}

export interface CocktailInfo {
    cocktailList: CocktailItemType[],
    cocktailItem: CocktailDetailType | null,
}
const initialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
}




export const fetchStandardCocktailList = createAsyncThunk(
    "cocktail/fetchStandardCocktailList", async () => {
        const response = await axios.get('/api/v1/cocktails/?type=standard');
        console.log(response.data)
        return response.data
    },
)

export const fetchCustomCocktailList = createAsyncThunk(
    "cocktail/fetchCustomCocktailList", async () => {
        const response = await axios.get('/api/v1/cocktails/?type=custom');
        console.log(response.data)
        return response.data
    },
)

export const getCocktail = createAsyncThunk(
    "cocktail/getCocktail",
    async (id: CocktailItemType["id"]) => {
        const ingredient_response = await axios.get(`/api/v1/cocktails/${id}/ingredients`)
        console.log(ingredient_response.data)

        const response = await axios.get(`/api/v1/cocktails/${id}`)
        console.log(response.data)

        return { ...response.data, ingredients: ingredient_response.data };
    }


)

// export const getCocktailIngredients = createAsyncThunk(
//     "cocktail/getCocktailIngredients",
//     async (id: CocktailItemType["id"]) => {
//         const response = await axios.get(`/api/v1/cocktails/${id}/ingredients`)
//         console.log(response.data)
//         return response.data;
//     }
// )

export const cocktailSlice = createSlice({
    name: "cocktail",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchCustomCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
        });
        builder.addCase(fetchStandardCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
        });
        builder.addCase(getCocktail.fulfilled, (state, action) => {
            state.cocktailItem = action.payload;
        });
    },
})

export const cocktailActions = cocktailSlice.actions;
export const selectCocktail = (state: RootState) => state.cocktail;

export default cocktailSlice.reducer;