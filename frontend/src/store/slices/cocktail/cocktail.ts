import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";

export interface CocktailType {
    id: number,
    name: string,
    image: string,
    introduction: string,
    recipe: string,
    ABV: number,
    price_per_glass: number
    type: string,
    author_id: number,
    created_at: Date,
    updated_at: Date,
    rate: number
}

export interface CocktailInfo {
    cocktailList: CocktailType[],
    cocktailItem: CocktailType | null,
}

const initialState : CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
};

export const fetchCocktailList = createAsyncThunk(
    "cocktail/fetchCocktailList", 
    async (type: string) => {
        const params = { type: type };
        const response = await axios.get('/api/v1/cocktails/', {params});
        console.log(response.data);
        return response.data;
    },
)

export const getCocktail = createAsyncThunk(
    "cocktail/getCocktail",
    async (id: CocktailType["id"], { dispatch }) => {
        const response = await axios.get(`/api/v1/cocktails/${id}/`)
        console.log(response.data);
        return response.data;
    }
)

export const postCocktail = createAsyncThunk(
    "cocktail/postCocktail",
    async (cocktail: Omit<CocktailType, "id">, { dispatch }) => {
        const response = await axios.post('/api/v1/cocktails/', cocktail);
        console.log(response.data);
        dispatch(cocktailActions.addCocktail(response.data));
    }
)

export const cocktailSlice = createSlice({
    name: "cocktail",
    initialState,
    reducers: {
        addCocktail: (
            state,
            action: PayloadAction<Omit<CocktailType, "id">>
        ) => {
            const newCocktail = {
                id: (state.cocktailList.at(-1)?.id ?? 0) + 1,  // Temporary
                image: action.payload.image,
                name: action.payload.name,
                introduction: action.payload.introduction,
                recipe: action.payload.recipe,
                ABV: action.payload.ABV,
                price_per_glass: action.payload.price_per_glass,
                type: action.payload.type,
                author_id: action.payload.author_id,
                created_at: action.payload.created_at,
                updated_at: action.payload.updated_at,
                rate: action.payload.rate,
            };
            state.cocktailList.push(newCocktail);
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
        });
        builder.addCase(getCocktail.fulfilled, (state, action) => {
            state.cocktailItem = action.payload;
        });
        builder.addCase(postCocktail.rejected, (_state, action) => {
            console.error(action.error);
        });
    },
});

export const cocktailActions = cocktailSlice.actions;
export const selectCocktail = (state: RootState) => state.cocktail;

export default cocktailSlice.reducer;