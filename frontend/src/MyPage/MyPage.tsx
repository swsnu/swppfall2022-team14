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
import MyComment from "./MyComment";
import MyInfo from "./MyInfo";
interface ButtonInfo {
    name: string;
    component: JSX.Element;
}

const MyPage = () => {

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    const buttonList: ButtonInfo[] = [{ name: 'My Ingredient', component: <MyIngredient /> },
    { name: 'My Custom Cocktail', component: < MyCustomCocktail /> },
    { name: 'My Favorites', component: <MyBookmark /> },
    { name: 'My Comments', component: <MyComment /> },
    { name: 'Info', component: <MyInfo /> }]

    const [buttonClickState, setButtonClickState] = useState<string>("My Ingredient")
    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setButtonClickState(e.currentTarget.name)
    }


    return <div className={styles.main}>
        <div className={styles.left}>
            {buttonList.map((button) => <button key={button.name} name={button.name} onClick={onButtonClick} disabled={buttonClickState === button.name}>{button.name}</button>)}
        </div>
        <div className={styles.right}>
            <div className={styles.right__inner}>
                {/* 클릭된 버튼의 name으로 buttonList에서 component를 찾아 Render 
                    추후 항목이 추가되면 buttonList를 수정하면 됨.*/}
                {buttonList.filter(button => button.name == buttonClickState)[0].component}
            </div>
        </div>
    </div >
}


export default MyPage