import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "../.."

export interface CommentType {
    id: number,
    cocktail_id: number,
    author_id: number,
    content: string,
    created_at: Date,
    updated_at: Date,
    parent: number | null // if null comment is root comment
}

export interface CommentInfo {
    commentList: CommentType[]
    commentItem: CommentType | null
}

const initialState: CommentInfo = {
    commentList: [{
        id: 1,
        cocktail_id: 1,
        author_id: 1,
        content: 'COMMENT1',
        created_at: new Date(2022, 10, 2),
        updated_at: new Date(2022, 10, 2),
        parent: null
    },
    {
        id: 2,
        cocktail_id: 1,
        author_id: 2,
        content: 'COMMENT2',
        created_at: new Date(2022, 10, 10),
        updated_at: new Date(2022, 10, 10),
        parent: 1
    },
    {
        id: 3,
        cocktail_id: 2,
        author_id: 1,
        content: 'COMMENT3',
        created_at: new Date(2022, 11, 1),
        updated_at: new Date(2022, 11, 3),
        parent: null
    }],
    commentItem: null
}

export const fetchCommentListByCocktailId = createAsyncThunk(
    "comment/fetchCommentListByCocktailId", async (cocktail_id) => {
        const response = await axios.get(`/api/v1/comment/cocktails/${cocktail_id}/`)
        return response.data
    }
)

export const fetchMyCommentList = createAsyncThunk(
    "comment/fetchMyCommentList", async () => {
        const response = await axios.get('/api/v1/comment/me/')
        return response.data
    }
)

export const getComment = createAsyncThunk(
    "comment/getComment", async (id) => {
        const response = await axios.get(`/api/v1/comment/${id}/`)
        return response.data
    }
)

export const postComment = createAsyncThunk(
    "comment/postComment", async (comment: Pick<CommentType, "content"|"parent"|"cocktail_id">, {dispatch}) => {
        const response = await axios.post(`/api/v1/comment/cocktails/${comment.cocktail_id}/`, {
            "content": comment.content,
            "parent": comment.parent
        })
        dispatch(commentActions.addComment(response.data))
    }
)

export const editComment = createAsyncThunk(
    "comment/editComment", async (comment: Pick<CommentType, "content"|"id">, {dispatch}) => {
        const response = await axios.put(`/api/v1/comment/${comment.id}/`, {
            "content": comment.content,
        })
        dispatch(commentActions.editComment(response.data))
    }
)

export const deleteComment = createAsyncThunk(
    "comment/deleteComment", async (id: number, {dispatch}) => {
        const response = await axios.put(`/api/v1/comment/${id}/`)
        dispatch(commentActions.deleteComment(id))
    }
)

export const CommentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        addComment: (state, action: PayloadAction<CommentType>) => {
            state.commentList.push(action.payload)
        },
        editComment: (state, action: PayloadAction<CommentType>) => {
            state.commentList.map((comment) => {
                return comment.id == action.payload.id ? action.payload : comment
            });
        },
        deleteComment: (state, action) => {
            const deleted = state.commentList.filter((comment) => {
                return comment.id != action.payload.id;
            });
            state.commentList = deleted
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCommentListByCocktailId.fulfilled, (state, action) => {
            state.commentList = action.payload
        });
        builder.addCase(fetchMyCommentList.fulfilled, (state, action) => {
            state.commentList = action.payload
        });
        builder.addCase(getComment.fulfilled, (state, action) => {
            state.commentItem = action.payload
        });
        builder.addCase(postComment.rejected, (_state, action) => {
            console.error(action.error)
        });
        builder.addCase(editComment.rejected, (_state, action) => {
            console.error(action.error)
        });
        builder.addCase(deleteComment.rejected, (_state, action) => {
            console.error(action.error)
        });
    }
})

export const commentActions = CommentSlice.actions
export const selectComment = (state: RootState) => state.cocktail

export default CommentSlice.reducer