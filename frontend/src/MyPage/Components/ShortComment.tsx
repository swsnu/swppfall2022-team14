import styles from './ShortComment.module.scss'
import React from 'react';
import { useNavigate } from 'react-router';
import { CocktailItemType } from '../../store/slices/cocktail/cocktail';
export interface CommentType {
    id: number
    cocktail: CocktailItemType;
    content: string;
}

const ShortComment = (prop: CommentType) => {

    const navigate = useNavigate()

    const onClickComment = () => {
        if (prop.cocktail.type === 'CS') navigate(`/custom/${prop.cocktail.id}`)
        else navigate(`/standard/${prop.cocktail.id}`)
    }

    return <div className={styles.box} onClick={onClickComment}>
        <div className={styles.box__cocktail}>{prop.cocktail.name}</div>
        <div className={styles.box__content}>{prop.content}</div>
    </div>
}


export default ShortComment;