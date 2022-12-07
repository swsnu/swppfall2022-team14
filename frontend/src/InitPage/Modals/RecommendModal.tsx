import { SetStateAction, Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import styles from './RecommendModal.module.scss'
import { AppDispatch } from '../../store';
import React from 'react';
import { getRecommendIngredientList, selectIngredient } from '../../store/slices/ingredient/ingredient';
import { selectUser } from '../../store/slices/user/user';
import IngredientItem from '../../common/Components/IngredientItem';
import { useNavigate } from 'react-router';

export interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const RecommendModal = (props: prop) => {
    const { isOpen, setIsOpen } = props;
    const dispatch = useDispatch<AppDispatch>();
    const ingredientState = useSelector(selectIngredient)
    const userState = useSelector(selectUser)

    useEffect(() => {
        if (userState.isLogin && userState.user?.id !== null) {
            dispatch(getRecommendIngredientList(userState.token))
        }

    }, [isOpen])

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
                {ingredientState.recommendIngredientList.map((ingredient) =>
                    <div key={ingredient.id} className={styles.container__item}>
                        <IngredientItem key={ingredient.id} image={ingredient.image} name={ingredient.name} ABV={ingredient.ABV} id={ingredient.id} />
                        {/* TODO: Component로 빼기 */}
                        {ingredientState.availableCocktails.find(info => info?.ingredient_id === ingredient.id) ? <div>이 재료만 있으면 만들 수 있는 칵테일들:
                            <div className={styles["container__cocktail-names"]}>
                                {ingredientState.availableCocktails.find(info => info.ingredient_id === ingredient.id)?.cocktails.map(cocktail => <div className={styles["container__cocktail-name"]} key={cocktail.id} onClick={() => onClickCocktailName(cocktail.id, cocktail.type)}>{cocktail.name}</div>)}
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