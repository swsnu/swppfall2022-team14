import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Item from "./Item";
import React from 'react';
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import { RateInfo } from "../../store/slices/rate/rate";
import { UserInfo } from "../../store/slices/user/user";
import { getMockStore } from "../../test-utils/mock";
import { Provider } from "react-redux";

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
const mockLoggedoutStore = getMockStore({ cocktail: emptyCocktaiState, ingredient: ingredientState, comment: emptyCommentState, user: {...loggedInState, token:null}, rate: rateState });

describe("<Item />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render cocktail without errors", () => {
        render(
            <Provider store={mockLoggedInStore}>
                <Item image="IMAGE1" name="ST_COCKTAIL" rate={0} id={1} type="ST" tags={["TAG1"]} is_bookmarked={true} ABV={10} price_per_glass={10} />
            </Provider>
        );
        screen.getByText("ST_COCKTAIL");
        screen.getByText("#TAG1");
    });

    it("should handle click standard item", async () => {
        const { container } = render(        
        <Provider store={mockLoggedInStore}>
            <Item image="IMAGE1" name="ST_COCKTAIL" rate={0} id={1} type="ST" tags={[]} is_bookmarked={true} ABV={10} price_per_glass={10} />
        </Provider>
        );
        const element = screen.getByTestId("item")
        fireEvent.click(element)
        await waitFor(() => {expect(mockNavigate).toBeCalledWith("/standard/1")});
    });

    it("should handle click custom item", async () => {
        const { container } = render(        
        <Provider store={mockLoggedInStore}>
            <Item image="IMAGE1" name="CS_COCKTAIL" rate={0} id={2} type="CS" tags={[]} is_bookmarked={true} ABV={10} price_per_glass={10} />
        </Provider>
        );
        const element = screen.getByTestId("item")
        fireEvent.click(element)
        await waitFor(() => {expect(mockNavigate).toBeCalledWith("/custom/2")});
    });

    it("should handle toggle bookmark", async () => {
        const { container } = render(        
        <Provider store={mockLoggedInStore}>
            <Item image="IMAGE1" name="CS_COCKTAIL" rate={0} id={2} type="CS" tags={[]} is_bookmarked={true} ABV={10} price_per_glass={10} />
        </Provider>
        );
        const element = screen.getByTestId("checkbox")
        fireEvent.click(element)
        await waitFor(() => {expect(mockDispatch).toBeCalledTimes(1)});
    });

    it("should handle not toggle bookmark with not logged in", async () => {
        const { container } = render(        
        <Provider store={mockLoggedoutStore}>
            <Item image="IMAGE1" name="CS_COCKTAIL" rate={0} id={2} type="CS" tags={[]} is_bookmarked={true} ABV={10} price_per_glass={10} />
        </Provider>
        );
        const element = screen.getByTestId("checkbox")
        fireEvent.click(element)
        await waitFor(() => {expect(mockDispatch).not.toBeCalledTimes(1)});
    });
})