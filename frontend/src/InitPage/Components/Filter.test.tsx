import { MemoryRouter, Route, Routes } from "react-router";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import Filter from "./Filter";

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

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderFilter = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<Filter setUrlParams={ jest.fn() }/>} />
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

describe("<Filter />", () => {
    it("should render Filter", async () => {
        renderFilter();
        await screen.findByText("Type 1");
    });
});