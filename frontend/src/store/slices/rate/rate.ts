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

export const RateSlice = createSlice({
    name: "rate",
    initialState,
    reducers: {},
});

export const rateActions = RateSlice.actions;
export const selectRate = (state: RootState) => state.rate;

export default RateSlice.reducer;