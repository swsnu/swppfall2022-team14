import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import NavFilter from "./NavFilter";
import { UserInfo } from "../../store/slices/user/user";
import React from 'react';
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
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const renderNavFilter = (type: string) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<NavFilter type={type} />} />
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

describe("<NavFilter />", () => {
    it("should render NavFilter", async () => {
        renderNavFilter("ST");
        const searchBar = screen.getByLabelText("추가 검색어");
        fireEvent.change(searchBar, { target: { value: "COCKTAIL" } });
        expect(searchBar).toHaveDisplayValue("COCKTAIL");
        fireEvent.keyPress(searchBar, { key: "Enter", code: 13, charCode: 13 });
        expect(mockNavigate).toBeCalledWith("/standard", { "state": { "filter_param": { "available_only": false, "type_one": [], "type_three": [], "type_two": [] }, "name_param": "COCKTAIL" } })
    });

    it("should handle click search button_st", async () => {
        renderNavFilter("ST");
        const searchButton = await screen.findByText("검색")
        fireEvent.click(searchButton)
        expect(mockNavigate).toBeCalledWith("/standard", { "state": { "filter_param": { "available_only": false, "type_one": [], "type_three": [], "type_two": [] }, "name_param": "" } })
    });
    it("should handle click search button_cs", async () => {
        renderNavFilter("CS");
        const searchButton = await screen.findByText("검색")
        fireEvent.click(searchButton)
        expect(mockNavigate).toBeCalledWith("/custom", { "state": { "filter_param": { "available_only": false, "type_one": [], "type_three": [], "type_two": [] }, "name_param": "" } })
    });
    it("should handle click search button_ig", async () => {
        renderNavFilter("IG");
        const searchButton = await screen.findByText("검색")
        fireEvent.click(searchButton)
        expect(mockNavigate).toBeCalledWith("/ingredient")
    });
    it("should handle click search button_invalid", async () => {
        renderNavFilter("INVALID");
        const searchButton = await screen.findByText("검색")
        fireEvent.click(searchButton)
    });
    const newLocal = "should render ingredient NavFilter";
    it(newLocal, async () => {
        renderNavFilter("IG");
        await screen.findByText("검색");
        const searchBar = screen.getByLabelText("추가 검색어");
        fireEvent.change(searchBar, { target: { value: "INGREDIENT" } });
        expect(searchBar).toHaveDisplayValue("INGREDIENT");
    });
    it("should be unique when unique type clicked", async () => {
        renderNavFilter("ST");
        const typeButton = screen.getByText("15도 이하");
        fireEvent.click(typeButton);
        fireEvent.click(typeButton);
    });
    it("should be non-unique when non-unique type clicked", async () => {
        renderNavFilter("ST");
        const typeButton1 = screen.getByText("클래식");
        fireEvent.click(typeButton1);
        fireEvent.click(typeButton1);
        const typeButton2 = screen.getByText("롱드링크");
        fireEvent.click(typeButton2);
        fireEvent.click(typeButton2);
    });
    it("should handle theme click", () => {
        renderNavFilter("ST");
        const themebutton1 = screen.getByText("Theme1")
        const themebutton2 = screen.getByText("Theme2")
        fireEvent.click(themebutton1)
        fireEvent.click(themebutton2)
        fireEvent.change(themebutton1, { target: { checked: true } })
    })
    it("should handle available only feature", () => {
        renderNavFilter("ST");
        const availableOnly = screen.getByText("만들 수 있는 칵테일만")
        fireEvent.click(availableOnly)
    })
});