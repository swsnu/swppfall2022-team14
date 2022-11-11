import { SetStateAction, Dispatch, KeyboardEvent } from 'react';
import Modal from 'react-modal';
import styles from './InitMyLiquorModal.module.scss'
import React from 'react';
export interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const InitMyLiqourModal = (props: prop) => {

    const { isOpen, setIsOpen } = props;



    //Modal.setAppElement('#root');
    
    /* eslint-disable */
    // Use in future
    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            return
            //TODO : IMPLEMENT THIS
        }
    };
    /* eslint-enable */


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