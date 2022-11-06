import styles from './ShortComment.module.scss'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { CocktailDetailType, CocktailItemType, selectCocktail } from '../../store/slices/cocktail/cocktail';
export interface CommentType {
    id: number
    cocktail_id: number;
    content: string;
}

const ShortComment = (prop: CommentType) => {

    const cocktailState = useSelector(selectCocktail)
    const navigate = useNavigate()

    const cocktail = cocktailState.cocktailList.find((c) => c.id=prop.cocktail_id) 

    if(!cocktail){
        return <div>Comment on Deleted Cocktail</div>
    }

    const onClickComment = () => {
        if (cocktail.type === 'CS') navigate(`/custom/${prop.id}`)
        else if (cocktail.type === 'ST') navigate(`/standard/${prop.id}`)
    }

    return <div className={styles.box} onClick={onClickComment}>
        <div className={styles.box__cocktail}>{cocktail.name}</div>
        <div className={styles.box__content}>{prop.content}</div>
    </div>
}


export default ShortComment;