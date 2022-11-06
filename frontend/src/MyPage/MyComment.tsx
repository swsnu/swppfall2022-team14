import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { CocktailDetailType, fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import ShortComment, { CommentType } from "./Components/ShortComment";
import { fetchMyCommentList, selectComment } from "../store/slices/comment/comment";




const MyComment = () => {

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    const buttonList = ['My liqour', 'My Custom Cocktail', 'My Favorites', 'My Comments', 'Info']
    const commentState = useSelector(selectComment)

    useEffect(() => {
        dispatch(fetchMyCommentList())
    }, [])

    return <>
        <div className={styles['right__header--comment']}>
            <div className={styles.right__sort}>sort</div>
        </div>
        댓글 목록
        <div className={styles['right__main--comment']}>
            {commentState.commentList.map(commment => {
                return <ShortComment key={commment.id} id={commment.id}
                    cocktail_id={commment.cocktail} content={commment.content} />;
            })}
        </div>
    </>
}


export default MyComment