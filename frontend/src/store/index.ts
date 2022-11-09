import { configureStore } from "@reduxjs/toolkit";
import cocktailReducer from './slices/cocktail/cocktail'
import commentReducer from './slices/comment/comment'
import ingredientReducer from './slices/ingredient/ingredient'

export const store = configureStore({
    reducer: {
        cocktail: cocktailReducer,
        comment: commentReducer,
        ingredient: ingredientReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;