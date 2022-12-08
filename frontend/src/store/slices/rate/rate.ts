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

export interface PostRateType {
    id: number,
    cocktail_id: number,
    user_id: number,
    score: number,
    token: string | null
}

export interface RateInfo {
    rate: RateType | null,
    myRate: number | null
}

const initialState: RateInfo = {
    rate: null,
    myRate: null
};

export const getMyRate = createAsyncThunk(
    "rate/postRate", async (rate: Pick<PostRateType, "cocktail_id" | "token">, { dispatch }) => {
        const response = await axios.get(`/api/v1/rates/${rate.cocktail_id}/user/`, {
            headers: {
                Authorization: `Token ${rate.token}`,
            },
        });
        console.log(response.data)
        dispatch(rateActions.updateMyRate(response.data))
    }
);

export const postRate = createAsyncThunk(
    "rate/postRate", async (rate: Pick<PostRateType, "cocktail_id" | "score" | "token">, { dispatch }) => {
        const response = await axios.post(`/api/v1/rates/${rate.cocktail_id}/user/`, { "score": rate.score },{
            headers: {
                Authorization: `Token ${rate.token}`,
            },
        });
        dispatch(rateActions.updateRate(response.data));
    }
);

export const editRate = createAsyncThunk(
    "rate/editRate", async (rate: Pick<PostRateType, "cocktail_id" | "score" | "token">, { dispatch }) => {
        const response = await axios.put(`/api/v1/rates/${rate.cocktail_id}/user/`, { "score": rate.score },{
            headers: {
                Authorization: `Token ${rate.token}`,
            },
        });
        dispatch(rateActions.updateRate(response.data));
    }
);

export const deleteRate = createAsyncThunk(
    "rate/deleteRate", async (rate: Pick<PostRateType, "cocktail_id" | "token">, { dispatch }) => {
        await axios.delete(`/api/v1/rates/${rate.cocktail_id}/user/`,{
            headers: {
                Authorization: `Token ${rate.token}`,
            },
        });
        dispatch(rateActions.deleteRate());
    }
)

export const updateRate = createAsyncThunk(
    "cocktail/updateRate", async (cocktail_id: number) => {
        const rate_response = await axios.get(`/api/v1/rates/${cocktail_id}/`);
        return rate_response.data.score
    }
);

export const RateSlice = createSlice({
    name: "rate",
    initialState,
    reducers: {
        updateRate: (state, action: PayloadAction<RateType>) => {
            state.rate = action.payload;
            state.myRate = action.payload.score;
        },
        updateMyRate: (state, action: PayloadAction<RateType>) => {
            if(action.payload === null){
                state.myRate = action.payload;
            }
            else{
                state.myRate = Number(action.payload);
            }
        },
        deleteRate: (state) => {
            state.myRate = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateRate.fulfilled, (state, action) => {
            if(action.payload === null){
                state.rate = 0;
            }
            else{
                state.rate = Number(action.payload);
            }
        });
    }
});

export const rateActions = RateSlice.actions;
export const selectRate = (state: RootState) => state.rate;

export default RateSlice.reducer;