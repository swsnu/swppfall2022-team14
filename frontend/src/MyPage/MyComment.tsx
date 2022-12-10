import { useEffect } from "react"
import React from 'react';
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import ShortComment from "./Components/ShortComment";
import { fetchMyCommentList, selectComment } from "../store/slices/comment/comment";
import { selectUser } from "../store/slices/user/user";
import { Stack } from "@mui/material";

const MyComment = () => {

    const dispatch = useDispatch<AppDispatch>()
    const commentState = useSelector(selectComment)
    const userState = useSelector(selectUser)

    useEffect(() => {
        if(userState.token !== null){
            dispatch(fetchMyCommentList(userState.token))
        }
    }, [])

    return (
        <Stack spacing={5} sx={{ width: 0.7 }}>
            {[...commentState.commentList].reverse().map((comment) => (
                <ShortComment 
                    key={comment.id} 
                    id={comment.id}
                    cocktail={comment.cocktail} 
                    content={comment.content} 
                    updated_at={comment.updated_at}
                />
            ))}
        </Stack>
    )
}


export default MyComment