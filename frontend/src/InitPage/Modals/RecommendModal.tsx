import { useState, SetStateAction, Dispatch, KeyboardEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import styles from './RecommendModal.module.scss'
import { AppDispatch } from '../../store';
import React from 'react';
import { getRecommendIngredientList, IngredientType } from '../../store/slices/ingredient/ingredient';
import IngredientItem from '../../common/Components/IngredientItem';
import { useNavigate } from 'react-router';
import { type } from 'os';

export interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}


interface CocktailShortInfo {
    name: string;
    type: string;
    id: 1;
}

interface AvailableCocktailMap {
    ingredient_id: number;
    cocktails: CocktailShortInfo[]

}

const RecommendModal = (props: prop) => {
    const { isOpen, setIsOpen } = props;
    const dispatch = useDispatch<AppDispatch>();
    const [ingredients, setIngredients] = useState<IngredientType[]>([])
    const [availableCocktailsArray, setAvailableCocktailsArray] = useState<AvailableCocktailMap[]>([])

    useEffect(() => {
        async function getRecommend() {
            const recommend = await dispatch(getRecommendIngredientList())
            setIngredients(recommend.payload.Ingredients)
            setAvailableCocktailsArray(recommend.payload.possible_cocktails)
            console.log(recommend.payload.possible_cocktails) // array of cocktail array
            console.log(availableCocktailsArray)
        }

        getRecommend()
    }, [isOpen])

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') {
            // TODO : IMPLEMENT THIS
        }
    };


    const onClickClose = () => {
        setIsOpen(false)
    }


    const navigate = useNavigate()
    const onClickCocktailName = (id: number, type: string) => {
        if (type === 'ST') navigate(`/standard/${id}`)
        else if (type === 'CS') navigate(`/custom/${id}`)
    }


    return (
        <Modal className={styles['recommend-modal']} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <button onClick={onClickClose} > X</button >
            <div className={styles.container}>
                {ingredients.map((ingredient) =>
                    <div key={ingredient.id} className={styles.container__item}>
                        <IngredientItem key={ingredient.id} image={ingredient.image} name={ingredient.name} ABV={ingredient.ABV} id={ingredient.id} />
                        {/* TODO: Component로 빼기 */}
                        {availableCocktailsArray.find(info => info?.ingredient_id === ingredient.id) ? <div>이 재료만 있으면 만들 수 있는 칵테일들:
                            <div className={styles["container__cocktail-names"]}>
                                {availableCocktailsArray.find(info => info.ingredient_id === ingredient.id)?.cocktails.map(cocktail => <div className={styles["container__cocktail-name"]} key={cocktail.id} onClick={() => onClickCocktailName(cocktail.id, cocktail.type)}>{cocktail.name}</div>)}
                            </div>
                        </div>
                            : "통상적으로 많이 들어가는 재료"
                        }
                    </div>

                )}
            </div>
        </Modal >
    );
};

export default RecommendModal;