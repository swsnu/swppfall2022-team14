import { useNavigate } from "react-router"
import styles from './Item.module.scss'
import React from 'react';
import { CocktailItemType } from "../../store/slices/cocktail/cocktail";


const Item = (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => {

    const navigate = useNavigate()
    const onClickItem = () => {
        if (prop.type === 'CS') navigate(`/custom/${prop.id}`)
        else navigate(`/standard/${prop.id}`)
    }

    return <div className={styles.item} onClick={onClickItem}>
        <img className={styles.item__image} src={prop.image} />
        <div className={styles.item__name}>{prop.name}</div>
        <div className={styles.item__rate}>{prop.rate} / 5점</div>
        <div className={styles.item__tags}>
            {prop.tags.map(tag => { return <div className={styles.item__tag} key={tag}>#{tag} </div> })}
        </div>


    </div>
}


export default Item