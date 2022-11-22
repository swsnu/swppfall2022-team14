import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import NavFilter from "./NavFilter";

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

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderNavFilter = (type: string) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<NavFilter setUrlParams={jest.fn()} handleSearch={jest.fn()} type={type} />} />
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

describe("<NavFilter />", () => {
    it("should render NavFilter", async () => {
        renderNavFilter("ST");
        const searchBar = screen.getByPlaceholderText("검색어를 입력하세요");
        fireEvent.change(searchBar, { target: { value: "COCKTAIL" } });
        expect(searchBar).toHaveDisplayValue("COCKTAIL");
    });
    it("should render ingredient NavFilter", async () => {
        renderNavFilter("IG");
        await screen.findByText("검색하기");
        const searchBar = screen.getByPlaceholderText("검색어를 입력하세요");
        fireEvent.change(searchBar, { target: { value: "INGREDIENT" } });
        expect(searchBar).toHaveDisplayValue("INGREDIENT");
    });
    it("should be unique when unique type clicked", async () => {
        renderNavFilter("ST");
        const typeButton = screen.getByLabelText("15도 이하");
        fireEvent.click(typeButton);
        fireEvent.click(typeButton);
    });
    it("should be non-unique when non-unique type clicked", async () => {
        renderNavFilter("ST");
        const typeButton1 = screen.getByLabelText("클래식");
        fireEvent.click(typeButton1);
        fireEvent.click(typeButton1);
        const typeButton2 = screen.getByLabelText("롱드링크");
        fireEvent.click(typeButton2);
        fireEvent.click(typeButton2);
    });
});