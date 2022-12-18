import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import React from 'react';
import { getMockStore } from "../test-utils/mock";
import { Provider } from "react-redux";
import { CommentInfo, CommentType } from "../store/slices/comment/comment";
import {
    CocktailDetailType,
    CocktailInfo,
} from "../store/slices/cocktail/cocktail";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import MainPage from "./MainPage";
import { UserInfo } from "../store/slices/user/user";
import { RateInfo } from "../store/slices/rate/rate";

const fakeCocktailItemCS: CocktailDetailType = {
    id: 1,
    name: "name",
    image: "img",
    type: "CS",
    tags: ["CS1", "CS2"],
    author_id: 1,
    author_name: "username",
    rate: 1,
    introduction: "intro",
    recipe: "recipe",
    ABV: 1,
    price_per_glass: 1,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    ingredients: [{
        id: 1,
        name: "iname",
        name_eng: "ENG_INGREDIENT1",
        image: "iimg",
        ABV: 1,
        price: 1,
        introduction: "iintro",
        unit: ['oz', 'ml'],
        amount: "10",
        color: "",
        recipe_unit: ""
    }],
    is_bookmarked: false,
    score: 1,
    name_eng: "",
    color: "",
    filter_type_one: "",
    filter_type_two: "",
};

const fakeCustomCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: fakeCocktailItemCS,
    itemStatus: "",
    listStatus: ""
};

const emptyIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
};

const commentNotParent: CommentType = {
    id: 1,
    cocktail: {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1", "CS2"],
        author_id: 1,
        rate: 1,
        is_bookmarked: false,
        ABV: 10,
        price_per_glass: 10,
    },
    author_id: 1,
    author_name: "username",
    content: "content1",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: 1, // if null comment is root comment
    is_deleted: false,
};

const emptyComment: CommentInfo = {
    commentList: [commentNotParent],
    commentItem: null,
    state: "EDIT"
};

const stubUserInitialState: UserInfo = {
    user: {
        id: "1",
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

const mockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState });

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

describe("<MainPage />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/*" element={<MainPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    it("should occur resize event when resize", () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/*" element={<MainPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        global.innerWidth = 1000;
        global.dispatchEvent(new Event('resize'));

        global.innerWidth = 800;
        global.dispatchEvent(new Event('resize'));
    });
    it("should close nav bar when click", () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/*" element={<MainPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        global.innerWidth = 800;
        const mainBox = screen.getByTestId("main");
        fireEvent.click(mainBox);

        global.innerWidth = 1000;
        fireEvent.click(mainBox);
    });
    it("should open & close nav bar when click open & close button", () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/*" element={<MainPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        global.innerWidth = 1000;

        const closeButton = screen.getByTestId("close-button");
        fireEvent.click(closeButton);
        const openButton = screen.getByTestId("open-button");
        fireEvent.click(openButton);
    });
})