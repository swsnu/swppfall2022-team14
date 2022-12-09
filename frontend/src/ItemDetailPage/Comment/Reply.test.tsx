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
import { TextFieldProps } from "@mui/material";

// eslint-disable-next-line react/display-name
jest.mock("@mui/material/TextField/TextField", () => (props:TextFieldProps) => (
    <input onClick={props.onClick} onChange={props.onChange} data-testid={'edit_comment_input'} value={props.value as string}/>
));
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
const replyComment: CommentInfo = {
    commentList: [commentAuthor],
    commentItem: commentAuthor,
    state: "REPLY"
};
const commentEditMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: editComment, user: stubUserInitialState, rate: rateState });
const commentNotLoginEditMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: editComment, user: { ...stubUserInitialState, isLogin: false, token: null }, rate: rateState });
const commentReplyMockStore = getMockStore({ cocktail: emptyCocktail, ingredient: emptyIngredient, comment: replyComment, user: stubUserInitialState, rate: rateState });

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

    it("should handle edit Comment", () => {
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

        render(
            <Provider store={commentEditMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Reply key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const textField = screen.getByTestId("edit_comment_input")
        fireEvent.change(textField, { target: { value: "EDIT_CONTENT" } })
        const editButton = screen.getByText("수정");
        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(1)
    });
    it("should handle cancel to edit Comment", () => {
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

        render(
            <Provider store={commentEditMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Reply key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const editButton = screen.getByText("취소");
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
        }

        render(
            <Provider store={commentNotLoginEditMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Reply key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const textField = screen.getByTestId("edit_comment_input")
        fireEvent.change(textField, { target: { value: "EDIT_CONTENT" } })
        const editButton = screen.getByText("수정");
        fireEvent.click(editButton)
        expect(mockDispatch).toBeCalledTimes(0)
    });

    it("should render not edit state reply without errors", () => {
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

        render(
            <Provider store={commentReplyMockStore}>
                <MemoryRouter initialEntries={['/custom/1']}>
                    <Routes>
                        <Route path="/:type/:id" element={<Reply key={"1_comment"} id={1} author_id={1} author_name={"username"} content={"content"} created_at={create} updated_at={update} parent_comment={null} is_deleted={false} cocktail={cocktail} accessible />}/>
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
})