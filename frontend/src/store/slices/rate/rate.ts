import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "../.."

export interface RateType {
    id: number,
    cocktail_id: number,
    user_id: number,
    score: number
}

export interface RateInfo {
    rate: RateType | null
}

const initialState: RateInfo = {
    rate: null
};

export const postRate = createAsyncThunk(
    "rate/postRate", async (rate: Pick<RateType, "cocktail_id" | "score">, { dispatch }) => {
        const response = await axios.post(`/api/v1/rates/${rate.cocktail_id}/`, { "score": rate.score });
        dispatch(rateActions.addRate(response.data));
    }
)

export const RateSlice = createSlice({
    name: "rate",
    initialState,
    reducers: {
        addRate: (state, action: PayloadAction<RateType>) => {
            state.rate = action.payload;
        },
    },
});

export const rateActions = RateSlice.actions;
export const selectRate = (state: RootState) => state.rate;

export default RateSlice.reducer;