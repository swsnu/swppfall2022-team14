import { useState, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import Modal from 'react-modal';
import styles from './LoginModal.module.scss'
import { toast } from 'react-toastify';
import React from 'react';
interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setLoginState: Dispatch<SetStateAction<boolean>>;
}

const LoginModal = (props: prop) => {

    const { isOpen, setIsOpen, setLoginState } = props;

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

    //Modal.setAppElement('#root');

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            return
            // TODO : IMPLEMENT THIS
        }
    };

    const onClickLogin = () => {
        if (loginId === '') {
            toast.error('아이디를 입력해주세요.');
        } else if (loginPassword === '') {
            toast.error('비밀번호를 입력해주세요.');
        } else {
            // TODO : DO LOGIN
            setLoginState(true)
            setIsOpen(false)
        }
    };

    const onClickRegister = () => {
        //TODO : DO REGISTER
    };
    const onClickClose = () => {
        setName('');
        setLoginId('');
        setLoginPassword('');
        setIsOpen(false)
    }



    return (
        <Modal className={styles['login-modal']} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            < button onClick={onClickClose} > X</button >
            <div className={styles.container}>
                <div>
                    {isLoginMode ? null
                        : <div className={styles.id}>
                            Name
                            <input className={styles.input} value={name} onKeyPress={onKeyPress} onChange={(e) => setName(e.target.value)} />
                        </div>}
                    <div className={styles.id}>
                        ID
                        <input className={styles.input} value={loginId} onKeyPress={onKeyPress} onChange={(e) => setLoginId(e.target.value)} />
                    </div>
                    <div className={styles.id}>
                        Password
                        <input className={styles.input} value={loginPassword} onKeyPress={onKeyPress} onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>

                    <div className={styles.button}>
                        {isLoginMode ? <button className={styles.login} onClick={onClickLogin}>Login</button> : null}
                        {!isLoginMode ? <button className={styles.login} onClick={onClickRegister}>Register</button> : null}
                    </div>
                    <div onClick={onClickMode}>{isLoginMode ? "register" : "login"}</div>

                </div>
            </div>

        </Modal >
    );
};

export default LoginModal;