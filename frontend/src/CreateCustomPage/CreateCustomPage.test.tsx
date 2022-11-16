import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import CreateCustomPage from "./CreateCustomPage";
import { IProps as AddIngredientModalProp } from "./Modals/AddIngredientModal";

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

jest.mock("./Modals/AddIngredientModal", () => (prop: AddIngredientModalProp) => {
    return (
        <button 
            data-testid="spyAddIngredientModal"
            onClick={() => prop.setNewIngrdient(
                {
                    id: 1,
                    name: 'INGREDIENT_NAME_1',
                    image: 'INGREDIENT_IMAGE_1',
                    introduction: 'INGREDIENT_INTRO_1',
                    ABV: 40,
                    price: 200
                }
            )}
        >
            INGREDIENT_1
        </button>
    )
});

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const mockDispatch = () => ({ payload: { id: 1 } });
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
    it("should navigate to /custom/:id when confirm button clicked", async () => {
        renderCreateCustomPage();
        const nameInput = screen.getByLabelText("Name:");
        fireEvent.change(nameInput, { target: { value: "NAME" } });
        const descriptionInput = screen.getByLabelText("Description:");
        fireEvent.change(descriptionInput, { target: { value: "DESCRIPTION" } });
        const ingredientInput = screen.getByTestId("ingredientInput");
        fireEvent.click(ingredientInput);
        const spyAddIngredientModal = screen.getByTestId("spyAddIngredientModal");
        fireEvent.click(spyAddIngredientModal);
        const ingredientAmountInput = screen.getAllByTestId("ingredientAmountInput")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10 oz" } });
        const recipeInput = screen.getByLabelText("Recipe:");
        fireEvent.change(recipeInput, { target: { value: "RECIPE" } });
        const tagInput = screen.getByTestId("tagInput");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        const confirmButton = screen.getByText("Confirm");
        fireEvent.click(confirmButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/custom/1"));
    });
});