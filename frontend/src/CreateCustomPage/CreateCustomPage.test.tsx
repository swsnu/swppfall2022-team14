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
import user from '@testing-library/user-event';

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
            name_eng: "ENG_INGREDIENT1",
            image: 'INGREDIENT_IMAGE_1',
            introduction: 'INGREDIENT_INTRO_1',
            ABV: 40,
            price: 200,
            unit: ['oz', 'ml'], color: ""
        },
        {
            id: 2,
            name: 'INGREDIENT_NAME_2',
            name_eng: "ENG_INGREDIENT1",
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

jest.spyOn(window, 'alert').mockImplementation(() => { });

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
        await screen.findByText("업로드");
    });
    it("should navigate to /custom/:id when confirm button clicked", async () => {
        renderCreateCustomPage();
        const nameInput = screen.getByLabelText("칵테일 이름");
        fireEvent.change(nameInput, { target: { value: "NAME" } });
        const engNameInput = screen.getByLabelText("영어 이름 (선택)");
        fireEvent.change(engNameInput, { target: { value: "NAME" } });
        const descriptionInput = screen.getByLabelText("설명");
        fireEvent.change(descriptionInput, { target: { value: "DESCRIPTION" } });
        const ingredientInput = screen.getByLabelText("재료");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientAmountInput = screen.getAllByLabelText("양")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const recipeInput = screen.getByLabelText("만드는 방법");
        fireEvent.change(recipeInput, { target: { value: "RECIPE" } });
        const tagInput = screen.getByLabelText("태그");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        const confirmButton = screen.getByText("업로드");
        fireEvent.click(confirmButton);

    });
    it("should delete ingredient when ingredient delete button clicked", async () => {
        renderCreateCustomPage();
        const ingredientInput = screen.getByLabelText("재료");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientDeleteButton = screen.getByTestId("delete");
        fireEvent.click(ingredientDeleteButton);
    });
    it("should operate onChangeAmount correctly", async () => {
        renderCreateCustomPage();
        const ingredientInput = screen.getByLabelText("재료");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientAmountInput = screen.getAllByLabelText("양")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const addIngredientButton2 = screen.getAllByTestId("addIngredientButton")[1];
        fireEvent.click(addIngredientButton2);
        const ingredientAmountInput2 = screen.getAllByLabelText("양")[1];
        fireEvent.change(ingredientAmountInput2, { target: { value: "5" } });
        fireEvent.change(ingredientAmountInput2, { target: { value: "0" } });
    });
    it("should operate onChangeIngredientUnit correctly", async () => {
        renderCreateCustomPage();
        const ingredientInput = screen.getByLabelText("재료");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientUnitSelect = screen.getAllByTestId("단위")[0].querySelector("input");
        if (ingredientUnitSelect) fireEvent.change(ingredientUnitSelect, { target: { value: "ml" } });
    });
    it("should delete tag when tag delete button clicked", async () => {
        renderCreateCustomPage();
        const tagInput = screen.getByLabelText("태그");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        const tagDeleteButton = screen.getByText("#TAG");
        fireEvent.click(tagDeleteButton);
    });
    it("should call onKeyPress when enter pressed", async () => {
        renderCreateCustomPage();
        const tagInput = screen.getByLabelText("태그");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "A", charCode: 65 });
    });
    it("should alert when not login", async () => {
        renderCreateCustomPage(false);
    });
    it("should not create cocktail when user is null", async () => {
        renderCreateCustomPage(true, true);
        const nameInput = screen.getByLabelText("칵테일 이름");
        fireEvent.change(nameInput, { target: { value: "NAME" } });
        const descriptionInput = screen.getByLabelText("설명");
        fireEvent.change(descriptionInput, { target: { value: "DESCRIPTION" } });
        const ingredientInput = screen.getByLabelText("재료");
        fireEvent.click(ingredientInput);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        const ingredientAmountInput = screen.getAllByLabelText("양")[0];
        fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        const recipeInput = screen.getByLabelText("만드는 방법");
        fireEvent.change(recipeInput, { target: { value: "RECIPE" } });
        const tagInput = screen.getByLabelText("태그");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        const confirmButton = screen.getByText("업로드");
        fireEvent.click(confirmButton);
    });
    it("should load image when file upload button clicked", async () => {
        renderCreateCustomPage();
        const FileUploadInput = screen.getByTestId("file");
        const file = new File(["test"], "test.jpg", {
            type: 'image/jpeg'
        });
        user.upload(FileUploadInput, file);
    });
    it("should fail loading image when file wrong", async () => {
        renderCreateCustomPage();
        const FileUploadInput = screen.getByTestId("file");
        const file = new File(["test"], "test.txt", {
            type: 'text/plain'
        });
        user.upload(FileUploadInput, file);
    });
    it("should handle value errors", async () => {
        renderCreateCustomPage();
        const confirmButton = screen.getByText("업로드");
        fireEvent.click(confirmButton);
        const nameInput = screen.getByLabelText("칵테일 이름");
        fireEvent.change(nameInput, { target: { value: "NAME" } });
        fireEvent.click(confirmButton);
        const engNameInput = screen.getByLabelText("영어 이름 (선택)");
        fireEvent.change(engNameInput, { target: { value: "NAME" } });
        fireEvent.click(confirmButton);
        const descriptionInput = screen.getByLabelText("설명");
        fireEvent.change(descriptionInput, { target: { value: "DESCRIPTION" } });
        fireEvent.click(confirmButton);
        const addIngredientButton = screen.getAllByTestId("addIngredientButton")[0];
        fireEvent.click(addIngredientButton);
        fireEvent.click(confirmButton);
        const ingredientAmountInput = screen.getAllByTestId("양")[0].querySelector("input");
        if (ingredientAmountInput) fireEvent.change(ingredientAmountInput, { target: { value: "10" } });
        fireEvent.click(confirmButton);
        const recipeInput = screen.getByLabelText("만드는 방법");
        fireEvent.change(recipeInput, { target: { value: "RECIPE" } });
        fireEvent.click(confirmButton);
        const tagInput = screen.getByLabelText("태그");
        fireEvent.change(tagInput, { target: { value: "TAG" } })
        fireEvent.keyPress(tagInput, { key: "Enter", charCode: 13 });
        fireEvent.click(confirmButton);
        const typeOne = screen.getByTestId("typeone").querySelector("input");
        if (typeOne) fireEvent.change(typeOne, { target: { value: "트로피컬" } });
        const typeTwo = screen.getByTestId("typetwo").querySelector("input");
        if (typeTwo) fireEvent.change(typeTwo, { target: { value: "샷" } });


        const ingredientInput = screen.getAllByLabelText("재료")[0].querySelector("input");
        if (ingredientInput) fireEvent.click(ingredientInput);
        fireEvent.click(confirmButton);
        const ingredientUnitSelect = screen.getAllByTestId("단위")[0].querySelector("input");
        if (ingredientUnitSelect) fireEvent.change(ingredientUnitSelect, { target: { value: "ml" } });
        fireEvent.click(confirmButton);
        const ingredientAmountSelect = screen.getAllByTestId("양")[0].querySelector("input");
        if (ingredientAmountSelect) fireEvent.change(ingredientAmountSelect, { target: { value: "30" } });
        fireEvent.click(confirmButton);

    });
});