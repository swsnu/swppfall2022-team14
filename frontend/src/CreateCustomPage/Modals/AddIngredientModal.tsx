import Modal from 'react-modal';
import './AddIngredientModal.scss'
import React from 'react';
import { IngredientPrepareType } from '../../store/slices/cocktail/cocktail';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredientList, IngredientType, selectIngredient } from '../../store/slices/ingredient/ingredient';
import { useEffect } from 'react';
import { AppDispatch } from '../../store';

interface IProps {
    isOpen: boolean;
    close: () => void;
    addedIngredientList: string[];
    setNewIngrdient: React.Dispatch<React.SetStateAction<IngredientType|null>>;
}

const AddIngredientModal = (props: IProps) => {
    const { isOpen, close, addedIngredientList, setNewIngrdient } = props;
    const ingredientState = useSelector(selectIngredient)
    const dispatch = useDispatch<AppDispatch>()

    const onClickIngredient = (ingredient: IngredientType) => {
        setNewIngrdient(ingredient);
        close();
    };

    useEffect(() => {
        dispatch(fetchIngredientList())
    }, [])

    return (
        <Modal className="modal" isOpen={isOpen}>
            <div className="modal__ingredient-list">
                {ingredientState.ingredientList.map((ingredient, idx) => {
                    return (
                        <button key={`${ingredient.name}_${idx}`}
                            className='modal__ingredient'
                            onClick={() => onClickIngredient(ingredient)}
                            disabled={addedIngredientList.includes(ingredient.name)}
                        >
                            {ingredient.name}
                        </button>
                    )
                })}
            </div>
            <button className='modal__close-button' onClick={close}>Close</button>
        </Modal>
    )
};

export default AddIngredientModal;