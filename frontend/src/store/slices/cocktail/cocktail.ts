import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";
import ingredient, { IngredientType } from "../ingredient/ingredient";


export interface CocktailItemType {
    id: number,
    name: string,
    image: string,
    type: "CS"|"ST"| string,
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
    type: "CS"|"ST",
    author_id: number | null,
    created_at: Date,
    updated_at: Date,
    rate: number,
    ingredients: IngredientPrepareType[]
}

export interface IngredientPrepareType extends IngredientType {
    amount: string;
}

export interface CocktailInfo {
    cocktailList: CocktailItemType[],
    cocktailItem: CocktailDetailType | null,
    itemStatus: string,
    listStatus: string
}

const initialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading"
}




export const fetchStandardCocktailList = createAsyncThunk(
    "cocktail/fetchStandardCocktailList", async (params: string) => {
        const response = await axios.get(`/api/v1/cocktails/?type=standard&${params}`);
        return response.data
    },
)

export const fetchCustomCocktailList = createAsyncThunk(
    "cocktail/fetchCustomCocktailList", async (params: string) => {
        const response = await axios.get(`/api/v1/cocktails/?type=custom&${params}`);
        return response.data
    },
)

export const fetchMyCocktailList = createAsyncThunk(
    "cocktail/fetchMyCocktailList", async () => {
        const response = await axios.get('/api/v1/cocktails/me');
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

export const postCocktail = createAsyncThunk(
    "cocktail/postCocktail",
    async (cocktail: Omit<CocktailDetailType, "id"|"type"|"created_at"|"updated_at"|"rate">, { dispatch }) => {
        const response = await axios.post<CocktailDetailType>('/api/v1/cocktails/', cocktail);
        dispatch(cocktailActions.addCocktail(response.data));
        return response.data
    }
)

export const cocktailSlice = createSlice({
    name: "cocktail",
    initialState,
    reducers: {
        addCocktail: (state, action: PayloadAction<CocktailDetailType>) => {
            state.cocktailList.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        //CustomCocktailList
        builder.addCase(fetchCustomCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
            state.listStatus = "success";
        });
        builder.addCase(fetchCustomCocktailList.pending, (state, action) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchCustomCocktailList.rejected, (state, action) => {
            state.listStatus = "failed";
        });
        //StandardCocktailList
        builder.addCase(fetchStandardCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
            state.listStatus = "success";
        });
        builder.addCase(fetchStandardCocktailList.pending, (state, action) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchStandardCocktailList.rejected, (state, action) => {
            state.listStatus = "failed";
        });

        //MyCocktailList
        builder.addCase(fetchMyCocktailList.fulfilled, (state, action) => {
            state.cocktailList = action.payload.cocktails;
            state.listStatus = "success";
        });
        builder.addCase(fetchMyCocktailList.pending, (state, action) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchMyCocktailList.rejected, (state, action) => {
            state.listStatus = "failed";
        });

        //CocktailItem
        builder.addCase(getCocktail.fulfilled, (state, action) => {
            state.cocktailItem = action.payload;
            state.itemStatus = "success";
        });
        builder.addCase(getCocktail.pending, (state, action) => {
            state.itemStatus = "loading";
        });
        builder.addCase(getCocktail.rejected, (state, action) => {
            state.itemStatus = "failed";
        });
    },
})
export const cocktailActions = cocktailSlice.actions;
export const selectCocktail = (state: RootState) => state.cocktail;

export default cocktailSlice.reducer;