import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import IngredientItem from "./IngredientItem";
import { getMockStore } from "../../test-utils/mock";
import React from 'react';
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import { UserInfo } from "../../store/slices/user/user";
import { CommentInfo } from "../../store/slices/comment/comment";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { RateInfo } from "../../store/slices/rate/rate";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

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
const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}
const mockLoggedInStore = getMockStore({ cocktail: emptyCocktaiState, ingredient: ingredientState, comment: emptyCommentState, user: loggedInState, rate: rateState });

describe("<IngredientItem />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render my ingredient without errors", () => {
        render(
            <Provider store={mockLoggedInStore}>
                <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1} user_id={1} my_item={true} />
            </Provider>
        );
    });

    it("should render not in my ingredient without errors", () => {
        render(
            <Provider store={mockLoggedInStore}>
                <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1} user_id={1} my_item={false} />
            </Provider>
        );
        const element = screen.queryByText("X")
        expect(element).toBeNull()
    });

    it("should handle click item", async () => {
        const { container } = render(
            <Provider store={mockLoggedInStore}>
                <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1} user_id={1} my_item={true} />
            </Provider>
        );
        const element = screen.getByTestId("item")
        fireEvent.click(element)
        await waitFor(() => { expect(mockNavigate).toBeCalledWith("/ingredient/1") })
    })

    it("should handle delete my item", async () => {
        render(
            <Provider store={mockLoggedInStore}>
                <IngredientItem image="IMAGE1" name="INGREDIENT1" ABV={10} id={1} user_id={1} my_item={true} />
            </Provider>
        );
        const element = screen.getByTestId("delete")
        fireEvent.click(element)

        await waitFor(() => { expect(mockDispatch).toBeCalled() })
    })
})