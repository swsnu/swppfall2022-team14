import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import NavBar from "./NavBar";

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
            },
        }
    );
};

describe("<NavBar />", () => {
    it("should render NavBar", async () => {
        renderNavBar();
        await screen.findByText("Standard");
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