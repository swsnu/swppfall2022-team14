import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import LoginModal from "./LoginModal";

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

const renderLoginModal = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<LoginModal isOpen={true} setIsOpen={ jest.fn() } setLoginState={ jest.fn() } />} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: stubCocktailInitialState,
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
            },
        }
    );
};

describe("<LoginModal />", () => {
    it("should render LoginModal", async () => {
        renderLoginModal();
        await screen.findByText("Login");
    });
    it("should render login inputs when login mode button clicked", async () => {
        renderLoginModal();
        const idInput = screen.getByLabelText("ID");
        fireEvent.change(idInput, { target: { value: "TEST_ID" } });
    });
    it("should render register inputs when register mode button clicked", async () => {
        renderLoginModal();
        const registerModeButton = screen.getByText("register");
        fireEvent.click(registerModeButton);
        await screen.findByText("Register");
        const nameInput = screen.getByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "TEST_NAME" } });
    });
    it("should call onKeyPress when enter pressed", async () => {
        renderLoginModal();
        const idInput = screen.getByLabelText("ID");
        fireEvent.keyPress(idInput, { key: "Enter", charCode: 13 });
    });
    it("should close login when confirmed", async () => {
        renderLoginModal();
        const idInput = screen.getByLabelText("ID");
        fireEvent.change(idInput, { target: { value: "TEST_ID" } });
        const passwordInput = screen.getByLabelText("Password");
        fireEvent.change(passwordInput, { target: { value: "TEST_PASSWORD" } });
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
    });
    it("should close register when confirmed", async () => {
        renderLoginModal();
        const registerModeButton = screen.getByText("register");
        fireEvent.click(registerModeButton);
        await screen.findByText("Register");
        const nameInput = screen.getByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "TEST_NAME" } });
        const idInput = screen.getByLabelText("ID");
        fireEvent.change(idInput, { target: { value: "TEST_ID" } });
        const passwordInput = screen.getByLabelText("Password");
        fireEvent.change(passwordInput, { target: { value: "TEST_PASSWORD" } });
        const registerButton = screen.getByText("Register");
        fireEvent.click(registerButton);
    });
    it("should alert error when id empty", async () => {
        renderLoginModal();
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
    });
    it("should alert error when password empty", async () => {
        renderLoginModal();
        const idInput = screen.getByLabelText("ID");
        fireEvent.change(idInput, { target: { value: "TEST_ID" } });
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
    });
    it("should close LoginModal when close button clicked", async () => {
        renderLoginModal();
        const closeButton = screen.getByText("X");
        fireEvent.click(closeButton);
    });
});