import styles from './ShortComment.module.scss'
import React from 'react';
import { useNavigate } from 'react-router';
export interface CommentType {
    id: number
    cocktail: string;
    content: string;
    type: string;
}

const ShortComment = (prop: CommentType) => {

    const navigate = useNavigate()
    const onClickComment = () => {
        if (prop.type === 'CS') navigate(`/custom/${prop.id}`)
        else if (prop.type === 'ST') navigate(`/standard/${prop.id}`)
    }

    return <div className={styles.box} onClick={onClickComment}>
        <div className={styles.box__cocktail}>{prop.cocktail}</div>
        <div className={styles.box__content}>{prop.content}</div>
    </div>
}


export default ShortComment;