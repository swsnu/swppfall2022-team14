import { useEffect } from "react"
import React from 'react';
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import ShortComment from "./Components/ShortComment";
import { fetchMyCommentList, selectComment } from "../store/slices/comment/comment";




const MyComment = () => {

    const dispatch = useDispatch<AppDispatch>()
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
                    cocktail={commment.cocktail} content={commment.content} />;
            })}
        </div>
    </>
}


export default MyComment