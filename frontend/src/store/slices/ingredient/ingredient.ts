import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { stat } from "fs";
import { RootState } from "../..";

export interface IngredientType {
    id: number,
    name: string,
    image: string,
    ABV: number,
    price: number,
    introduction: string,
}

export interface IngredientInfo {
    ingredientList: IngredientType[],
    ingredientItem: IngredientType | null,
    itemStatus: string,
    listStatus: string
}
const initialState: IngredientInfo = {
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
}

export const fetchIngredientList = createAsyncThunk(
    "ingredient/fetchIngredientList/", async () => {
        const response = await axios.get('/api/v1/ingredients/');
        console.log(response.data)
        return response.data
    },
)


// TODO : ingredients/me/로 받을 수 있게끔 수정
export const fetchMyIngredientList = createAsyncThunk(
    "cocktail/fetchMyIngredientList", async (id: number) => {
        const response = await axios.get(`/api/v1/store/${id}/`);
        console.log(response.data)
        return response.data
    },
)


export const getIngredient = createAsyncThunk(
    "ingredient/getIngredient/",
    async (id: IngredientType["id"], { dispatch }) => {
        const response = await axios.get(`/api/v1/ingredients/${id}/`)
        console.log(response.data)
        return response.data;
    }
)

export const ingredientSlice = createSlice({
    name: "ingredient",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchIngredientList.fulfilled, (state, action) => {
            state.ingredientList = action.payload.Ingredients;
            state.listStatus = "success"
        });
        builder.addCase(fetchIngredientList.pending, (state, action) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchIngredientList.rejected, (state, action) => {
            state.listStatus = "failed";
        });
        builder.addCase(getIngredient.pending, (state, action) => {
            state.itemStatus = "loading"
        });
        builder.addCase(getIngredient.fulfilled, (state, action) => {
            state.ingredientItem = action.payload;
            state.itemStatus = "success"
        });
        builder.addCase(getIngredient.rejected, (state, action) => {
            state.itemStatus = "failed"
        })
        builder.addCase(fetchMyIngredientList.fulfilled, (state, action) => {
            state.ingredientList = action.payload.Ingredients;
            state.listStatus = "success"
        });
        builder.addCase(fetchMyIngredientList.pending, (state, action) => {
            state.listStatus = "loading";
        });
        builder.addCase(fetchMyIngredientList.rejected, (state, action) => {
            state.listStatus = "failed";
        });
    },
})

export const ingredientActions = ingredientSlice.actions;
export const selectIngredient = (state: RootState) => state.ingredient;

export default ingredientSlice.reducer;
