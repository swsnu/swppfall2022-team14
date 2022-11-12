import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { render, RenderOptions } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { AppStore, RootState } from "../store";
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

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
    preloadedState?: PreloadedState<RootState>;
    store?: AppStore;
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState,
        store = getMockStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren): JSX.Element {
        return <Provider store={store}>{children}</Provider>;
    }
  
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}