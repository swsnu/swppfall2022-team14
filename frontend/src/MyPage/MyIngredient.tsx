import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { CocktailDetailType, fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import Item from "../common/Item"




import ItemDetailPage from "../ItemDetailPage/ItemDetailPage";
import IngredientItem from "../common/IngredientItem";
const MyIngredient = () => {
    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    const buttonList = ['My liqour', 'My Custom Cocktail', 'My Favorites', 'My Comments', 'Info']


    const dummy: Pick<CocktailDetailType, "image" | "name" | "ABV" | "id">[] = [
        {
            id: 1,
            name: 'name',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            ABV: 42.4,
        }, {
            id: 2,
            name: 'name2',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            ABV: 42.4,

        }, {
            id: 3,
            name: 'name3',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            ABV: 42.4,
        },
        {
            id: 4,
            name: 'name4',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            ABV: 42.4,
        },
        {
            id: 5,
            name: 'name5',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            ABV: 42.4,
        },
        {
            id: 6,
            name: 'name6',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            ABV: 42.4,
        },
        {
            id: 7,
            name: 'name7',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            ABV: 42.4,
        },
    ]


    return <>
        <div className={styles.right__header}>
            <button>Add</button>
            <div className={styles.right__sort}>sort</div>
        </div>
        <div className={styles.right__main}>
            {dummy.map(ingredient => <IngredientItem key={ingredient.id} image={ingredient.image} name={ingredient.name} id={ingredient.id} ABV={ingredient.ABV} />)}
        </div>
    </>
}


export default MyIngredient