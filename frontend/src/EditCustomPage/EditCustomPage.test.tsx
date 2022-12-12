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
import user from '@testing-library/user-event';

const stubCommentInitialState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
};

const stubIngredientInitialState: IngredientInfo = {
    ingredientList: [
        {
            id: 2,
            name: 'INGREDIENT_NAME_2',
            name_eng: "ENG_INGREDIENT2",
            image: 'INGREDIENT_IMAGE_2',
            introduction: 'INGREDIENT_INTRO_2',
            ABV: 20,
            price: 100,
            unit: ['oz'],
            color: ""
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
                id: 1,
                name: 'INGREDIENT_NAME_1',
                name_eng: "ENG_INGREDIENT1",
                image: 'INGREDIENT_IMAGE_1',
                introduction: 'INGREDIENT_INTRO_1',
                ABV: 40,
                price: 200,
                unit: ['oz', 'ml'],
                color: "",
                amount: "1 oz",
                recipe_unit: ""
            },
        ],
        is_bookmarked: false,
        score: 1,
        filter_type_one: "클래식",
        filter_type_two: "롱 드링크"
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

jest.spyOn(window, 'alert').mockImplementation(() => { });

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
        const nameInput = screen.getByLabelText("칵테일 이름");
        fireEvent.change(nameInput, { target: { value: "NAME" } });
        const engNameInput = screen.getByLabelText("영어 이름 (선택)");
        fireEvent.change(engNameInput, { target: { value: "NAME" } });
        const descriptionInput = screen.getByLabelText("설명");
        fireEvent.change(descriptionInput, { target: { value: "DESCRIPTION" } });
        const ingredientInput = screen.getAllByLabelText("재료")[1];
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientAmountInput = screen.getAllByLabelText("양")[1];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const recipeInput = screen.getByLabelText("만드는 방법");
        fireEvent.change(recipeInput, { target: { value: "RECIPE" } });
        const tagInput = screen.getByLabelText("태그");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        const confirmButton = screen.getByText("수정");
        fireEvent.click(confirmButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/custom/1"));
    });
    it("should operate onChangeAmount correctly", async () => {
        renderEditCustomPage();
        const ingredientAmountInput = screen.getAllByLabelText("재료")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const addIngredientButton2 = screen.getAllByTestId("addIngredientButton")[1];
        fireEvent.click(addIngredientButton2);
        const ingredientAmountInput2 = screen.getAllByLabelText("양")[1];
        fireEvent.change(ingredientAmountInput2, { target: { value: "5" } });
        fireEvent.change(ingredientAmountInput2, { target: { value: "0" } });
    });
    it("should operate onChangeIngredientUnit correctly", async () => {
        renderEditCustomPage();
        const ingredientUnitSelect = screen.getAllByLabelText("양")[0];
        fireEvent.change(ingredientUnitSelect, { target: { value: "ml" } });
    });
    it("should delete ingredient when ingredient delete button clicked", async () => {
        renderEditCustomPage();
        const ingredientDeleteButton = screen.getAllByTestId("delete")[0];
        fireEvent.click(ingredientDeleteButton);
    });
    it("should delete tag when tag delete button clicked", async () => {
        renderEditCustomPage();
        const tagDeleteButton = screen.getByText("#TAG_1");
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
        const tagInput = screen.getByLabelText("태그");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "A", charCode: 65 });
    });
    it("should alert when not login", async () => {
        renderEditCustomPage("success", false);
    });
    it("should not edit cocktail when user is null", async () => {
        renderEditCustomPage("success", true, true);
        const confirmButton = screen.getByText("수정");
        fireEvent.click(confirmButton);
    });
    it("should not load when cocktail is null", async () => {
        renderEditCustomPage("success", true, false, true);
    });
    it("should load image when file upload button clicked", async () => {
        renderEditCustomPage();
        const FileUploadInput = screen.getByTestId("file");
        const file = new File(["test"], "test.jpg", {
            type: 'image/jpeg'
        });
        user.upload(FileUploadInput, file);
    });
    it("should fail loading image when file wrong", async () => {
        renderEditCustomPage();
        const FileUploadInput = screen.getByTestId("file");
        const file = new File(["test"], "test.txt", {
            type: 'text/plain'
        });
        user.upload(FileUploadInput, file);
    });
});