import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import CreateCustomPage from "./CreateCustomPage";

const stubCocktailInitialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};

const stubCommentInitialState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
};

const stubIngredientInitialState: IngredientInfo = {
    ingredientList: [
        {
            id: 1,
            name: 'INGREDIENT_NAME_1',
            image: 'INGREDIENT_IMAGE_1',
            introduction: 'INGREDIENT_INTRO_1',
            ABV: 40,
            price: 200
        },
        {
            id: 2,
            name: 'INGREDIENT_NAME_2',
            image: 'INGREDIENT_IMAGE_2',
            introduction: 'INGREDIENT_INTRO_2',
            ABV: 20,
            price: 100
        },
    ],
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

const renderCreateCustomPage = (isStandard: Boolean=true) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<CreateCustomPage />} />
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

describe("<CreateCustomPage />", () => {
    it("should render CreateCustomPage", async () => {
        renderCreateCustomPage();
        await screen.findByText("Confirm");
    });
});