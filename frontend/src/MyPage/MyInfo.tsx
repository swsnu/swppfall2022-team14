import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"


const MyInfo = () => {

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    const buttonList = ['My liqour', 'My Custom Cocktail', 'My Favorites', 'My Comments', 'Info']

    return <div className={styles.main}>
        <div className={styles.left}>
            {buttonList.map(text => <button key={text}>{text}</button>)}
        </div>
        <div className={styles.right}>
            <div className={styles.right__inner}>
                <div className={styles.right__header}>
                    <button>Add</button>
                    <div className={styles.right__sort}>sort</div>
                </div>
                <div className={styles.right__main}></div>
            </div>
        </div>
    </div>
}


export default MyInfo