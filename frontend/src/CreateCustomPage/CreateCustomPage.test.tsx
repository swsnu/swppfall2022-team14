import React from 'react';
import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import CreateCustomPage from "./CreateCustomPage";
import { IProps as AddIngredientModalProp } from "./Modals/AddIngredientModal";
import { UserInfo } from "../store/slices/user/user";
import { RateInfo } from '../store/slices/rate/rate';

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
            price: 200,
            unit: ['oz', 'ml'], color: ""
        },
        {
            id: 2,
            name: 'INGREDIENT_NAME_2',
            image: 'INGREDIENT_IMAGE_2',
            introduction: 'INGREDIENT_INTRO_2',
            ABV: 20,
            price: 100,
            unit: ['oz'], color: ""
        },
    ],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
};

const stubUserInitialState: UserInfo = {
    user: {
        id: "TEST_ID",
        username: "TEST_USERNAME",
        password: "TEST_PASSWORD",
        nickname: "TEST_NICKNAME",
        intro: "TEST_INTRO",
        profile_img: "TEST_PROFILE_IMG",
    },
    token: "TEST_TOKEN",
    isLogin: true
};

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

// eslint-disable-next-line react/display-name
jest.mock("./Modals/AddIngredientModal", () => (prop: AddIngredientModalProp) => {
    return (
        <div>
            {stubIngredientInitialState.ingredientList.map((ingredient, idx) => {
                return (
                    <button
                        key={`${ingredient.name}_${idx}`}
                        data-testid="addIngredientButton"
                        onClick={() => {
                            prop.setNewIngrdient(ingredient);
                            prop.close();
                        }}
                    >
                        INGREDIENT_{idx + 1}
                    </button>
                )
            })}
            <button
                data-testid="closeAddIngredientModalButton"
                onClick={prop.close}
            >
                Close
            </button>
        </div>

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

const renderCreateCustomPage = (isLogin: boolean = true, isUserNull: boolean = false) => {
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
                user: (
                    isUserNull ?
                        { ...stubUserInitialState, user: null, token: null } :
                        { ...stubUserInitialState, isLogin: isLogin }
                ),
                rate: rateState

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
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientAmountInput = screen.getAllByTestId("ingredientAmountInput")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const recipeInput = screen.getByLabelText("Recipe:");
        fireEvent.change(recipeInput, { target: { value: "RECIPE" } });
        const tagInput = screen.getByTestId("tagInput");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        const confirmButton = screen.getByText("Confirm");
        fireEvent.click(confirmButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/custom/1"));
    });
    it("should delete ingredient when ingredient delete button clicked", async () => {
        renderCreateCustomPage();
        const ingredientInput = screen.getByTestId("ingredientInput");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientDeleteButton = screen.getByTestId("ingredientDeleteButton");
        fireEvent.click(ingredientDeleteButton);
    });
    it("should operate onChangeAmount correctly", async () => {
        renderCreateCustomPage();
        const ingredientInput = screen.getByTestId("ingredientInput");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientAmountInput = screen.getAllByTestId("ingredientAmountInput")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const addIngredientButton2 = screen.getAllByTestId("addIngredientButton")[1];
        fireEvent.click(addIngredientButton2);
        const ingredientAmountInput2 = screen.getAllByTestId("ingredientAmountInput")[1];
        fireEvent.change(ingredientAmountInput2, { target: { value: "5" } });
        fireEvent.change(ingredientAmountInput2, { target: { value: "0" } });
    });
    it("should operate onChangeIngredientUnit correctly", async () => {
        renderCreateCustomPage();
        const ingredientInput = screen.getByTestId("ingredientInput");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientUnitSelect = screen.getAllByTestId("ingredientUnitSelect")[0];
        fireEvent.change(ingredientUnitSelect, { target: { value: "ml" } });
    });
    it("should delete tag when tag delete button clicked", async () => {
        renderCreateCustomPage();
        const tagInput = screen.getByTestId("tagInput");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        const tagDeleteButton = screen.getByTestId("tagDeleteButton");
        fireEvent.click(tagDeleteButton);
    });
    it("should close AddIngredientModal when close button clicked", async () => {
        renderCreateCustomPage();
        const ingredientInput = screen.getByTestId("ingredientInput");
        fireEvent.click(ingredientInput);
        const closeAddIngredientModalButton = screen.getByTestId("closeAddIngredientModalButton");
        fireEvent.click(closeAddIngredientModalButton);
    });
    it("should call onKeyPress when enter pressed", async () => {
        renderCreateCustomPage();
        const tagInput = screen.getByTestId("tagInput");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "A", charCode: 65 });
    });
    it("should alert when not login", async () => {
        renderCreateCustomPage(false);
    });
    it("should not create cocktail when user is null", async () => {
        renderCreateCustomPage(true, true);
        const nameInput = screen.getByLabelText("Name:");
        fireEvent.change(nameInput, { target: { value: "NAME" } });
        const descriptionInput = screen.getByLabelText("Description:");
        fireEvent.change(descriptionInput, { target: { value: "DESCRIPTION" } });
        const ingredientInput = screen.getByTestId("ingredientInput");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientAmountInput = screen.getAllByTestId("ingredientAmountInput")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const recipeInput = screen.getByLabelText("Recipe:");
        fireEvent.change(recipeInput, { target: { value: "RECIPE" } });
        const tagInput = screen.getByTestId("tagInput");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        const confirmButton = screen.getByText("Confirm");
        fireEvent.click(confirmButton);
    });
});