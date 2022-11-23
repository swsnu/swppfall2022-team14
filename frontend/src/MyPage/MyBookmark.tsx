import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { CocktailDetailType, CocktailItemType, fetchCustomCocktailList, fetchMyBookmarkCocktailList, fetchMyCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import Item from "../common/Components/Item";


const MyBookmark = () => {

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchMyBookmarkCocktailList())
    }, [])

    return <>
        <div className={styles['right__header--comment']}>
            <div className={styles.right__sort}>sort</div>
        </div>
        <div className={styles.right__main}>
            {cocktailState.cocktailList.map(cocktail => {
                return <Item key={cocktail.id} image={cocktail.image}
                    name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} tags={cocktail.tags} />;
            })}
        </div>
    </>
}


export default MyBookmark