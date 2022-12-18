import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import InitMyLiqourModal from "./InitMyLiquorModal";
import { UserInfo } from "../../store/slices/user/user";
import React from 'react'
import { RateInfo } from "../../store/slices/rate/rate";
import userEvent from "@testing-library/user-event";

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
    myIngredientList: [{ id: 1, name: '1', image: '1', ABV: 1, price: 1, introduction: '1', unit: ['1'], color: "", name_eng: "ENG_INGREDIENT1", }],
    recommendIngredientList: [],
    availableCocktails: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};
const stubIngredientInitialStateEmpty: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    recommendIngredientList: [],
    availableCocktails: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
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
jest.mock("react-modal", () => (props: { className: any, isOpen: boolean, onRequestClose: any, children: React.ReactNode }) => {

    props.onRequestClose()
    if (props.isOpen) return (
        <div data-testid={"spyModal_opened"}>
            {props.children}
        </div>
    )
    else return <div data-testid={"spyModal_closed"} />
});

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderInitMyLiqourModal = (ingredient: IngredientInfo) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<InitMyLiqourModal isOpen={true} setIsOpen={jest.fn()} />} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: stubCocktailInitialState,
                comment: stubCommentInitialState,
                ingredient: ingredient,
                user: stubUserInitialState,
                rate: rateState
            },
        }
    );
};

describe("<InitMyLiquorModal />", () => {
    it("should render InitMyLiquorModal", () => {
        renderInitMyLiqourModal(stubIngredientInitialState);
        userEvent.click(document.body);
    });

});