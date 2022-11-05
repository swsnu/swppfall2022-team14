import { configureStore } from "@reduxjs/toolkit";
import cocktailReducer from './slices/cocktail/cocktail'
import commentReducer from './slices/comment/comment'

export const store = configureStore({
    reducer: {
        cocktail: cocktailReducer,
        comment: commentReducer
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;