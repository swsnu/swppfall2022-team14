import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
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
}
const initialState: IngredientInfo = {
   ingredientList: [
        {
            id: 1,
            name: 'name',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            introduction: '소개',
            ABV: 42.4,
            price: 200
        }, {
            id: 2,
            name: 'name2',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            introduction: '소개',
            ABV: 42.4,
            price: 400
        }, {
            id: 3,
            name: 'name3',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            introduction: '소개',
            ABV: 42.4,
            price: 6000
        }
    ],
    ingredientItem: {
        id: 1,
        name: 'name',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200
    }
}

export const fetchIngredientList = createAsyncThunk(
    "ingredient/fetchIngredientList/", async () => {
        const response = await axios.get('/api/v1/ingredients/');
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
            state.ingredientList = action.payload;
        });
        builder.addCase(getIngredient.fulfilled, (state, action) => {
            state.ingredientItem = action.payload;
        });
    },
})

export const ingredientActions = ingredientSlice.actions;
export const selectIngredient = (state: RootState) => state.cocktail;

export default ingredientSlice.reducer;
