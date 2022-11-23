import { SetStateAction, Dispatch, KeyboardEvent } from 'react';
import Modal from 'react-modal';
import styles from './InitMyLiquorModal.module.scss'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIngredient } from '../../store/slices/ingredient/ingredient';
import { AppDispatch } from '../../store';
import { selectUser } from '../../store/slices/user/user';
import IngredientItem from '../../common/Components/IngredientItem';
export interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const InitMyLiqourModal = (props: prop) => {

    const { isOpen, setIsOpen } = props;
    const ingredientState = useSelector(selectIngredient)
    const dispatch = useDispatch<AppDispatch>()
    const userState = useSelector(selectUser)



    //Modal.setAppElement('#root');
    
    /* eslint-disable */
    // Use in future
    /*
    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            return
            //TODO : IMPLEMENT THIS
        }
    };
    */
    /* eslint-enable */


    return (
        <Modal className={styles['my-liqour-modal']} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <button onClick={() => setIsOpen(false)}>X</button>
            <div className={styles.container}>
                <div>
                    {ingredientState.myIngredientList.map(ingredient => <IngredientItem key={ingredient.id} image={ingredient.image} name={ingredient.name} id={ingredient.id} ABV={ingredient.ABV} my_item={true} />)}
                </div>
            </div>

        </Modal >
    );
};

export default InitMyLiqourModal;