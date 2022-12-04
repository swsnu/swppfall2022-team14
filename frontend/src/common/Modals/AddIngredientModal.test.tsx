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

const setIsOpen = jest.fn()

// eslint-disable-next-line react/display-name
jest.mock('react-modal', () => (props: { className: any, isOpen: boolean, onRequestClose: any, children: React.ReactNode }) => {

    props.onRequestClose()
    if (props.isOpen) return (<div data-testid={`spyModal_opened`}>{props.children}</div>)
    else return (<div data-testid={`spyModal_closed`}></div>)
})

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

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
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 }
}

const mockLoggedInStore = getMockStore({ cocktail: emptyCocktaiState, ingredient: ingredientState, comment: emptyCommentState, user: loggedInState, rate: rateState });

describe("<AddIngredientModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render modal closed without errors", () => {
        const { container } = render(
            <Provider store={mockLoggedInStore}>
                <AddIngredientModal isOpen={false} setIsOpen={setIsOpen} user_id={4} />
            </Provider>
        );
        expect(setIsOpen).toBeCalledWith(false)
        screen.getByTestId("spyModal_closed");
    });

    it("should render modal opened without errors", () => {
        const { container } = render(
            <Provider store={mockLoggedInStore}>
                <AddIngredientModal isOpen={true} setIsOpen={setIsOpen} user_id={4} />
            </Provider>
        );
        screen.getByTestId("spyModal_opened");
        screen.getByText("Add");
    });

    it("should handle close modal button", () => {
        render(
            <Provider store={mockLoggedInStore}>
                <AddIngredientModal isOpen={true} setIsOpen={setIsOpen} user_id={4} />
            </Provider>
        );
        const button = screen.getByText("X")
        fireEvent.click(button)
        expect(setIsOpen).toBeCalledWith(false)
    });

    it("should handle add ingredient", async () => {
        render(
            <Provider store={mockLoggedInStore}>
                <AddIngredientModal isOpen={true} setIsOpen={setIsOpen} user_id={4} />
            </Provider>
        )
        const button = screen.getByText("INGREDIENT1")
        fireEvent.click(button)
        await waitFor(() => expect(button).toBeDisabled());
    })

})