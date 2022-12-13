import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import React from 'react';
import { getMockStore } from "../test-utils/mock";
import { Provider } from "react-redux";
import { CommentInfo, CommentType } from "../store/slices/comment/comment";
import {
    CocktailDetailType,
    CocktailInfo,
} from "../store/slices/cocktail/cocktail";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import ItemDetailPage from "./ItemDetailPage";
import { UserInfo } from "../store/slices/user/user";
import { RateInfo } from "../store/slices/rate/rate";
import { RatingProps, TextFieldProps } from "@mui/material";

// eslint-disable-next-line react/display-name
jest.mock("./Comment/Comment", () => (prop: CommentType) => (
    <div data-testid={`spyComment_${prop.id}`}>
    </div>
));

// eslint-disable-next-line react/display-name
jest.mock("@mui/material/Rating/Rating", () => (props: RatingProps) => (
    <input data-testid={'rating_button'} />
));

// eslint-disable-next-line react/display-name
jest.mock("@mui/material/TextField/TextField", () => (props: TextFieldProps) => (
    <input onClick={props.onClick} onChange={props.onChange} data-testid={'add_comment_input'} />
));

const loadingCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading"
};

const failedCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "failed",
    listStatus: "loading"
};

const fakeCocktailItemCS: CocktailDetailType = {
    id: 1,
    name: "name",
    image: "img",
    type: "CS",
    tags: ["CS1", "CS2"],
    author_id: 1,
    author_name: "username",
    rate: 1,
    introduction: "intro",
    recipe: "recipe",
    ABV: 1,
    price_per_glass: 1,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    ingredients: [{
        id: 1,
        name: "iname",
        name_eng: "ENG_INGREDIENT1",
        image: "iimg",
        ABV: 1,
        price: 1,
        introduction: "iintro",
        unit: ['oz', 'ml'],
        amount: "10",
        color: "",
        recipe_unit: ""
    }],
    is_bookmarked: false,
    score: 1,
    name_eng: "",
    color: "",
    filter_type_one: "",
    filter_type_two: ""
};

const fakeCocktailItemST: CocktailDetailType = {
    id: 1,
    name: "name",
    image: "img",
    type: "ST",
    tags: ["CS1", "CS2"],
    author_id: 1,
    author_name: "username",
    rate: 1,
    introduction: "intro",
    recipe: "recipe",
    ABV: 1,
    price_per_glass: 1,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    ingredients: [{
        id: 1,
        name: "iname",
        name_eng: "ENG_INGREDIENT1",
        image: "iimg",
        ABV: 1,
        price: 1,
        introduction: "iintro",
        unit: ['oz', 'ml'],
        amount: "10",
        color: "",
        recipe_unit: ""
    }],
    is_bookmarked: false,
    score: 1,
    name_eng: "",
    color: "",
    filter_type_one: "",
    filter_type_two: ""
};

const commentNotParent: CommentType = {
    id: 1,
    cocktail: {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1", "CS2"],
        author_id: 1,
        rate: 1,
        is_bookmarked: false,
        ABV: 10,
        price_per_glass: 10,
    },
    author_id: 1,
    author_name: "username",
    content: "content1",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: 1, // if null comment is root comment
    is_deleted: false,
};

const fakeCustomCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: fakeCocktailItemCS,
    itemStatus: "",
    listStatus: ""
};

const fakeStandardCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: fakeCocktailItemST,
    itemStatus: "",
    listStatus: ""
};

const notBookmarkedCocktailItem: CocktailDetailType = {
    id: 1,
    name: "name",
    image: "img",
    type: "ST",
    tags: ["CS1", "CS2"],
    author_id: 1,
    author_name: "username",
    rate: 1,
    introduction: "intro",
    recipe: "recipe",
    ABV: 1,
    price_per_glass: 1,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    ingredients: [{
        id: 1,
        name: "iname",
        name_eng: "ENG_INGREDIENT1",
        image: "iimg",
        ABV: 1,
        price: 1,
        introduction: "iintro",
        unit: ['oz', 'ml'],
        amount: "10",
        color: "",
        recipe_unit: ""
    }],
    is_bookmarked: true,
    score: 1,
    name_eng: "",
    color: "",
    filter_type_one: "",
    filter_type_two: ""
};

const notBookmarkedCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: notBookmarkedCocktailItem,
    itemStatus: "",
    listStatus: ""
};

const emptyComment: CommentInfo = {
    commentList: [commentNotParent],
    commentItem: null,
    state: "EDIT"
};

const commentAuthor: CommentType = {
    id: 1,
    cocktail: {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1", "CS2"],
        author_id: 1,
        rate: 1,
        is_bookmarked: false,
        ABV: 10,
        price_per_glass: 10,
    },
    author_id: 1,
    author_name: "username",
    content: "content1",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: null, // if null comment is root comment
    is_deleted: false
};

