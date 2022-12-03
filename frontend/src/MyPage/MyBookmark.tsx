import { useEffect } from "react"
import React from 'react';
import { fetchMyBookmarkCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import Item from "../common/Components/Item";
import { selectUser } from "../store/slices/user/user";


const MyBookmark = () => {

    const cocktailState = useSelector(selectCocktail)
    const userState = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        if (userState.isLogin && userState.token) {
            dispatch(fetchMyBookmarkCocktailList(userState.token))
        }
    }, [])

    return <>
        <div className={styles['right__header--comment']}>
            <div className={styles.right__sort}>sort</div>
        </div>
        <div className={styles.right__main}>
            {cocktailState.listStatus !== 'success' ? "" : cocktailState.cocktailList.map(cocktail => {
                return <Item key={cocktail.id} image={cocktail.image}
                    name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} tags={cocktail.tags} />;
            })}
        </div>
    </>
}


export default MyBookmark