import { useNavigate } from "react-router"
import { CocktailDetailType } from "../../store/slices/cocktail/cocktail";
import styles from './Item.module.scss'
import React from 'react';

// TODO : MODIFY THIS WITH IngredientItemType
const IngredientItem = (prop: Pick<CocktailDetailType, "image" | "name" | "ABV" | "id">) => {

    const navigate = useNavigate()


    const onClickItem = () => {
        navigate(`/ingredient/${prop.id}`)
    }

    return <div className={styles.item} onClick={onClickItem}>
        <img className={styles.item__image} src={prop.image} />
        <div className={styles.item__name}>{prop.name}</div>
        <div className={styles.item__rate}>{prop.ABV} 도</div>

    </div>
}


export default IngredientItem