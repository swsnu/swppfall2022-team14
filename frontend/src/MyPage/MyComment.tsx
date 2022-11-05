import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { CocktailDetailType, fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import Item from "../common/Item";
import ShortComment, { CommentType } from "./Components/ShortComment";




const MyComment = () => {

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    const buttonList = ['My liqour', 'My Custom Cocktail', 'My Favorites', 'My Comments', 'Info']
    const dummyComments: CommentType[] =
        [{ id: 1, cocktail: "올드패션드", content: "맛있어요", type: "CS" },
        { id: 2, cocktail: "진토닉", content: "맛없어요", type: "ST" },
        { id: 3, cocktail: "피치크러시", content: "맛있어요", type: "CS" },
        { id: 4, cocktail: "쿠바리브레", content: "맛없어요", type: "ST" },
        ]
    return <>
        <div className={styles['right__header--comment']}>
            <div className={styles.right__sort}>sort</div>
        </div>
        댓글 목록
        <div className={styles['right__main--comment']}>
            {dummyComments.map(commment => {
                return <ShortComment key={commment.id} id={commment.id} type={commment.type}
                    cocktail={commment.cocktail} content={commment.content} />;
            })}
        </div>
    </>
}


export default MyComment