import { SetStateAction, Dispatch } from 'react';
import Modal from 'react-modal';
import styles from './InitMyLiqourModal.module.scss'
import React from 'react';
interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const InitMyLiqourModal = (props: prop) => {

    const { isOpen, setIsOpen } = props;



    Modal.setAppElement('#root');





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