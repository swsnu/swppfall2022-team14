import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import InitMyLiqourModal from "./InitMyLiquorModal";
import {UserInfo} from "../../store/slices/user/user";
import React from 'react'

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
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};

const stubUserInitialState: UserInfo = {
    user: {
        id: (localStorage.getItem("id") === null) ? null : localStorage.getItem("id"),
        username:  (localStorage.getItem("username") === null) ? null : localStorage.getItem("username"),
        password:  null,
        nickname:  (localStorage.getItem("nickname") === null) ? null : localStorage.getItem("nickname"),
        intro:  (localStorage.getItem("intro") === null) ? null : localStorage.getItem("intro"),
        profile_img:  (localStorage.getItem("profile_img") === null) ? null : localStorage.getItem("profile_img"),
    },
    token: (localStorage.getItem("token") === null) ? null : localStorage.getItem("token"),
    isLogin: (localStorage.getItem("token") !== null)
}

// eslint-disable-next-line react/display-name
jest.mock("react-modal", () => (props: {className: any, isOpen: boolean, onRequestClose: any, children: React.ReactNode}) => {
    props.onRequestClose()
    if (props.isOpen) return (
        <div data-testid={"spyModal_opened"}>
            {props.children}
        </div>
    )
    else return <div data-testid={"spyModal_closed"} />
});

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderInitMyLiqourModal = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<InitMyLiqourModal isOpen={true} setIsOpen={ jest.fn() }/>} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: stubCocktailInitialState,
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
                user: stubUserInitialState
            },
        }
    );
};

describe("<InitMyLiquorModal />", () => {
    it("should render InitMyLiquorModal", async () => {
        renderInitMyLiqourModal();
        await screen.findByText("내 술 목록");
    });
    it("should close InitMyLiquorModal when close button clicked", async () => {
        renderInitMyLiqourModal();
        const closeButton = screen.getByText("X");
        fireEvent.click(closeButton);
    });
});