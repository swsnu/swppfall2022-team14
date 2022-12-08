import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import RecommendModal from "./RecommendModal";
import React from 'react'
import { UserInfo } from "../../store/slices/user/user";
import { RateInfo } from "../../store/slices/rate/rate";

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
    recommendIngredientList: [{ id: 1, name: '1', image: '1', ABV: 1, price: 1, introduction: '1', unit: ['1'], color: "" }],
    availableCocktails: [{ ingredient_id: 1, cocktails: [{ name: 'cocktail1', type: 'ST', id: 1 }, { name: 'cocktail2', type: 'CS', id: 2 }, { name: 'cocktail3', type: 'NOTHING', id: 3 }] }],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};
const stubIngredientInitialState2: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    recommendIngredientList: [{ id: 1, name: '1', image: '1', ABV: 1, price: 1, introduction: '1', unit: ['1'], color: "" }],
    availableCocktails: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};


const stubUserInitialState: UserInfo = {
    user: {
        id: (localStorage.getItem("id") === null) ? null : localStorage.getItem("id"),
        username: (localStorage.getItem("username") === null) ? null : localStorage.getItem("username"),
        password: null,
        nickname: (localStorage.getItem("nickname") === null) ? null : localStorage.getItem("nickname"),
        intro: (localStorage.getItem("intro") === null) ? null : localStorage.getItem("intro"),
        profile_img: (localStorage.getItem("profile_img") === null) ? null : localStorage.getItem("profile_img"),
    },
    token: (localStorage.getItem("token") === null) ? null : localStorage.getItem("token"),
    isLogin: (localStorage.getItem("token") !== null)
}
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

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const renderRecommendModal = (ingredient: IngredientInfo) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<RecommendModal isOpen={true} setIsOpen={jest.fn()} />} />

            </Routes >
        </MemoryRouter >,
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



describe("<RecommendModal />", () => {
    it("should render RecommendModal", async () => {
        renderRecommendModal(stubIngredientInitialState);
        const closeButton = screen.getByText("X");
        fireEvent.click(closeButton);
    });
    it("should handle available cocktail click", () => {
        renderRecommendModal(stubIngredientInitialState);
        const cocktailName = screen.getByText("cocktail1")
        fireEvent.click(cocktailName)
        expect(mockNavigate).toHaveBeenCalledWith("/standard/1");
        const cocktailName2 = screen.getByText("cocktail2")
        fireEvent.click(cocktailName2)
        expect(mockNavigate).toHaveBeenCalledWith("/custom/2");
        const cocktailName3 = screen.getByText("cocktail3")
        fireEvent.click(cocktailName3)

    })
    it("should handle recommendation ingredients render branches", () => {
        renderRecommendModal(stubIngredientInitialState2);
    })

});