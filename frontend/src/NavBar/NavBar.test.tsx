import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import NavBar from "./NavBar";
import { Iprops as NavFilterProp } from "./NavFilter/NavFilter";
import { UserInfo } from "../store/slices/user/user";
import React from 'react'

// eslint-disable-next-line react/display-name
jest.mock("./NavFilter/NavFilter", () => (prop: NavFilterProp) => {
    if (prop.type === "IG") {
        return (
            <div data-testid="spyNavFilter">
                <button className="navfilter__btn">검색하기</button>
            </div>
        )
    } else {
        return (
            <div data-testid="spyNavFilter">
                <div className="navfilter_wrap">
                    <div className="navfilter__title">Type 1</div>
                    <div className="navfilter__content">
                        <button>
                            클래식
                        </button>
                    </div>
                </div>
                <button className="navfilter__btn">검색하기</button>
            </div>
        )
    }
});

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

const renderNavBar = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<NavBar />} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: stubCocktailInitialState,
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
                user: stubUserInitialState,
            },
        }
    );
};

describe("<NavBar />", () => {
    it("should render NavBar", async () => {
        renderNavBar();
        await screen.findByText("Standard");
    });
    it("should navigate to /standard with params when search button clickend (standard)", async () => {
        renderNavBar();
        const standardButton = screen.getByText("Standard");
        fireEvent.click(standardButton);
        fireEvent.click(standardButton);
        fireEvent.click(standardButton);
        const typeButton = screen.getByText("클래식")
        fireEvent.click(typeButton);
        const searchButton = screen.getByText("검색하기")
        fireEvent.click(searchButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith({
            pathname: "/standard",
            search: "?filter_type_one=_CL&text=",
        }));
    });
    it("should navigate to /custom with params when search button clickend (custom)", async () => {
        renderNavBar();
        const customButton = screen.getByText("Custom");
        fireEvent.click(customButton);
        fireEvent.click(customButton);
        fireEvent.click(customButton);
        const typeButton = screen.getByText("클래식")
        fireEvent.click(typeButton);
        const searchButton = screen.getByText("검색하기")
        fireEvent.click(searchButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith({
            pathname: "/custom",
            search: "?filter_type_one=_CL&text=",
        }));
    });
    it("should navigate to /ingredient with params when search button clickend (ingredient)", async () => {
        renderNavBar();
        const ingredientButton = screen.getByText("Ingredient");
        fireEvent.click(ingredientButton);
        fireEvent.click(ingredientButton);
        fireEvent.click(ingredientButton);
        const searchButton = screen.getByText("검색하기")
        fireEvent.click(searchButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/ingredient"));
    });
    it("should naviate to /custom/create when upload button clicked", async () => {
        renderNavBar();
        const uploadButton = screen.getByText("Upload");
        fireEvent.click(uploadButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/custom/create"));
    });
    it("should render ingredients when my liquor button clicked", async () => {
        renderNavBar();
        const myLiquorButton = screen.getByText("My Liquor");
        fireEvent.click(myLiquorButton);
        await screen.findByText("ADD");
    });
    it("should naviate to / when home button clicked", async () => {
        renderNavBar();
        const homeButton = screen.getByText("Home");
        fireEvent.click(homeButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    });
    it("should naviate to /mypage when my page button clicked", async () => {
        renderNavBar();
        const myPageButton = screen.getByText("My Page");
        fireEvent.click(myPageButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/mypage"));
    });
});