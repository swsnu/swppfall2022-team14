import { useState, useEffect, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import Modal from 'react-modal';
import axios from 'axios';

import { toast } from 'react-toastify';

interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginModal = (props: prop) => {
    const navigate = useNavigate();

    const { isOpen, setIsOpen } = props;

    const [loginId, setLoginId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true)
    const onClickMode = () => {
        setLoginId('')
        setLoginPassword('')
        setIsLoginMode(!isLoginMode)

    }

    Modal.setAppElement('#root');

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
        }
    };

    const handleLoginButton = () => {
        if (loginId === '') {
            toast.error('아이디를 입력해주세요.');
        } else if (loginPassword === '') {
            toast.error('비밀번호를 입력해주세요.');
        } else {
            // TODO : DO LOGIN
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLost = () => {
        navigate('/lost');
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <button onClick={() => setIsOpen(false)}>X</button>
            <div>
                {isLoginMode ? null
                    : <div>
                        Name
                        <input onKeyPress={onKeyPress} onChange={(e) => setLoginId(e.target.value)} />
                    </div>}

                <div>
                    ID
                    <input onKeyPress={onKeyPress} onChange={(e) => setLoginId(e.target.value)} />
                </div>

                <div>
                    Password
                    <input onKeyPress={onKeyPress} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>

                <div>
                    <button onClick={handleLoginButton}>{isLoginMode ? "login" : "register"}</button>
                </div>
                <div onClick={onClickMode}>{isLoginMode ? "register" : "login"}</div>

            </div>
        </Modal >
    );
};

export default LoginModal;