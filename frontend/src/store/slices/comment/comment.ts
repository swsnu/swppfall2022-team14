import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

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
    "comment/fetchCommentListByCocktailId", async (id) => {
        const response = await axios.get(`/api/v1/comment/cocktails/${id}/`)
        return response.data
    }
)

export const fetchMyCommentList = createAsyncThunk(
    "comment/fetchMyCommentList", async () => {
        const response = await axios.get('/api/v1/comment/me/')
        return response.data
    }
)

export const CommentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCommentListByCocktailId.fulfilled, (state, action) => {
            state.commentList = action.payload
        })
    }
})