import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import reducer, {CommentInfo, deleteComment, commentActions} from "./comment";
import {fetchCommentListByCocktailId, fetchMyCommentList} from "./comment";
import {getComment, postComment, editComment} from "./comment"

describe("userInfo reducer", () => {
    let store: EnhancedStore<
        { comment: CommentInfo },
        AnyAction,
        [ThunkMiddleware<{ comment: CommentInfo }, AnyAction, undefined>]
        >;

    const fakeCommentRoot = {
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
        created_at: "2020-10-10",
        updated_at: "2020-10-10",
        parent_comment: null, // if null comment is root comment
        is_deleted: false
    }
    const fakeCommentChild = {
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
        author_id: 1,
        content: "content1",
        created_at: "2020-10-10",
        updated_at: "2020-10-10",
        parent_comment: 1, // if null comment is root comment
        is_deleted: false
    }

    beforeAll(() => {
        store = configureStore({ reducer: { comment: reducer } });
    });

    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            commentList: [],
            commentItem: null,
            state: null
        });
    });

    it("should handle fetchCommentListByCocktailId", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: {comments: [fakeCommentRoot]} });
        await store.dispatch(fetchCommentListByCocktailId(1));
        expect(store.getState().comment.commentList).toEqual([fakeCommentRoot])
    });
    it("should handle fetchMyCommentList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: {comments: [fakeCommentChild]} });
        await store.dispatch(fetchMyCommentList());
        expect(store.getState().comment.commentList).toEqual([fakeCommentChild])
    });

    it("should handle getComment", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: {comments: fakeCommentRoot} });
        await store.dispatch(getComment(1));
        expect(store.getState().comment.commentItem).toEqual(fakeCommentRoot)
        expect(store.getState().comment.commentItem?.id).toEqual(1)
    });

    it("should handle postComment Not Root", async () => {
        axios.post = jest.fn().mockResolvedValueOnce({ data: fakeCommentRoot });
        await store.dispatch(postComment({cocktail: 1, parent_comment: null, content: "content"}));
        const newComment = {
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
            author_id: 1,
            content: "content1",
            created_at: "2020-10-10",
            updated_at: "2020-10-10",
            parent_comment: 1, // if null comment is root comment
            is_deleted: false
        }
        expect(store.getState().comment.commentList).toEqual([newComment,fakeCommentRoot])

    });
    it("should handle postComment Root", async () => {
        axios.post = jest.fn().mockResolvedValueOnce({ data: fakeCommentChild });
        await store.dispatch(postComment({cocktail: 1, parent_comment: 1, content: "content"}));
        //expect(store.getState().comment.commentList).toEqual([fakeCommentChild])
    });

    it("should handle editComment", async () => {
        axios.post = jest.fn().mockResolvedValueOnce({ data: fakeCommentRoot });
        await store.dispatch(postComment({cocktail: 1, parent_comment: null, content: "content"}));

        const fakeCommentRootEdit = {
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
            content: "edit",
            created_at: "2020-10-10",
            updated_at: "2020-10-10",
            parent_comment: null, // if null comment is root comment
            is_deleted: false
        }
        axios.put = jest.fn().mockResolvedValue({data : fakeCommentRootEdit});
        await store.dispatch(editComment({content: "edit", id: 1}));

        //expect(store.getState().comment.commentList).toEqual([fakeCommentRootEdit])
    });
    it("should handle deleteComment deleted", async () => {
        axios.delete = jest.fn().mockResolvedValueOnce({ data: fakeCommentChild });
        await store.dispatch(deleteComment(2));
        //expect(store.getState().comment.commentList).toEqual([fakeCommentChild])
    });
    it("should handle deleteComment", async () => {
        axios.delete = jest.fn().mockResolvedValueOnce({ data: false });
        await store.dispatch(deleteComment(2));
        //expect(store.getState().comment.commentList).toEqual([fakeCommentChild])
    });

    it("should handle editCommentState", async () => {
        const create = new Date()
        const update = new Date()
        store.dispatch(commentActions.editCommentState({
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
            author_id: 1,
            content: "content1",
            created_at: create,
            updated_at: update,
            parent_comment: 1, // if null comment is root comment
            is_deleted: false
        }));
        //expect(store.getState().comment.commentList).toEqual([fakeCommentChild])
    });
    it("should handle replyCommentState", async () => {
        const create = new Date()
        const update = new Date()
        store.dispatch(commentActions.replyCommentState({
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
            author_id: 1,
            content: "content1",
            created_at: create,
            updated_at: update,
            parent_comment: 1, // if null comment is root comment
            is_deleted: false
        }));
        //expect(store.getState().comment.commentList).toEqual([fakeCommentChild])
    });

});