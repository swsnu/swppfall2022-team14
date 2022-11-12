import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Reply from './Reply'
import React from 'react';
import {CommentInfo, CommentType} from "../../store/slices/comment/comment";
import {getMockStore} from "../../test-utils/mock";
import {IngredientInfo} from "../../store/slices/ingredient/ingredient";
import {CocktailInfo} from "../../store/slices/cocktail/cocktail";
import {Provider} from "react-redux";
import Comment from "./Comment";

// eslint-disable-next-line react/display-name
jest.mock("./Reply", () => (prop : CommentType) => (
    <div data-testid={`spyReply_${prop.id}`}>
    </div>
));

const emptyCocktail : CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading"
}
const emptyIngredient : IngredientInfo = {
    ingredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading"
}
const commentAuthor : CommentType = {
    id: 1,
    cocktail: {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1","CS2"],
        author_id: 1,
        rate: 1,
    },
    author_id: 1,
    content: "content1",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: 1, // if null comment is root comment
    is_deleted: false
}
const commentOther : CommentType = {
    id: 2,
    cocktail: {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1","CS2"],
        author_id: 1,
        rate: 1,
    },
    author_id: 2,
    content: "content2",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: 1, // if null comment is root comment
    is_deleted: false
}
const initComment : CommentInfo = {
    commentList: [commentAuthor,commentOther],
    commentItem: commentAuthor,
    state: null
}
const editComment : CommentInfo = {
    commentList: [commentAuthor],
    commentItem: commentAuthor,
    state: "EDIT"
}
const replyComment : CommentInfo = {
    commentList: [commentAuthor],
    commentItem: commentAuthor,
    state: "REPLY"
}
const commentMockStore = getMockStore({cocktail: emptyCocktail,ingredient: emptyIngredient,comment: initComment})
const commentEditMockStore = getMockStore({cocktail: emptyCocktail,ingredient: emptyIngredient,comment: editComment})
const commentReplyMockStore = getMockStore({cocktail: emptyCocktail,ingredient: emptyIngredient,comment: replyComment})

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

    it("should render without errors EDIT & handle Edit Comment", () => {
        const create = new Date()
        const update = new Date()
        const cocktail = {
            id: 1,
            name: "name",
            image: "img",
            type: "CS",
            tags: ["CS1","CS2"],
            author_id: 1,
            rate: 1,
        }

        const { container } = render(
            <Provider store={commentEditMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail}/>}/>
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("comments__create");
        expect(element).toHaveLength(1);
        const items = screen.getAllByTestId("spyReply_1");
        expect(items).toHaveLength(1);

        const textBox = screen.getByRole("textbox")
        const editButton = screen.getByText("Edit")

        fireEvent.change(textBox, { target: {value: "edit_comment"}});
        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(1)
    });
    it("should render without errors Reply & handle Edit Comment", () => {
        const create = new Date()
        const update = new Date()
        const cocktail = {
            id: 1,
            name: "name",
            image: "img",
            type: "CS",
            tags: ["CS1","CS2"],
            author_id: 1,
            rate: 1,
        }

        const { container } = render(
            <Provider store={commentReplyMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail}/>}/>
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("comments__create");
        expect(element).toHaveLength(1);

        const textBox = screen.getByRole("textbox")
        const addButton = screen.getByText("Add")

        fireEvent.change(textBox, { target: {value: "edit_comment"}});
        fireEvent.click(addButton)
        expect(mockDispatch).toBeCalledTimes(1)
    });
    it("should render without errors Not EDIT & Auth", () => {
        const create = new Date()
        const update = new Date()
        const cocktail = {
            id: 1,
            name: "name",
            image: "img",
            type: "CS",
            tags: ["CS1","CS2"],
            author_id: 1,
            rate: 1,
        }

        const { container } = render(
            <Provider store={commentMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail}/>}/>
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("comment");
        expect(element).toHaveLength(1);
        screen.getByText("content")

        const items = screen.getAllByTestId("spyReply_1");
        expect(items).toHaveLength(1);

        const editButton = screen.getByText("Edit");
        const deleteButton = screen.getByText("Delete");
        const replyButton = screen.getByText("Reply")

        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(1)
        fireEvent.click(deleteButton)
        expect(mockDispatch).toBeCalledTimes(2)
        fireEvent.click(replyButton)
        expect(mockDispatch).toBeCalledTimes(3)
    });
})
