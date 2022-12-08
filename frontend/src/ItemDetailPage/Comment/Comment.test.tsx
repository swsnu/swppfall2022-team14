import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import React from 'react';
import { CommentInfo, CommentType } from "../../store/slices/comment/comment";
import { getMockStore } from "../../test-utils/mock";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import { CocktailInfo, CocktailItemType } from "../../store/slices/cocktail/cocktail";
import { Provider } from "react-redux";
import Comment from "./Comment";
import { UserInfo } from "../../store/slices/user/user";
import { RateInfo } from "../../store/slices/rate/rate";

// eslint-disable-next-line react/display-name
jest.mock("./Reply", () => (prop: CommentType) => (
    <div data-testid={`spyReply_${prop.id}`}>
    </div>
));

const emptyCocktail: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading"
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
    parent_comment: 1, // if null comment is root comment
    is_deleted: false
};

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
    parent_comment: 1, // if null comment is root comment
    is_deleted: false
};

const commentMore: CommentType = {
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
    parent_comment: 11, // if null comment is root comment
    is_deleted: false
};

const initComment: CommentInfo = {
    commentList: [commentAuthor, commentOther],
    commentItem: commentAuthor,
    state: null
};

const editComment: CommentInfo = {
    commentList: [commentAuthor],
    commentItem: commentAuthor,
    state: "EDIT"
};

const replyComment: CommentInfo = {
    commentList: [commentAuthor],
    commentItem: commentAuthor,
    state: "REPLY"
};

const moreComment: CommentInfo = {
    commentList: [commentAuthor, commentOther, commentMore],
    commentItem: commentAuthor,
    state: "EDIT"
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

const commentMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: initComment, user: stubUserInitialState, rate: rateState });
const commentEditMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: editComment, user: stubUserInitialState, rate: rateState });
const commentReplyMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: replyComment, user: stubUserInitialState, rate: rateState });
const commentNotLoginReplyMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: replyComment, user: { ...stubUserInitialState, isLogin: false }, rate: rateState });
const commentMoreMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: moreComment, user: stubUserInitialState, rate: rateState });
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
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
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

        fireEvent.change(textBox, { target: { value: "edit_comment" } });
        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(1)
    });
    it("should render without errors EDIT & handle Edit More Comment", () => {
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
            <Provider store={commentMoreMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    it("should render without errors EDIT & handle Reply Comment", () => {
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
            <Provider store={commentMoreMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={11} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    it("should render without errors Reply & handle Edit Comment", () => {
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
            <Provider store={commentReplyMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("comments__create");
        expect(element).toHaveLength(1);

        const textBox = screen.getByRole("textbox")
        const addButton = screen.getByText("Add")

        fireEvent.change(textBox, { target: { value: "edit_comment" } });
        fireEvent.click(addButton)
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
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
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
    it("should not create reply when not login", async () => {
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
            <Provider store={commentNotLoginReplyMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const element = container.getElementsByClassName("comments__create");
        expect(element).toHaveLength(1);

        const textBox = screen.getByRole("textbox")
        const addButton = screen.getByText("Add")

        fireEvent.change(textBox, { target: { value: "edit_comment" } });
        fireEvent.click(addButton)
    });
})
