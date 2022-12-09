import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import EditCustomPage from "./EditCustomPage";
import { IProps as AddIngredientModalProp } from "../CreateCustomPage/Modals/AddIngredientModal";
import { UserInfo } from "../store/slices/user/user";
import React from 'react';
import { RateInfo } from "../store/slices/rate/rate";

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
            unit: ['oz', 'ml']
            , color: ""
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

const stubCocktailInitialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: {
        id: 2,
        name: "COCKTAIL_NAME_2",
        name_eng: "COCKTAIL_NAME_ENG_2",
        color: "color",
        image: "COCKTAIL_IMAGE_2",
        introduction: "COCKTAIL_INTRO_2",
        recipe: "COCKTAIL_RECIPE_2",
        ABV: 40,
        price_per_glass: 20,
        tags: ["TAG_1"],
        type: "CS",
        author_id: 1,
        author_name: "username",
        created_at: new Date(),
        updated_at: new Date(),
        rate: 3,
        ingredients: [
            {
                ...stubIngredientInitialState.ingredientList[0], amount: "1 oz",
                recipe_unit: ""
            },
            {
                ...stubIngredientInitialState.ingredientList[1], amount: "5 oz",
                recipe_unit: ""
            },
        ],
        is_bookmarked: false,
        score: 1
    },
    itemStatus: "success",
    listStatus: "success",
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
jest.mock("../CreateCustomPage/Modals/AddIngredientModal", () => (prop: AddIngredientModalProp) => {
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

jest.mock('react-router', () => ({
    useParams: jest.fn().mockReturnValue({ id: "2" }),
}));

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

const renderEditCustomPage = (status = "success", isLogin: boolean = true, isUserNull: boolean = false, isCocktailNull: boolean = false) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<EditCustomPage />} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: (
                    isCocktailNull ?
                        { ...stubCocktailInitialState, cocktailItem: null } :
                        { ...stubCocktailInitialState, itemStatus: status }
                ),
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

describe("<EditCustomPage />", () => {
    it("should render EditCustomPage", async () => {
        renderEditCustomPage();
        expect(screen.getByDisplayValue("COCKTAIL_NAME_2")).toBeInTheDocument();
    });
    it("should navigate to /custom/:id when confirm button clicked", async () => {
        renderEditCustomPage();
        const nameInput = screen.getByLabelText("Name:");
        fireEvent.change(nameInput, { target: { value: "NAME" } });
        const descriptionInput = screen.getByLabelText("Description:");
        fireEvent.change(descriptionInput, { target: { value: "DESCRIPTION" } });
        const ingredientInput = screen.getAllByTestId("ingredientInput")[0];
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
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
    it("should operate onChangeAmount correctly", async () => {
        renderEditCustomPage();
        const ingredientAmountInput = screen.getAllByTestId("ingredientAmountInput")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const addIngredientButton2 = screen.getAllByTestId("addIngredientButton")[1];
        fireEvent.click(addIngredientButton2);
        const ingredientAmountInput2 = screen.getAllByTestId("ingredientAmountInput")[1];
        fireEvent.change(ingredientAmountInput2, { target: { value: "5" } });
        fireEvent.change(ingredientAmountInput2, { target: { value: "0" } });
    });
    it("should operate onChangeIngredientUnit correctly", async () => {
        renderEditCustomPage();
        const ingredientUnitSelect = screen.getAllByTestId("ingredientUnitSelect")[0];
        fireEvent.change(ingredientUnitSelect, { target: { value: "ml" } });
    });
    it("should delete ingredient when ingredient delete button clicked", async () => {
        renderEditCustomPage();
        const ingredientDeleteButton = screen.getAllByTestId("ingredientDeleteButton")[0];
        fireEvent.click(ingredientDeleteButton);
    });
    it("should delete tag when tag delete button clicked", async () => {
        renderEditCustomPage();
        const tagDeleteButton = screen.getAllByTestId("tagDeleteButton")[0];
        fireEvent.click(tagDeleteButton);
    });
    it("should show loading when loading", async () => {
        renderEditCustomPage("loading");
        await screen.findByText("Loading ..");
    });
    it("should not render when failed", async () => {
        renderEditCustomPage("failed");
        await screen.findByText("Non existing cocktail");
    });
    it("should close AddIngredientModal when close button clicked", async () => {
        renderEditCustomPage();
        const ingredientInput = screen.getAllByTestId("ingredientInput")[2];
        fireEvent.click(ingredientInput);
        const closeAddIngredientModalButton = screen.getAllByTestId("closeAddIngredientModalButton")[2];
        fireEvent.click(closeAddIngredientModalButton);
    });
    it("should render empty string when cocktail item is null", async () => {
        renderWithProviders(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<EditCustomPage />} />
                </Routes>
            </MemoryRouter>,
            {
                preloadedState: {
                    cocktail: { ...stubCocktailInitialState, cocktailItem: null },
                    comment: stubCommentInitialState,
                    ingredient: stubIngredientInitialState,
                    user: stubUserInitialState,
                    rate: rateState
                },
            }
        );
    });
    it("should call onKeyPress when enter pressed", async () => {
        renderEditCustomPage();
        const tagInput = screen.getByTestId("tagInput");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "A", charCode: 65 });
    });
    it("should alert when not login", async () => {
        renderEditCustomPage("success", false);
    });
    it("should not edit cocktail when user is null", async () => {
        renderEditCustomPage("success", true, true);
        const confirmButton = screen.getByText("Confirm");
        fireEvent.click(confirmButton);
    });
    it("should not load when cocktail is null", async () => {
        renderEditCustomPage("success", true, false, true);
    });
});