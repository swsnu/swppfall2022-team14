import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import AddIngredientModal from "./AddIngredientModal";
import React from 'react';
import { UserInfo } from "../../store/slices/user/user";
import { RateInfo } from "../../store/slices/rate/rate";

const stubCocktailInitialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading",
}

const stubCommentInitialState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
};

const stubIngredientInitialState: IngredientInfo = {
    ingredientList: [
        {
            id: 1,
            name: 'INGREDIENT_NAME_1',
            name_eng: "ENG_INGREDIENT1",
            image: 'INGREDIENT_IMAGE_1',
            introduction: 'INGREDIENT_INTRO_1',
            ABV: 40,
            price: 200,
            unit: ['oz', 'ml'], color: ""
        },
        {
            id: 2,
            name: 'INGREDIENT_NAME_2',
            name_eng: "ENG_INGREDIENT2",
            image: 'INGREDIENT_IMAGE_2',
            introduction: 'INGREDIENT_INTRO_2',
            ABV: 20,
            price: 100,
            unit: ['oz'], color: ""
        },
    ],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
};

const stubUserInitialState: UserInfo = {
    user: {
        id: "TEST_ID",
        username: "TEST_USERNAME",
        password: "TEST_PASSWORD",
        nickname: "TEST_NICKNAME",
        intro: "TEST_INTRO",
        profile_img: "TEST_PROFILE_IMG",
    },
    token: "TEST_TOKEN",
    isLogin: true
};

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderAddIngredientModal = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<AddIngredientModal isOpen={true} close={jest.fn()} addedIngredientList={[]} setNewIngrdient={jest.fn()} />} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: stubCocktailInitialState,
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
                user: stubUserInitialState,
                rate: rateState
            },
        }
    );
};

describe("<AddIngredientModal />", () => {
    it("should render LoginModal", async () => {
        renderAddIngredientModal();
        await screen.findByText("INGREDIENT_NAME_1");
    });
    it("should close modal when ingredient clicked", async () => {
        renderAddIngredientModal();
        const ingredientButton = screen.getAllByTestId("ingredient")[0];
        fireEvent.click(ingredientButton);
    });
});