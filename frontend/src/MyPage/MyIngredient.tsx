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
import { fetchMyIngredientList, selectIngredient } from "../store/slices/ingredient/ingredient";
import {selectUser} from "../store/slices/user/user";
const MyIngredient = () => {
    const dummy_user_id = 4
    const ingredientState = useSelector(selectIngredient)
    const dispatch = useDispatch<AppDispatch>()
    const userState = useSelector(selectUser)

    useEffect(() => {
        dispatch(fetchMyIngredientList(Number(userState.user?.id)))
    }, [])

    const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
    const onClickAdd = () => {
        setIsAddIngredientOpen(true)
    }


    return <>
        <div className={styles.right__header}>
            <button onClick={onClickAdd}>Add</button>
            <div className={styles.right__sort}>sort</div>
        </div>
        <div className={styles.right__main}>
            {ingredientState.myIngredientList.map(ingredient => <IngredientItem key={ingredient.id} image={ingredient.image} name={ingredient.name} id={ingredient.id} ABV={ingredient.ABV} my_item={true} />)}
        </div>
        <AddIngredientModal isOpen={isAddIngredientOpen} setIsOpen={setIsAddIngredientOpen} user_id={dummy_user_id} />
    </>
}


export default MyIngredient