import { useState } from "react"
import React from 'react';
import { useSelector } from "react-redux"
import styles from "./MyPage.module.scss"
import AddIngredientModal from "../common/Modals/AddIngredientModal";
import IngredientItem from "../common/Components/IngredientItem";
import { selectIngredient } from "../store/slices/ingredient/ingredient";
import { selectUser } from "../store/slices/user/user";
const MyIngredient = () => {
    const ingredientState = useSelector(selectIngredient)
    const userState = useSelector(selectUser)


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
        <AddIngredientModal isOpen={isAddIngredientOpen} setIsOpen={setIsAddIngredientOpen} user_id={Number(userState.user?.id)} />
    </>
}


export default MyIngredient