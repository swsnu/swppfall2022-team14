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
import { RateInfo } from "../store/slices/rate/rate";

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
        name_eng: "ENG_INGREDIENT1",
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200,
        unit: ['oz'],
        color: ""
    },
    myIngredientList: [],
    itemStatus: "loading",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
}

const failedIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: {
        id: 1,
        name: 'name',
        name_eng: "ENG_INGREDIENT1",
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200,
        unit: ['oz'],
        color: ""
    },
    itemStatus: "failed",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
}

const noABVIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: {
        id: 1,
        name: 'name',
        name_eng: "ENG_INGREDIENT1",
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 0,
        price: 200,
        unit: ['oz'],
        color: ""
    },
    itemStatus: "",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
}

const fakeIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: {
        id: 1,
        name: 'name',
        name_eng: "ENG_INGREDIENT1",
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200,
        unit: ['oz'],
        color: ""
    },
    itemStatus: "",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
}

const colorIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: {
        id: 1,
        name: 'name',
        name_eng: "ENG_INGREDIENT1",
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200,
        unit: ['oz'],
        color: "ffffff"
    },
    itemStatus: "",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
}

const myIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [{
        id: 1,
        name: 'name',
        name_eng: "ENG_INGREDIENT1",
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200,
        unit: ['oz'],
        color: ""
    }],
    ingredientItem: {
        id: 1,
        name: 'name',
        name_eng: "ENG_INGREDIENT1",
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        ABV: 42.4,
        price: 200,
        unit: ['oz'],
        color: ""
    },
    itemStatus: "",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
}

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

const emptyUserInitailState: UserInfo = {
    user: null,
    token: null,
    isLogin: false
};

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const loadingMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: loadingIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState })
const failedMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: failedIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState })
const noAVBIngredientMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: noABVIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState })
const fakeIngredientMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: fakeIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState })
const colorIngredientMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: colorIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState })
const notLoginMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: fakeIngredient, comment: emptyComment, user: emptyUserInitailState, rate: rateState });
const myIngredientMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: myIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState })
const myNotLoginMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: myIngredient, comment: emptyComment, user: emptyUserInitailState, rate: rateState });

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

jest.spyOn(console, 'error').mockImplementation(() => {});

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
        screen.getByTestId("load-button")
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
        screen.getByText("서버로부터 정보를 불러오지 못하였습니다.")
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
        screen.getByText("소개")
        const addButton = screen.getByTestId("add-ingredient")
        fireEvent.click(addButton)
    });
    it("should not add ingredient when not login", () => {
        const { container } = render(
            <Provider store={notLoginMockStore}>
                <MemoryRouter initialEntries={['/ingredient/1']}>
                    <Routes>
                        <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("소개")
        const addButton = screen.getByTestId("add-ingredient")
        fireEvent.click(addButton)
    })
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
        screen.getByText("소개")
        screen.getByText("도수 없음")
    });
    it("should delete ingredient when click delete button", () => {
        const { container } = render(
            <Provider store={myIngredientMockStore}>
                <MemoryRouter initialEntries={['/ingredient/1']}>
                    <Routes>
                        <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("소개")
        const deleteButton = screen.getByTestId("delete-ingredient")
        fireEvent.click(deleteButton)
    });
    it("should not delete ingredient when not login", () => {
        const { container } = render(
            <Provider store={myNotLoginMockStore}>
                <MemoryRouter initialEntries={['/ingredient/1']}>
                    <Routes>
                        <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("소개")
        const deleteButton = screen.getByTestId("delete-ingredient")
        fireEvent.click(deleteButton)
    });
    it("should render color", () => {
        const { container } = render(
            <Provider store={colorIngredientMockStore}>
                <MemoryRouter initialEntries={['/ingredient/1']}>
                    <Routes>
                        <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    })
})



















