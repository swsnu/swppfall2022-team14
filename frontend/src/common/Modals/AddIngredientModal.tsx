import { useState, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import Modal from 'react-modal';
import styles from './AddIngredientModal.module.scss'
import React from 'react';
interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AddIngredientModal = (props: prop) => {

    const { isOpen, setIsOpen } = props;

    return (
        <Modal className={styles['add-ingredient-modal']} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <button onClick={() => setIsOpen(false)}>X</button>
            <div className={styles.container}>
                <div>
                    재료 추가
                </div>
            </div>
        </Modal >
    );
};

export default AddIngredientModal;