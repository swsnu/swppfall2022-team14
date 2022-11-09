import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../store";
import cocktailReducer from "../store/slices/cocktail/cocktail";
import commentReducer from "../store/slices/comment/comment";
import IngredientReducer from "../store/slices/ingredient/ingredient"

export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
    reducer: { 
        cocktail: cocktailReducer,
        comment: commentReducer,
        ingredient: IngredientReducer,
    },
        preloadedState,
    });
};