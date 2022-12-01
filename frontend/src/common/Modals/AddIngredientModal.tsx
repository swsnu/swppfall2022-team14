import { useState, SetStateAction, Dispatch, KeyboardEvent, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './AddIngredientModal.module.scss'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredientList, fetchMyIngredientList, IngredientType, PostIngredientProps, postMyIngredients, selectIngredient } from '../../store/slices/ingredient/ingredient';
import { AppDispatch } from '../../store';
interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    user_id: number;
}


const AddIngredientModal = (props: prop) => {

    const { isOpen, setIsOpen, user_id } = props;
    const ingredientState = useSelector(selectIngredient)
    const dispatch = useDispatch<AppDispatch>()
    const [newIngredients, setNewIngredients] = useState<number[]>([]);

    const onClickIngredient = (ingredient_id: number) => {
        setNewIngredients([...newIngredients, ingredient_id]);
    };


    const onClickEdit = (body: PostIngredientProps) => {
        dispatch(postMyIngredients(body))
        dispatch(fetchMyIngredientList())
        setNewIngredients([])
        setIsOpen(false)
    }
    const onClickClose = () => {
        setNewIngredients([])
        setIsOpen(false)
    }
    const is_not_my_ingredient_filter = (ingredient: IngredientType) => {

        const my_ingredient_id_list = ingredientState.myIngredientList.map(ingredient => ingredient.id)
        return !my_ingredient_id_list.includes(ingredient.id)
    }

    return (
        <Modal className={styles['add-ingredient-modal']} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <div className="modal__ingredient-list">
                {ingredientState.ingredientList.filter(ingredient => is_not_my_ingredient_filter(ingredient)).map((ingredient, idx) => {
                    return (
                        <button key={`${ingredient.name}_${idx}`}
                            data-testid="ingredientButton"
                            className='modal__ingredient'
                            onClick={() => onClickIngredient(ingredient.id)}
                            disabled={newIngredients.includes(ingredient.id)}
                        >
                            {ingredient.name}
                        </button>
                    )
                })}
            </div>
            <button className='modal__close-button' onClick={onClickClose}>X</button>
            <button className='modal__add-button' onClick={() => onClickEdit({ id: user_id, ingredients: newIngredients })}>Add</button>
        </Modal >
    );
};

export default AddIngredientModal;