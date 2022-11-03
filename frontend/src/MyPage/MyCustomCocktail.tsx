import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { CocktailDetailType, fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import Item from "../common/Item";


const MyCustomCocktail = () => {

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    const buttonList = ['My liqour', 'My Custom Cocktail', 'My Favorites', 'My Comments', 'Info']
    const dummyCocktails: Pick<CocktailDetailType, "image" | "name" | "rate" | "id" | "type">[] =
        [{
            id: 1,
            name: 'name',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            type: 'CS',
            rate: 4.8
        }, {
            id: 2,
            name: 'name2',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            type: 'CS',
            rate: 3.4
        }, {
            id: 3,
            name: 'name3',
            image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
            type: 'CS',
            rate: 5.0
        }]
    return <>
        <div className={styles.right__header}>
            <button>Add</button>
            <div className={styles.right__sort}>sort</div>
        </div>
        <div className={styles.right__main}>
            {dummyCocktails.map(cocktail => {
                return <Item key={cocktail.id} image={cocktail.image}
                    name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} />;
            })}
        </div>
    </>
}


export default MyCustomCocktail