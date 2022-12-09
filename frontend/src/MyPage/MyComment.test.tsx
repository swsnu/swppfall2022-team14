import React from "react"
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { CocktailInfo, CocktailItemType } from "../store/slices/cocktail/cocktail";
import { CommentInfo, CommentType } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import { getMockStore } from "../test-utils/mock";
import MyComment from "./MyComment";
import { UserInfo } from "../store/slices/user/user";
import { RateInfo } from "../store/slices/rate/rate";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

// eslint-disable-next-line react/display-name
jest.mock("./Components/ShortComment", () => (prop: CommentType) => (
    <div data-testid={`spyComment_${prop.id}`}>
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

const comment: CommentType = {
    id: 1,
    cocktail: standard_cocktail1_item,
    author_id: 1,
    author_name: "username",
    content: "COMMENT1",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: null,
    is_deleted: false
}

const cocktaiState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const commentState: CommentInfo = {
    commentList: [comment],
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
const mockStore = getMockStore({ cocktail: cocktaiState, ingredient: ingredientState, comment: commentState, user: stubUserInitialState, rate: rateState });
const notLoggedInmockStore = getMockStore({ cocktail: cocktaiState, ingredient: ingredientState, comment: commentState, user: {...stubUserInitialState, token:null, isLogin:false}, rate: rateState });


describe("<MyComment />", () => {
    it("should render comments without errors", () => {
        render(
            <Provider store={mockStore}>
                <MyComment />
            </Provider>
        );
        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);
        expect(mockDispatch).toBeCalledTimes(1)
    });
    it("should not render comments without log in", () => {
        render(
            <Provider store={notLoggedInmockStore}>
                <MyComment />
            </Provider>
        );
        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);
        expect(mockDispatch).toBeCalledTimes(0)
    });
});