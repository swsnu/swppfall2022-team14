import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddIngredientModal from "./AddIngredientModal";
import React from 'react';
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import ingredient, { IngredientType, IngredientInfo } from "../../store/slices/ingredient/ingredient";
import { UserInfo } from "../../store/slices/user/user";
import { getMockStore } from "../../test-utils/mock";
import { Provider } from "react-redux";
import { RateInfo } from "../../store/slices/rate/rate";
import { TextFieldProps } from "@mui/material";

const setIsOpen = jest.fn()

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

// eslint-disable-next-line react/display-name
jest.mock("@mui/material/TextField/TextField", () => (props: TextFieldProps) => (
    <input onClick={props.onClick} onChange={props.onChange} data-testid={'search_keyword_input'} />
));

const emptyCocktaiState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const emptyCommentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}
const ingredient1: IngredientType = {
    id: 1,
    name: "INGREDIENT1",
    name_eng: "ENG_INGREDIENT1",
    image: "IMAGE1",
    ABV: 0,
    price: 0,
    introduction: "INTRODUCTION1",
    unit: ["ml", "oz"],
    color: ""
}
const ingredient2: IngredientType = {
    id: 2,
    name: "INGREDIENT2",
    name_eng: "ENG_INGREDIENT1",
    image: "IMAGE2",
    ABV: 0,
    price: 0,
    introduction: "INTRODUCTION1",
    unit: ["ml", "oz"],
    color: ""
}
const ingredientState: IngredientInfo = {
    ingredientList: [ingredient1, ingredient2],
    myIngredientList: [ingredient2],
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

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const mockLoggedInStore = getMockStore({ cocktail: emptyCocktaiState, ingredient: ingredientState, comment: emptyCommentState, user: loggedInState, rate: rateState });

describe("<AddIngredientModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render modal opened without errors", () => {
        const { container } = render(
            <Provider store={mockLoggedInStore}>
                <AddIngredientModal isOpen={true} setIsOpen={setIsOpen} user_id={4} />
            </Provider>
        );
        screen.getByText("추가 검색어");
    });

    it("should handle add ingredient", async () => {
        render(
            <Provider store={mockLoggedInStore}>
                <AddIngredientModal isOpen={true} setIsOpen={setIsOpen} user_id={4} />
            </Provider>
        )
        const button = screen.getByTestId("item_add")
        fireEvent.click(button)
        fireEvent.click(button)
    });

    it("should handle search key word", async () => {
        render(
            <Provider store={mockLoggedInStore}>
                <AddIngredientModal isOpen={true} setIsOpen={setIsOpen} user_id={4} />
            </Provider>
        )
        const element = screen.getByLabelText('추가 검색어');
        fireEvent.change(element, { target: {value: "Ingredient"}})
    })
})