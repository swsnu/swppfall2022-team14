import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { CocktailInfo, CocktailItemType } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import { getMockStore } from "../test-utils/mock";
import MyCustomCocktail from "./MyCustomCocktail";
import { UserInfo } from "../store/slices/user/user";
import { RateInfo } from "../store/slices/rate/rate";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

// eslint-disable-next-line react/display-name
jest.mock("../common/Components/Item", () => (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => (
    <div data-testid={`spyCocktail_${prop.id}`}>
    </div>
));

const custom_cocktail1_item: CocktailItemType = {
    id: 2,
    name: "CS_COCKTAIL1",
    image: "IMAGE1",
    type: "CS",
    tags: [],
    author_id: 1,
    rate: 0,
    is_bookmarked: false,
    ABV: 10,
    price_per_glass: 10,
}

const cocktaiState: CocktailInfo = {
    cocktailList: [custom_cocktail1_item],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const commentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}

const ingredientState: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "success",
    listStatus: "success",
    recommendIngredientList: [],
    availableCocktails: []
}


const loggedInState: UserInfo = {
    user: {
        id: "1",
        username: "USERNAME",
        password: null,
        nickname: null,
        intro: null,
        profile_img: null,
    },
    token: "TOKEN",
    isLogin: true
}


const loggedOutState: UserInfo = {
    user: null,
    token: null,
    isLogin: false
}
const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}
const loadingCocktaiState: CocktailInfo = {
    cocktailList: [custom_cocktail1_item],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading",
}

const mockLoggedInStore = getMockStore({ cocktail: cocktaiState, ingredient: ingredientState, comment: commentState, user: loggedInState, rate: rateState });
const mockLoggedOutStore = getMockStore({ cocktail: cocktaiState, ingredient: ingredientState, comment: commentState, user: loggedOutState, rate: rateState });
const mockLoadingStore = getMockStore({ cocktail: loadingCocktaiState, ingredient: ingredientState, comment: commentState, user: loggedOutState, rate: rateState });


describe("<MyCustomCocktail />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render custom cocktail with logged in without errors", () => {
        render(
            <Provider store={mockLoggedInStore}>
                <MyCustomCocktail />
            </Provider>
        );
        expect(mockDispatch).toBeCalledTimes(1)
        screen.getByTestId("spyCocktail_2")
    });

    it("should render custom cocktail with logged out without errors", async () => {
        render(
            <Provider store={mockLoggedOutStore}>
                <MyCustomCocktail />
            </Provider>
        );
        screen.getByTestId("spyCocktail_2");
    });
    it("should not render items if loading state", async () => {
        render(
            <Provider store={mockLoadingStore}>
                <MyCustomCocktail />
            </Provider>
        );
        const item = screen.queryByTestId("spyCocktail_2");
        expect(item).toBeNull()
    });
})