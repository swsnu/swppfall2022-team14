import { fireEvent, render, screen } from "@testing-library/react";
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

// eslint-disable-next-line react/display-name
jest.mock("./Comment/Comment", () => (prop: CommentType) => (
    <div data-testid={`spyComment_${prop.id}`}>
    </div>
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
    color: ""
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
    color: ""
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
    },
    author_id: 1,
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
    color: ""
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
    },
    author_id: 1,
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
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 }
}
const loadingMockStore = getMockStore({ cocktail: loadingCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const failedMockStore = getMockStore({ cocktail: failedCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const emptyCommentMockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: emptyComment, user: stubUserInitialState, rate: rateState });
const itemDetailMockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const itemDetailMockStore_ST = getMockStore({ cocktail: fakeStandardCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });
const notLoginMockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: fakeComment, user: emptyUserInitailState, rate: rateState });
const notBookmarkedMockStore = getMockStore({ cocktail: notBookmarkedCocktail, ingredient: emptyIngredient, comment: fakeComment, user: stubUserInitialState, rate: rateState });

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

jest.spyOn(window, 'alert').mockImplementation(() => { });

describe("<ItemDetailPage />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors loading Status", () => {
        const { container } = render(
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
        const { container } = render(
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
        const { container } = render(
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
        const { container } = render(
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
        const { container } = render(
            <Provider store={emptyCommentMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("main");
        expect(element).toHaveLength(1);
        screen.getByText("Add in Bookmark");
    });
    it("should render without errors", () => {
        const { container } = render(
            <Provider store={itemDetailMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("main");
        expect(element).toHaveLength(1);

        const bookmarkButton = screen.getByText("Add in Bookmark");
        fireEvent.click(bookmarkButton);

        const rateButton = screen.getByText("rate button");
        fireEvent.click(rateButton);

        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);

        const ingredientItem = screen.getByText("10 iname")
        fireEvent.click(ingredientItem)
        expect(mockNavigate).toHaveBeenCalledWith("/ingredient/1")

        const inputBox = screen.getByRole("textbox")
        fireEvent.change(inputBox, { target: { value: "edit_comment" } });
        const addButton = screen.getByText("Add")
        fireEvent.click(addButton)
        expect(mockDispatch).toBeCalledTimes(5)
        const editButton = screen.getByText("Edit")
        fireEvent.click(editButton)
        expect(mockNavigate).toHaveBeenCalledWith("/custom/1/edit")
    });
    it("should change bookmark button when bookmarked", async () => {
        const { container } = render(
            <Provider store={notBookmarkedMockStore}>
                <MemoryRouter initialEntries={['/standard/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const bookmarkButton = screen.getByText("Remove from Bookmark");
    });
    it("should not create comment when not login", async () => {
        const { container } = render(
            <Provider store={notLoginMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const addButton = screen.getByText("Add")
        fireEvent.click(addButton)
    });
    it("should not add bookmark when not login", async () => {
        const { container } = render(
            <Provider store={notLoginMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const bookmarkButton = screen.getByText("Add in Bookmark");
        fireEvent.click(bookmarkButton)
    });
    it("should not set rate when not login", async () => {
        const { container } = render(
            <Provider store={notLoginMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<ItemDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const rateButton = screen.getByText("rate button");
        fireEvent.click(rateButton)
    });
})