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
}
const failedCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "failed",
    listStatus: "loading"
}
const fakeCocktailItemCS: CocktailDetailType = {
    id: 1,
    name: "name",
    image: "img",
    type: "CS",
    tags: ["CS1", "CS2"],
    author_id: 1,
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

        amount: "1 oz",
    }],
    is_bookmarked: false,
}
const fakeCocktailItemST: CocktailDetailType = {
    id: 1,
    name: "name",
    image: "img",
    type: "ST",
    tags: ["CS1", "CS2"],
    author_id: 1,
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

        amount: "1 oz",
    }],
    is_bookmarked: false,
}
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
}
const fakeCustomCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: fakeCocktailItemCS,
    itemStatus: "",
    listStatus: ""
}
const fakeStandardCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: fakeCocktailItemST,
    itemStatus: "",
    listStatus: ""
}
const emptyComment: CommentInfo = {
    commentList: [commentNotParent],
    commentItem: null,
    state: "EDIT"
}
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
}
const fakeComment: CommentInfo = {
    commentList: [commentAuthor],
    commentItem: null,
    state: null
}
const emptyIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading"
}

const loadingMockStore = getMockStore({ cocktail: loadingCocktail, ingredient: emptyIngredient, comment: fakeComment })
const failedMockStore = getMockStore({ cocktail: failedCocktail, ingredient: emptyIngredient, comment: fakeComment })
const emptyCommentMockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: emptyComment })
const itemDetailMockStore = getMockStore({ cocktail: fakeCustomCocktail, ingredient: emptyIngredient, comment: fakeComment })
const itemDetailMockStore_ST = getMockStore({ cocktail: fakeStandardCocktail, ingredient: emptyIngredient, comment: fakeComment })

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
        screen.getByText("bookmark")
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
        screen.getByText("bookmark")

        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);

        const ingredientItem = screen.getByText("1 oz iname")
        fireEvent.click(ingredientItem)
        expect(mockNavigate).toHaveBeenCalledWith("/ingredient/1")

        const inputBox = screen.getByRole("textbox")
        fireEvent.change(inputBox, { target: { value: "edit_comment" } });
        const addButton = screen.getByText("Add")
        fireEvent.click(addButton)
        expect(mockDispatch).toBeCalledTimes(3)
        const editButton = screen.getByText("Edit")
        fireEvent.click(editButton)
        expect(mockNavigate).toHaveBeenCalledWith("/custom/1/edit")
    });
})









