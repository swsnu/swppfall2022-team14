import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import Filter from "./Filter";
import { UserInfo } from "../../store/slices/user/user";
import React from 'react'
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
    ingredientList: [],
    myIngredientList: [],
    recommendIngredientList: [],
    availableCocktails: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};

const stubUserInitialState: UserInfo = {
    user: {
        id: (localStorage.getItem("id") === null) ? null : localStorage.getItem("id"),
        username: (localStorage.getItem("username") === null) ? null : localStorage.getItem("username"),
        password: null,
        nickname: (localStorage.getItem("nickname") === null) ? null : localStorage.getItem("nickname"),
        intro: (localStorage.getItem("intro") === null) ? null : localStorage.getItem("intro"),
        profile_img: (localStorage.getItem("profile_img") === null) ? null : localStorage.getItem("profile_img"),
    },
    token: (localStorage.getItem("token") === null) ? null : localStorage.getItem("token"),
    isLogin: (localStorage.getItem("token") !== null)
}

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderFilter = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<Filter setUrlParams={jest.fn()} onClickSearch={jest.fn()} input="" setInput={jest.fn()} />} />
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

describe("<Filter />", () => {
    it("should render Filter", () => {
        renderFilter();
        screen.findByText("Type 1");
    });
    it("should be unique when unique type clicked", () => {
        renderFilter();
        const typeButton = screen.getByText("15도 이하");
        fireEvent.click(typeButton);
        fireEvent.click(typeButton);
    });
    it("should be non-unique when non-unique type clicked", () => {
        renderFilter();
        const typeButton1 = screen.getByText("클래식");
        fireEvent.click(typeButton1);
        fireEvent.click(typeButton1);
        const typeButton2 = screen.getByText("롱드링크");
        fireEvent.click(typeButton2);
        fireEvent.click(typeButton2);
    });
    it("should handle search word text field", () => {
        renderFilter();
        const searchWordTextField = screen.getByLabelText("추가 검색어");
        fireEvent.change(searchWordTextField, { target: { value: "word" } });
    })
    it("should handle theme click", () => {
        renderFilter();
        const themebutton1 = screen.getByText("여름 느낌의")
        const themebutton2 = screen.getByText("근본이 있는")
        const themebutton3 = screen.getByText("강렬한 한 잔")
        fireEvent.click(themebutton1)
        fireEvent.click(themebutton2)
        fireEvent.click(themebutton3)
        fireEvent.change(themebutton1, { target: { checked: true } })
    })
    it("should handle available only feature", () => {
        renderFilter();
        const availableOnly = screen.getByText("만들 수 있는 칵테일만")
        fireEvent.click(availableOnly)
    })
});