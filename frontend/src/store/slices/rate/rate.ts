import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "../.."

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


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
        dispatch(rateActions.updateRate(response.data));
    }
);

export const editRate = createAsyncThunk(
    "rate/editRate", async (rate: Pick<RateType, "cocktail_id" | "score">, { dispatch }) => {
        const response = await axios.put(`/api/v1/rates/${rate.cocktail_id}/`, { "score": rate.score });
        dispatch(rateActions.updateRate(response.data));
    }
);

export const deleteRate = createAsyncThunk(
    "rate/deleteRate", async (rate: Pick<RateType, "cocktail_id">, { dispatch }) => {
        await axios.delete(`/api/v1/rates/${rate.cocktail_id}/`);
        dispatch(rateActions.deleteRate());
    }
)

export const RateSlice = createSlice({
    name: "rate",
    initialState,
    reducers: {
        updateRate: (state, action: PayloadAction<RateType>) => {
            state.rate = action.payload;
        },
        deleteRate: (state) => {
            state.rate = null;
        }
    },
});

export const rateActions = RateSlice.actions;
export const selectRate = (state: RootState) => state.rate;

export default RateSlice.reducer;