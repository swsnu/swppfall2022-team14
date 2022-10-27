import { useState, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import Modal from 'react-modal';
import './InitMyLiqourModal.scss'
import { toast } from 'react-toastify';

interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const InitMyLiqourModal = (props: prop) => {

    const { isOpen, setIsOpen } = props;



    Modal.setAppElement('#root');

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
        }
    };



    return (
        <Modal className='my-liqour-modal' isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <button onClick={() => setIsOpen(false)}>X</button>
            <div className='container'>
                <div>
                    내 술 목록
                </div>
            </div>

        </Modal >
    );
};

export default InitMyLiqourModal;