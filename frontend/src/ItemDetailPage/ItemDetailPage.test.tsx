import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import React from 'react';
import { getMockStore } from "../test-utils/mock";
import { Provider } from "react-redux";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import IngredientDetailPage from './IngredientDetailPage';
import { UserInfo } from "../store/slices/user/user";

const emptyCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading"
}
const emptyComment: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null
}
const loadingIngredient: IngredientInfo = {
    ingredientList: [],
    ingredientItem: {
        id: 1,
        name: 'name',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200
    },
    myIngredientList: [],
    itemStatus: "loading",
    listStatus: "loading"
}
const failedIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: {
        id: 1,
        name: 'name',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200
    },
    itemStatus: "failed",
    listStatus: "loading"
}
const noABVIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: {
        id: 1,
        name: 'name',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 0,
        price: 200
    },
    itemStatus: "",
    listStatus: "loading"
}
const fakeIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: {
        id: 1,
        name: 'name',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200
    },
    itemStatus: "",
    listStatus: "loading"
}

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

const loadingMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: loadingIngredient, comment: emptyComment, user: stubUserInitialState })
const failedMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: failedIngredient, comment: emptyComment, user: stubUserInitialState })
const noAVBIngredientMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: noABVIngredient, comment: emptyComment, user: stubUserInitialState })
const fakeIngredientMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: fakeIngredient, comment: emptyComment, user: stubUserInitialState })


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

describe("<Comment />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors loading Status", () => {
        const { container } = render(
            <Provider store={loadingMockStore}>
                <MemoryRouter initialEntries={['/ingredient/1']}>
                    <Routes>
                        <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("Loading ..")
    });
    it("should render without errors failed Status", () => {
        const { container } = render(
            <Provider store={failedMockStore}>
                <MemoryRouter initialEntries={['/ingredient/1']}>
                    <Routes>
                        <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("Non existing Ingredient")
    });

    it("should render without errors empty parent_comment", () => {
        const { container } = render(
            <Provider store={fakeIngredientMockStore}>
                <MemoryRouter initialEntries={['/ingredient/1']}>
                    <Routes>
                        <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("main");
        expect(element).toHaveLength(1);
        screen.getByText("소개")
    });
    it("should render without errors empty parent_comment & no ABV", () => {
        const { container } = render(
            <Provider store={noAVBIngredientMockStore}>
                <MemoryRouter initialEntries={['/ingredient/1']}>
                    <Routes>
                        <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("main");
        expect(element).toHaveLength(1);
        screen.getByText("소개")
        screen.getByText("도수 없음")
    });
})


















