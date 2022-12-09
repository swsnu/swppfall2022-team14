import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import LoginModal from "./LoginModal";
import React from 'react'
import { UserInfo } from "../../store/slices/user/user";
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

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const stubUserInitialState: UserInfo = {
    user: null,
    token: "TEST_TOKEN",
    isLogin: false
};

// eslint-disable-next-line react/display-name
jest.mock("react-modal", () => (props: { className: any, isOpen: boolean, onRequestClose: any, children: React.ReactNode }) => {

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

jest.spyOn(window, 'alert').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

const renderLoginModal = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<LoginModal isOpen={true} setIsOpen={jest.fn()} />} />

            </Routes >
        </MemoryRouter >,
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

describe("<LoginModal />", () => {
    it("should render LoginModal", async () => {
        renderLoginModal();
        await screen.findByText("로그인");
    });
    it("should render login inputs when login mode button clicked", async () => {
        renderLoginModal();
        const idInput = screen.getByLabelText("아이디");
        fireEvent.change(idInput, { target: { value: "TEST_ID" } });
    });
    it("should render register inputs when register mode button clicked", async () => {
        renderLoginModal();
        const registerModeButton = screen.getByText("회원가입하러 가기");
        fireEvent.click(registerModeButton);
        await screen.findByText("회원가입");
    });
    it("should call onKeyPress when enter pressed", async () => {
        renderLoginModal();
        const idInput = screen.getByLabelText("아이디");
        fireEvent.keyPress(idInput, { key: "Enter", charCode: 13 });
        fireEvent.keyPress(idInput, { key: "A", charCode: 65 });
    });
    it("should close login when confirmed", async () => {
        mockDispatch.mockReturnValueOnce({ type: "user/loginUser/fulfilled" });
        renderLoginModal();
        const idInput = screen.getByLabelText("아이디");
        fireEvent.change(idInput, { target: { value: "TEST_IDID" } });
        const passwordInput = screen.getByLabelText("비밀번호");
        fireEvent.change(passwordInput, { target: { value: "TEST_PASSWORD" } });
        const loginButton = screen.getByText("로그인");
        fireEvent.click(loginButton);
    });
    it("should close register when confirmed", async () => {
        mockDispatch.mockReturnValueOnce({ type: "user/registerUser/fulfilled" });
        renderLoginModal();
        const registerModeButton = screen.getByText("회원가입하러 가기");
        fireEvent.click(registerModeButton);
        await screen.findByText("회원가입");
        const idInput = screen.getByLabelText("아이디");
        fireEvent.change(idInput, { target: { value: "test_idid" } });
        const passwordInput = screen.getByLabelText("비밀번호");
        fireEvent.change(passwordInput, { target: { value: "testpassw1234" } });
        const registerButton = screen.getByText("회원가입");
        fireEvent.click(registerButton);
    });
    it("should not login when id or password empty", async () => {
        renderLoginModal();
        const idInput = screen.getByLabelText("아이디");
        fireEvent.change(idInput, { target: { value: "test_idid" } });
    });
    it("should not register when id wrong", async () => {
        renderLoginModal();
        const registerModeButton = screen.getByText("회원가입하러 가기");
        fireEvent.click(registerModeButton);
        await screen.findByText("회원가입");
        const idInput = screen.getByLabelText("아이디");
        fireEvent.change(idInput, { target: { value: "test_idididididididididid" } });
        const registerButton = screen.getByText("회원가입");
        fireEvent.click(registerButton);
    });
    it("should not register when password wrong", async () => {
        renderLoginModal();
        const registerModeButton = screen.getByText("회원가입하러 가기");
        fireEvent.click(registerModeButton);
        await screen.findByText("회원가입");
        const idInput = screen.getByLabelText("아이디");
        fireEvent.change(idInput, { target: { value: "test_idid" } });
        const pwInput = screen.getByLabelText("비밀번호");
        fireEvent.change(pwInput, { target: { value: "test_pw" } });
        const registerButton = screen.getByText("회원가입");
        fireEvent.click(registerButton);
    });
    it("should fail login when id or password wrong", async () => {
        mockDispatch.mockReturnValueOnce({ type: "user/loginUser/rejected" });
        renderLoginModal();
        const idInput = screen.getByLabelText("아이디");
        fireEvent.change(idInput, { target: { value: "WRONG_ID" } });
        const pwInput = screen.getByLabelText("비밀번호");
        fireEvent.change(pwInput, { target: { value: "WRONG_PW" } });
        const loginButton = screen.getByText("로그인");
        fireEvent.click(loginButton);
        await screen.findByText("아이디 또는 비밀번호가 일치하지 않습니다.");
    });
    it("should fail register when id or password wrong", async () => {
        mockDispatch.mockReturnValueOnce({ type: "user/registerUser/rejected" });
        renderLoginModal();
        const registerModeButton = screen.getByText("회원가입하러 가기");
        fireEvent.click(registerModeButton);
        await screen.findByText("회원가입");
        const idInput = screen.getByLabelText("아이디");
        fireEvent.change(idInput, { target: { value: "test_idid" } });
        const passwordInput = screen.getByLabelText("비밀번호");
        fireEvent.change(passwordInput, { target: { value: "testpassw1234" } });
        const registerButton = screen.getByText("회원가입");
        fireEvent.click(registerButton);
    });
    it("should close LoginModal when escape clicked", async () => {
        renderLoginModal();
        const idInput = screen.getByLabelText("아이디");
        fireEvent.keyPress(idInput, { 
            key: "Escape",
            code: "Escape",
            keyCode: 27,
            charCode: 27 
        });
    });
});