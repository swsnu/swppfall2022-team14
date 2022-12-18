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
import { TextFieldProps } from "@mui/material";

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
        ABV: 10,
        price_per_glass: 10,
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
        ABV: 10,
        price_per_glass: 10,
    },
    author_id: 2,
    author_name: "username",
    content: "content2",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: 11, // if null comment is root comment
    is_deleted: false
};

const editComment: CommentInfo = {
    commentList: [commentAuthor, commentOther],
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

const commentEditMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: editComment, user: stubUserInitialState, rate: rateState });
const commentNotLoginEditMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: editComment, user: { ...stubUserInitialState, isLogin: false, token: null }, rate: rateState });
const commentReplyMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: replyComment, user: stubUserInitialState, rate: rateState });
const commentNotLoginReplyMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: replyComment, user: { ...stubUserInitialState, isLogin: false, token: null }, rate: rateState });
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

jest.spyOn(console, 'error').mockImplementation(() => {});

describe("<Comment />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should handle edit comment", () => {
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
            ABV: 10,
            price_per_glass: 10,
        }

        render(
            <Provider store={commentEditMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const items = screen.getAllByTestId("spyReply_2");
        expect(items).toHaveLength(1);
        const textField = screen.getByTestId("edit_comment_input").childNodes[0].childNodes[0];
        fireEvent.change(textField, { target: { value: "EDIT_CONTENT" } })
        const editButton = screen.getByText("수정");
        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(1)
    });
    it("should not create reply when not login", () => {
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
            ABV: 10,
            price_per_glass: 10,
        }

        render(
            <Provider store={commentNotLoginEditMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const textField = screen.getByTestId("edit_comment_input").childNodes[0].childNodes[0];
        fireEvent.change(textField, { target: { value: "EDIT_CONTENT" } })
        const editButton = screen.getByText("수정");
        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(0)
    });
    it("should handle edit comment", () => {
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
            ABV: 10,
            price_per_glass: 10,
        }

        render(
            <Provider store={commentEditMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const cancelButton = screen.getByText("취소");
        fireEvent.click(cancelButton)
        expect(mockDispatch).toBeCalledTimes(1)
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
            ABV: 10,
            price_per_glass: 10,
        }

        render(
            <Provider store={commentMoreMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={11} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    it("should render Comment without errors", () => {
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
            ABV: 10,
            price_per_glass: 10,
        }

        render(
            <Provider store={commentReplyMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const moreButton = screen.getByTestId("more_button")
        fireEvent.click(moreButton)

        const editButton = screen.getByTestId("edit_comment_button")
        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(1)

        const deleteButton = screen.getByTestId("delete_comment_button")
        fireEvent.click(deleteButton)
        expect(mockDispatch).toBeCalledTimes(2)
    });
    it("should handle reply Comment without errors", () => {
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
            ABV: 10,
            price_per_glass: 10,
        }

        render(
            <Provider store={commentReplyMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const moreButton = screen.getByTestId("more_button")
        fireEvent.click(moreButton)
        const createReplyButton = screen.getByTestId("reply_comment_button")
        fireEvent.click(createReplyButton)
        expect(mockDispatch).toBeCalledTimes(1)
    
        const replyTextField = screen.getByTestId("edit_comment_input").childNodes[0].childNodes[0];
        fireEvent.click(replyTextField)
        fireEvent.change(replyTextField, { target: { value: "REPLY_CONTENT" } })
        
        const replyButton = screen.getByText("댓글")
        fireEvent.click(replyButton)
        expect(mockDispatch).toBeCalledTimes(2)        
    });
    it("should handle cancel to reply Comment without errors", () => {
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
            ABV: 10,
            price_per_glass: 10,
        }

        render(
            <Provider store={commentReplyMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const moreButton = screen.getByTestId("more_button")
        fireEvent.click(moreButton)
        const createReplyButton = screen.getByTestId("reply_comment_button")
        fireEvent.click(createReplyButton)
        expect(mockDispatch).toBeCalledTimes(1)
    
        const replyTextField = screen.getByTestId("edit_comment_input")
        fireEvent.click(replyTextField)
        
        const cancelButton = screen.getByText("취소")
        fireEvent.click(cancelButton)
        expect(mockDispatch).toBeCalledTimes(2)        
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
            ABV: 10,
            price_per_glass: 10,
        }

        render(
            <Provider store={commentNotLoginReplyMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Comment key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const moreButton = screen.getByTestId("more_button")
        fireEvent.click(moreButton)
        const createReplyButton = screen.getByTestId("reply_comment_button")
        fireEvent.click(createReplyButton)
        expect(mockDispatch).toBeCalledTimes(1)
    
        const replyTextField = screen.getByTestId("edit_comment_input").childNodes[0].childNodes[0];
        fireEvent.click(replyTextField)
        fireEvent.change(replyTextField, { target: { value: "REPLY_CONTENT" } })
        
        const replyButton = screen.getByText("댓글")
        fireEvent.click(replyButton)
        expect(mockDispatch).toBeCalledTimes(1)
    });
})
