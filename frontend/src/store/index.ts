import { configureStore } from "@reduxjs/toolkit";
import cocktailReducer from './slices/cocktail/cocktail';
import commentReducer from './slices/comment/comment';
import ingredientReducer from './slices/ingredient/ingredient';
import userReducer from "./slices/user/user";
import rateReducer from "./slices/rate/rate";

export const store = configureStore({
    reducer: {
        cocktail: cocktailReducer,
        comment: commentReducer,
        ingredient: ingredientReducer,
        user: userReducer,
        rate: rateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;