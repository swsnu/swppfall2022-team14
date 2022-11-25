import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { CocktailInfo, CocktailItemType } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import { getMockStore } from "../test-utils/mock";
import MyBookmark from "./MyBookmark";
import { UserInfo } from "../store/slices/user/user";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

jest.mock("../common/Components/Item", () => (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => (
    <div data-testid={`spyItem_${prop.id}`}>
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

const cocktaiState: CocktailInfo = {
    cocktailList: [standard_cocktail1_item],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const emptyCommentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}

const emptyingredientState: IngredientInfo = {
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


const mockLoggedInStore = getMockStore({ cocktail: cocktaiState, ingredient: emptyingredientState, comment: emptyCommentState, user: loggedInState });
const mockLoggedOutStore = getMockStore({ cocktail: cocktaiState, ingredient: emptyingredientState, comment: emptyCommentState, user: loggedOutState });

describe("<MyBookMark />", () => {
    it("should render items with logged in without errors", () => {
        render(
            <Provider store={mockLoggedInStore}>
                <MyBookmark />
            </Provider>
        );
        const items = screen.getAllByTestId("spyItem_1");
        expect(items).toHaveLength(1);
        expect(mockDispatch).toBeCalledTimes(1);
    });

    it("should render items with logged out without errors", () => {
        render(
            <Provider store={mockLoggedOutStore}>
                <MyBookmark />
            </Provider>
        );
        const items = screen.getAllByTestId("spyItem_1");
        expect(items).toHaveLength(1);
        expect(mockDispatch).toBeCalledTimes(0);
    });

});