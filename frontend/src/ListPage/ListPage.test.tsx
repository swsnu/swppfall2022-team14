import { Provider } from "react-redux"
import { CocktailDetailType, CocktailInfo, CocktailItemType } from "../store/slices/cocktail/cocktail"
import { CommentInfo } from "../store/slices/comment/comment"
import { IngredientInfo, IngredientType } from "../store/slices/ingredient/ingredient"
import { getMockStore } from "../test-utils/mock"
import { MemoryRouter, Navigate, Route, Routes } from "react-router";

import ListPage from "./ListPage"
import React from 'react';

import { render, screen, waitFor } from "@testing-library/react"

jest.mock("./Item/Item", () => (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => (
    <div data-testid={`spyComment_${prop.id}`}>
    </div>
));

jest.mock("./Ingr/Ingr", () => (prop: Pick<IngredientType, "image" | "name" | "id">) => (
    <div data-testid={`spyComment_${prop.id}`}>
    </div>
));

jest.mock("../NavBar/NavBar", () => () => (
    <div data-testid={`spyComment_nav_bar`}>
    </div>
));

const standard_cocktail1_item: CocktailItemType = {
    id: 1,
    name: "ST_COCKTAIL1",
    image: "IMAGE1",
    type: "ST",
    tags: [],
    author_id: null,
    rate: 0,
    is_bookmarked: false,
}

const custom_cocktail1_item: CocktailItemType = {
    id: 2,
    name: "CS_COCKTAIL1",
    image: "IMAGE1",
    type: "CS",
    tags: [],
    author_id: 1,
    rate: 0,
    is_bookmarked: false,
}

const stubInitialStandardCocktaiState: CocktailInfo = {
    cocktailList: [standard_cocktail1_item],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const stubInitialCustomCocktaiState: CocktailInfo = {
    cocktailList: [custom_cocktail1_item],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const emptyCommentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}
const ingredient: IngredientType = {
    id: 1,
    name: "INGREDIENT1",
    image: "IMAGE1",
    ABV: 0,
    price: 0,
    introduction: "INTRODUCTION1",
}

const ingredientState: IngredientInfo = {
    ingredientList: [ingredient],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const standardMockStore = getMockStore({ cocktail: stubInitialStandardCocktaiState, ingredient: ingredientState, comment: emptyCommentState });

const customMockStore = getMockStore({ cocktail: stubInitialCustomCocktaiState, ingredient: ingredientState, comment: emptyCommentState });

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => jest.fn()
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => jest.fn()
}));

describe("<ListPage />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render standard cocktail without errors", () => {
        render(
            <Provider store={standardMockStore}>
                <MemoryRouter initialEntries={['/standard']}>
                    <Routes>
                        <Route path="/:type" element={<ListPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);
    });

    it("should render standard cocktail without errors", () => {
        render(
            <Provider store={customMockStore}>
                <MemoryRouter initialEntries={['/custom']}>
                    <Routes>
                        <Route path="/:type" element={<ListPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const items = screen.getAllByTestId("spyComment_2");
        expect(items).toHaveLength(1);
    });

    it("should render ingredients without errors", () => {
        render(
            <Provider store={customMockStore}>
                <MemoryRouter initialEntries={['/ingredient']}>
                    <Routes>
                        <Route path="/:type" element={<ListPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);
    });

    it("should render list when pending axios without errors", () => {
        const stubCocktaiState: CocktailInfo = {
            cocktailList: [standard_cocktail1_item],
            cocktailItem: null,
            itemStatus: "success",
            listStatus: "loading",
        };
        const mockStore = getMockStore({ cocktail: stubCocktaiState, ingredient: ingredientState, comment: emptyCommentState });
        const { container } = render(
            <Provider store={mockStore}>
                <MemoryRouter initialEntries={['/standard']}>
                    <Routes>
                        <Route path="/:type" element={<ListPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        expect(container).toBeTruthy();
    });

    it("should render list when failed axios without errors", () => {
        const stubCocktaiState: CocktailInfo = {
            cocktailList: [standard_cocktail1_item],
            cocktailItem: null,
            itemStatus: "success",
            listStatus: "failed",
        };
        const mockStore = getMockStore({ cocktail: stubCocktaiState, ingredient: ingredientState, comment: emptyCommentState });
        const { container } = render(
            <Provider store={mockStore}>
                <MemoryRouter initialEntries={['/standard']}>
                    <Routes>
                        <Route path="/:type" element={<ListPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        expect(container).toBeTruthy();
    });
})