import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "../.."
import { CocktailItemType } from "../cocktail/cocktail"
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface CommentType {
    id: number,
    cocktail: CocktailItemType,
    author_id: number,
    author_name: string,
    content: string,
    created_at: Date,
    updated_at: Date,
    parent_comment: number | null // if null comment is root comment
    is_deleted: boolean
}

export interface CommentInfo {
    commentList: CommentType[]
    commentItem: CommentType | null,
    state: "EDIT" | "REPLY" | null
}

const initialState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null
}

export const fetchCommentListByCocktailId = createAsyncThunk(
    "comment/fetchCommentListByCocktailId", async (cocktail_id: CocktailItemType["id"]) => {
        const response = await axios.get(`/api/v1/comment/cocktails/${cocktail_id}/`)
        return response.data
    }
)

export const fetchMyCommentList = createAsyncThunk(
    "comment/fetchMyCommentList", async (token: string) => {
        const response = await axios.get('/api/v1/comment/me/',{
            headers: {
                Authorization: `Token ${token}`,
            },
        })
        return response.data
    }
)

export const getComment = createAsyncThunk(
    "comment/getComment", async (id: string | number) => {
        const response = await axios.get(`/api/v1/comment/${id}/`)
        return response.data
    }
)

export const postComment = createAsyncThunk(
    "comment/postComment", async (comment: { cocktail: number, parent_comment: number | null, content: string, token: string } ,{ dispatch }) => {
        if (comment.parent_comment) {
            const response = await axios.post(`/api/v1/comment/cocktails/${comment.cocktail}/post/?parent_comment=${comment.parent_comment}`, {
                "content": comment.content,
            },{
                headers: {
                    Authorization: `Token ${comment.token}`,
                },
            })
            dispatch(commentActions.addComment(response.data))
        } else {
            const response = await axios.post(`/api/v1/comment/cocktails/${comment.cocktail}/post/`, {
                "content": comment.content,
            },{
                headers: {
                    Authorization: `Token ${comment.token}`,
                },
            })
            dispatch(commentActions.addComment(response.data))
        }
    }
)

export const editComment = createAsyncThunk(
    "comment/editComment", async (comment: Pick<CommentType, "content" | "id" | "author_name">, { dispatch }) => {
        const response = await axios.put<CommentType>(`/api/v1/comment/${comment.id}/edit/`, {
            "content": comment.content,
        },{
            headers: {
                Authorization: `Token ${comment.author_name}`,
            },
        })
        dispatch(commentActions.editComment(response.data))
    }
)

export const deleteComment = createAsyncThunk(
    "comment/deleteComment", async (data: {id: number, token: string | null}, { dispatch }) => {
        const response = await axios.delete(`/api/v1/comment/${data.id}/delete/`,{
            headers: {
                Authorization: `Token ${data.token}`,
            },
        })
        if (response.data) {
            dispatch(commentActions.setIsDeletedComment(response.data))
        } else {
            dispatch(commentActions.deleteComment({ targetId: data.id }))
        }
    }
)

export const CommentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        addComment: (state, action: PayloadAction<CommentType>) => {
            state.commentList.push(action.payload)
            state.commentItem = null
            state.state = null
        },
        editComment: (state, action: PayloadAction<CommentType>) => {
            state.commentList.forEach((c, i) => {
                if (c.id === action.payload.id) {
                    state.commentList[i].content = action.payload.content
                }
            })
            state.commentItem = null
            state.state = null
        },
        deleteComment: (state, action: PayloadAction<{ targetId: number }>) => {
            const deleted = state.commentList.filter((comment) => {
                return comment.id != action.payload.targetId;
            });
            state.commentList = deleted
            state.commentItem = null
            state.state = null
        },
        setIsDeletedComment: (state, action: PayloadAction<CommentType>) => {
            state.commentList.forEach((c, i) => {
                if (c.id === action.payload.id) {
                    state.commentList[i] = action.payload
                }
            })
            state.commentItem = null
            state.state = null
        },
        nullCommentState: (state, action: PayloadAction<CommentType>) => {
            state.commentItem = action.payload
            state.state = null
        },
        editCommentState: (state, action: PayloadAction<CommentType>) => {
            state.commentItem = action.payload
            state.state = "EDIT"
        },
        replyCommentState: (state, action: PayloadAction<CommentType>) => {
            state.commentItem = action.payload
            state.state = "REPLY"
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