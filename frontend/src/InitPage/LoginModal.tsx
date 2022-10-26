import { useState, useEffect, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import Modal from 'react-modal';
import axios from 'axios';
import './LoginModal.scss'
import { toast } from 'react-toastify';

interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginModal = (props: prop) => {

    const { isOpen, setIsOpen } = props;

    const [name, setName] = useState('');
    const [loginId, setLoginId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true)
    const onClickMode = () => {
        setName('');
        setLoginId('');
        setLoginPassword('');
        setIsLoginMode(!isLoginMode);

    }

    Modal.setAppElement('#root');

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
        }
    };

    const onClickLogin = () => {
        if (loginId === '') {
            toast.error('아이디를 입력해주세요.');
        } else if (loginPassword === '') {
            toast.error('비밀번호를 입력해주세요.');
        } else {
            // TODO : DO LOGIN
        }
    };

    const onClickRegister = () => {
        //TODO : DO REGISTER
    };



    return (
        <Modal className='login-modal' isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <button onClick={() => setIsOpen(false)}>X</button>
            <div className='container'>
                <div>
                    {isLoginMode ? null
                        : <div className='id'>
                            Name
                            <input className='input' value={name} onKeyPress={onKeyPress} onChange={(e) => setName(e.target.value)} />
                        </div>}
                    <div className='id'>
                        ID
                        <input className='input' value={loginId} onKeyPress={onKeyPress} onChange={(e) => setLoginId(e.target.value)} />
                    </div>
                    <div className='id'>
                        Password
                        <input className='input' value={loginPassword} onKeyPress={onKeyPress} onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>

                    <div className='button'>
                        {isLoginMode ? <button className='login' onClick={onClickLogin}>Login</button> : null}
                        {!isLoginMode ? <button className='login' onClick={onClickRegister}>Register</button> : null}
                    </div>
                    <div onClick={onClickMode}>{isLoginMode ? "register" : "login"}</div>

                </div>
            </div>

        </Modal >
    );
};

export default LoginModal;