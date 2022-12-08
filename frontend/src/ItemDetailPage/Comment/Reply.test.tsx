import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Reply from './Reply'
import React from 'react';
import { CommentInfo, CommentType } from "../../store/slices/comment/comment";
import { getMockStore } from "../../test-utils/mock";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import { CocktailInfo, CocktailItemType } from "../../store/slices/cocktail/cocktail";
import { Provider } from "react-redux";
import { UserInfo } from "../../store/slices/user/user";
import { RateInfo } from "../../store/slices/rate/rate";

const emptyCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading"
}
const emptyIngredient: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
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
    author_name: "username",
    content: "content1",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: null, // if null comment is root comment
    is_deleted: false
}
const commentOther: CommentType = {
    id: 2,
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
    author_id: 2,
    author_name: "username",
    content: "content2",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: null, // if null comment is root comment
    is_deleted: false
}
const initComment: CommentInfo = {
    commentList: [commentAuthor, commentOther],
    commentItem: commentAuthor,
    state: null
}
const editComment: CommentInfo = {
    commentList: [commentAuthor, commentOther],
    commentItem: commentAuthor,
    state: "EDIT"
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
const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const commentMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: initComment, user: stubUserInitialState, rate: rateState })
const commentEditMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: editComment, user: stubUserInitialState, rate: rateState })

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

describe("<Reply />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors EDIT & handle Edit Comment", () => {
        const create = new Date()
        const update = new Date()
        const cocktail: CocktailItemType = {
            id: 1,
            name: "name",
            image: "img",
            type: "CS",
            tags: ["CS1", "CS2"],
            author_id: 1,
            rate: 1,
            is_bookmarked: false,
        }

        const { container } = render(
            <Provider store={commentEditMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Reply key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("reply__edit");
        expect(element).toHaveLength(1);

        const textBox = screen.getByRole("textbox")
        const editButton = screen.getByText("Edit")

        fireEvent.change(textBox, { target: { value: "edit_comment" } });
        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(1)
    });
    it("should render without errors Not EDIT & Auth", () => {
        const create = new Date()
        const update = new Date()
        const cocktail: CocktailItemType = {
            id: 1,
            name: "name",
            image: "img",
            type: "CS",
            tags: ["CS1", "CS2"],
            author_id: 1,
            rate: 1,
            is_bookmarked: false,
        }

        const { container } = render(
            <Provider store={commentMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Reply key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("reply");
        expect(element).toHaveLength(1);
        screen.getByText("content")

        const editButton = screen.getByText("Edit");
        const deleteButton = screen.getByText("Delete");

        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(1)
        fireEvent.click(deleteButton)
        expect(mockDispatch).toBeCalledTimes(2)
    });
})