import { Provider } from "react-redux"
import { CocktailDetailType, CocktailInfo, CocktailItemType } from "../store/slices/cocktail/cocktail"
import { CommentInfo } from "../store/slices/comment/comment"
import { IngredientInfo } from "../store/slices/ingredient/ingredient"
import { getMockStore } from "../test-utils/mock"
import ListPage from "./ListPage"
import React from 'react';
import { render } from "@testing-library/react"
const standard_cocktail1_item: CocktailItemType = {
    id: 1,
    name: "ST_COCKTAIL1",
    image: "IMAGE1",
    type: "ST",
    tags: [],
    author_id: null,
    rate: 0
}

const standard_cocktail1_detail: CocktailDetailType = {
    ...standard_cocktail1_item,
    introduction: "INTRO1",
    recipe: "RECIPE1",
    ABV: 10,
    price_per_glass: 80000,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    ingredients: []
}

const custom_cocktail1_item: CocktailItemType = {
    id: 1,
    name: "CS_COCKTAIL1",
    image: "IMAGE1",
    type: "CS",
    tags: [],
    author_id: 1,
    rate: 0
}

const custom_cocktail1_detail: CocktailDetailType = {
    ...custom_cocktail1_item,
    introduction: "INTRO2",
    recipe: "RECIPE2",
    ABV: 10,
    price_per_glass: 80000,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    ingredients: []
}

const stubInitialCocktaiState: CocktailInfo = {
    cocktailList: [ standard_cocktail1_item, custom_cocktail1_item ],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const emptyCommentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}

const emptyIngredientState: IngredientInfo = {
    ingredientList: [],
    ingredientItem: null,
    itemStatus: "success",
    listStatus: "success",
}

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom")
}))
const mockStore = getMockStore({cocktail: stubInitialCocktaiState, ingredient: emptyIngredientState, comment: emptyCommentState})

const listPage: JSX.Element = ( 
    <Provider store={mockStore}>
        <ListPage/>
    </Provider>
)
describe("<ListPage />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    it("should render without errors", () => {
        const { container } = render(listPage);
        expect(container).toBeTruthy();
    })
})