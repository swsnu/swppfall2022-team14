import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import EditCustomPage from "./EditCustomPage";

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

const stubCocktailInitialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: {
        id: 2,
        name: "COCKTAIL_NAME_2",
        image: "COCKTAIL_IMAGE_2",
        introduction: "COCKTAIL_INTRO_2",
        recipe: "COCKTAIL_RECIPE_2",
        ABV: 40,
        price_per_glass: 20,
        tags: ["TAG_1"],
        type: "CS",
        author_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        rate: 3,
        ingredients: [
            { ...stubIngredientInitialState.ingredientList[0], amount: "1 oz" },
            { ...stubIngredientInitialState.ingredientList[1], amount: "5 oz" },
        ]
    },
    itemStatus: "success",
    listStatus: "success",
};

jest.mock('react-router', () => ({
    useParams: jest.fn().mockReturnValue({ id: "2" }),
}));

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

const renderEditCustomPage = (isStandard: Boolean=true) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<EditCustomPage />} />
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

describe("<EditCustomPage />", () => {
    it("should render EditCustomPage", async () => {
        renderEditCustomPage();
        await screen.findByText("Confirm");
    });
});