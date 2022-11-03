import { useState, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import Modal from 'react-modal';
import styles from './InitMyLiqourModal.module.scss'
import { toast } from 'react-toastify';
import React from 'react';
interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const InitMyLiqourModal = (props: prop) => {

    const { isOpen, setIsOpen } = props;



    Modal.setAppElement('#root');

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            return
            //TODO : IMPLEMENT THIS
        }
    };



    return (
        <Modal className={styles['my-liqour-modal']} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <button onClick={() => setIsOpen(false)}>X</button>
            <div className={styles.container}>
                <div>
                    내 술 목록
                </div>
            </div>

        </Modal >
    );
};

export default InitMyLiqourModal;