const fakeComment: CommentInfo = {
    commentList: [commentAuthor],
    commentItem: null,
    state: null
};

const emptyIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
};

const stubUserInitialState: UserInfo = {
    user: {
        id: "1",
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
const alreadyRatedState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: 5
}
const loadingMockStore = getMockStore({ cocktail: loadingCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const failedMockStore = getMockStore({ cocktail: failedCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const emptyCommentMockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState });
const itemDetailMockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const itemDetailMockStore_ST = getMockStore({ cocktail: fakeStandardCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const notLoginMockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: fakeComment, user: emptyUserInitailState, rate: rateState });
const notBookmarkedMockStore = getMockStore({ cocktail: notBookmarkedCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const alreadyRatedMockStore = getMockStore({ cocktail: notBookmarkedCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: alreadyRatedState });
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

jest.spyOn(window, 'alert').mockImplementation(() => { console.log("alert") });

describe("<ItemDetailPage />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors loading Status", () => {
        render(
            <Provider store={loadingMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("Loading ..")
    });
    it("should render without errors failed Status", () => {
        render(
            <Provider store={failedMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("Non existing cocktail")
    });
    it("should render without errors type Miss match1", () => {
        render(
            <Provider store={itemDetailMockStore}>
                <MemoryRouter initialEntries={['/miss/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("Type mismatch")
    });
    it("should render without errors type Miss match2", () => {
        render(
            <Provider store={itemDetailMockStore_ST}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText("Type mismatch")
    });
    it("should render without errors empty parent_comment", () => {
        render(
            <Provider store={emptyCommentMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        screen.getByText('recipe');
    });
    it("should render without errors", () => {
        render(
            <Provider store={itemDetailMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);

        const ingredientItem = screen.getByTestId('ingre_button_1')
        fireEvent.click(ingredientItem)
        expect(mockNavigate).toHaveBeenCalledWith("/ingredient/1")

        expect(mockDispatch).toBeCalledTimes(5)
        const editButton = screen.getByTestId("edit_button")
        fireEvent.click(editButton)
        expect(mockNavigate).toHaveBeenCalledWith("/custom/1/edit")
        const deleteButton = screen.getByTestId("delete_button")
        fireEvent.click(deleteButton)
        expect(mockNavigate).toBeCalledWith('/custom')
    });
    it("should handle create comment", () => {
        render(
            <Provider store={itemDetailMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const inputBox = screen.getByTestId('add_comment_input')
        fireEvent.click(inputBox)
        const textfield = screen.getByTestId('add_comment_input')
        fireEvent.change(textfield, { target: { value: "NEW_CONTENT" } })
        const addButton = screen.getByText("댓글")
        fireEvent.click(addButton)
        expect(mockDispatch).toBeCalledTimes(6)

        fireEvent.click(inputBox)
        const cancelButton = screen.getByText("취소")
        fireEvent.click(cancelButton)
        const _cancelButton = screen.queryByText("취소")
        expect(_cancelButton).toBeNull()
    })
    it("should change bookmark button when bookmarked", async () => {
        render(
            <Provider store={notBookmarkedMockStore}>
                <MemoryRouter initialEntries={['/standard/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const bookmarkButton = screen.getByTestId('bookmark_button');
        fireEvent.click(bookmarkButton)
        expect(mockDispatch).toBeCalledTimes(6)
    });
    it("should not add bookmark when not login", async () => {
        render(
            <Provider store={notLoginMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const bookmarkButton = screen.getByTestId('bookmark_button');
        fireEvent.click(bookmarkButton)
        expect(mockDispatch).toBeCalledTimes(4)
    });
    it("should set rate when logged in", async () => {
        render(
            <Provider store={notBookmarkedMockStore}>
                <MemoryRouter initialEntries={['/standard/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const rateButton = screen.getByText("별점주기");
        fireEvent.click(rateButton)
        screen.getByText('해당 점수를 클릭하세요')
        const rating_button = screen.getAllByTestId('rating_button')[1]
        fireEvent.change(rating_button, { target: { value: 1 } })
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(5))
    });
    it("should not set rate when not logged in", async () => {
        render(
            <Provider store={notLoginMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const rateButton = screen.getByText("별점주기");
        fireEvent.click(rateButton)
        const component = screen.queryByText('해당 점수를 클릭하세요')
        expect(component).toBeNull()
        expect(mockDispatch).toBeCalledTimes(4)
    });
    it("should handle delete rate when logged in", async () => {
        render(
            <Provider store={alreadyRatedMockStore}>
                <MemoryRouter initialEntries={['/standard/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const deleteRateButton = screen.getByText("별점삭제하기");
        fireEvent.click(deleteRateButton)
        expect(mockDispatch).toBeCalledTimes(6)
    });
})