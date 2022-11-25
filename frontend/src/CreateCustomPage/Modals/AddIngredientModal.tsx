import Modal from 'react-modal';
import './AddIngredientModal.scss'
import React from 'react';
import { IngredientPrepareType } from '../../store/slices/cocktail/cocktail';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredientList, IngredientType, selectIngredient } from '../../store/slices/ingredient/ingredient';
import { useEffect } from 'react';
import { AppDispatch } from '../../store';

export interface IProps {
    isOpen: boolean;
    close: () => void;
    addedIngredientList: string[];
    setNewIngrdient: React.Dispatch<React.SetStateAction<IngredientType|null>>;
    setDefaultUnit: React.Dispatch<React.SetStateAction<string|null>>
}

const AddIngredientModal = (props: IProps) => {
    const { isOpen, close, addedIngredientList, setNewIngrdient, setDefaultUnit} = props;
    const ingredientState = useSelector(selectIngredient)
    const dispatch = useDispatch<AppDispatch>()

    const onClickIngredient = (ingredient: IngredientType) => {
        setNewIngrdient(ingredient);
        setDefaultUnit(ingredient.unit[0])
        close();
    };

    useEffect(() => {
        dispatch(fetchIngredientList())
    }, [])

    return (
        <Modal className="modal" isOpen={isOpen} ariaHideApp={false}>
            <div className="modal__ingredient-list">
                {ingredientState.ingredientList.map((ingredient, idx) => {
                    return (
                        <button key={`${ingredient.name}_${idx}`}
                            data-testid="ingredientButton"
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