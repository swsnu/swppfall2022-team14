import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import MyIngredient from "./MyIngredient";
import MyBookmark from "./MyBookmark";
import MyCustomCocktail from "./MyCustomCocktail";

interface ButtonClickedCheck {
    isIngredient: boolean;
    isCustomcocktail: boolean;
    isFavorite: boolean;
    isComment: boolean;
    isInfo: boolean;
}
const MyPage = () => {

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    const buttonList = ['My Ingredient', 'My Custom Cocktail', 'My Favorites', 'My Comments', 'Info']
    const [buttonClickState, setButtonClickState] = useState<ButtonClickedCheck>({ isIngredient: false, isCustomcocktail: false, isFavorite: false, isComment: false, isInfo: false })
    const initButtonClickState: ButtonClickedCheck = { isIngredient: false, isCustomcocktail: false, isFavorite: false, isComment: false, isInfo: false }
    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.name === "My Ingredient")
            setButtonClickState({ ...initButtonClickState, isIngredient: true })
        else if (e.currentTarget.name === "My Custom Cocktail")
            setButtonClickState({ ...initButtonClickState, isCustomcocktail: true })
        else if (e.currentTarget.name === "My Favorites")
            setButtonClickState({ ...initButtonClickState, isFavorite: true })
        else if (e.currentTarget.name === "My Comments")
            setButtonClickState({ ...initButtonClickState, isComment: true })
        else if (e.currentTarget.name === "Info")
            setButtonClickState({ ...initButtonClickState, isInfo: true })
        console.log(`${e.currentTarget.name}clicked`)
    }

    return <div className={styles.main}>
        <div className={styles.left}>
            {buttonList.map((text, idx) => <button key={text} name={text} onClick={onButtonClick} disabled={Object.values(buttonClickState)[idx]}>{text}</button>)}
        </div>
        <div className={styles.right}>
            <div className={styles.right__inner}>
                {buttonClickState.isIngredient ? <MyIngredient /> :
                    buttonClickState.isCustomcocktail ? <MyCustomCocktail /> :
                        buttonClickState.isFavorite ? <MyBookmark /> :
                            buttonClickState.isComment ? null : null}
            </div>
        </div>
    </div >
}


export default MyPage