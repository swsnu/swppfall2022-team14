import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "../.."

export interface CommentType {
    id: number,
    cocktail: number,
    author_id: number,
    content: string,
    created_at: Date,
    updated_at: Date,
    parent_comment: number | null // if null comment is root comment
    is_deleted: boolean
}

export interface CommentInfo {
    commentList: CommentType[]
    commentItem: CommentType | null
}

const initialState: CommentInfo = {
    commentList: [],
    commentItem: null
}

export const fetchCommentListByCocktailId = createAsyncThunk(
    "comment/fetchCommentListByCocktailId", async (cocktail_id: CommentType["cocktail"]) => {
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
    "comment/postComment", async (comment: Pick<CommentType, "content"|"parent_comment"|"cocktail">, {dispatch}) => {
        const response = await axios.post(`/api/v1/comment/cocktails/${comment.cocktail}/?parent_comment=${comment.parent_comment}`, {
            "content": comment.content,
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
        await axios.put(`/api/v1/comment/${id}/`)
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
            state.commentList = action.payload.comments
        });
        builder.addCase(fetchMyCommentList.fulfilled, (state, action) => {
            state.commentList = action.payload.comments
        });
        builder.addCase(getComment.fulfilled, (state, action) => {
            state.commentItem = action.payload.comments
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
export const selectComment = (state: RootState) => state.comment

export default CommentSlice.reducer