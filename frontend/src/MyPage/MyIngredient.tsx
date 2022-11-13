import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { CocktailDetailType, fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"
import Item from "../common/Components/Item"
import AddIngredientModal from "../common/Modals/AddIngredientModal";




import ItemDetailPage from "../ItemDetailPage/ItemDetailPage";
import IngredientItem from "../common/Components/IngredientItem";
import { fetchIngredientList, selectIngredient } from "../store/slices/ingredient/ingredient";
const MyIngredient = () => {
    const ingredientState = useSelector(selectIngredient)
    const dispatch = useDispatch<AppDispatch>()
    const buttonList = ['My liqour', 'My Custom Cocktail', 'My Favorites', 'My Comments', 'Info']
    const [isInitMyLiqourOpen, setIsInitMyLiqourOpen] = useState(false);
    const onClickAdd = () => {
        setIsInitMyLiqourOpen(true)
    }

    useEffect(() => {
        dispatch(fetchIngredientList())
    })



    return <>
        <div className={styles.right__header}>
            <button onClick={onClickAdd}>Add</button>
            <div className={styles.right__sort}>sort</div>
        </div>
        <div className={styles.right__main}>
            {ingredientState.ingredientList.map(ingredient => <IngredientItem key={ingredient.id} image={ingredient.image} name={ingredient.name} id={ingredient.id} ABV={ingredient.ABV} />)}
        </div>
        <AddIngredientModal isOpen={isInitMyLiqourOpen} setIsOpen={setIsInitMyLiqourOpen} />
    </>
}


export default MyIngredient