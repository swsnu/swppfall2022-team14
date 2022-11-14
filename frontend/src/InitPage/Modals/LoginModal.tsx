import { useState, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import styles from './LoginModal.module.scss'
import { toast } from 'react-toastify';
import { AppDispatch } from '../../store';
import { loginUser, selectUser } from '../../store/slices/user/user';
import React from 'react';

export interface prop {
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

    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser);

    //Modal.setAppElement('#root');

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') {
            // TODO : IMPLEMENT THIS
        }
    };

    const onClickLogin = async () => {
        if (loginId === '') {
            toast.error('아이디를 입력해주세요.');
        } else if (loginPassword === '') {
            toast.error('비밀번호를 입력해주세요.');
        } else {
            const data = { username: loginId, password: loginPassword };
            const result = await dispatch(loginUser(data));
            if (result.type === `${loginUser.typePrefix}/fulfilled`) {
                setLoginState(true)
                setIsOpen(false)
            } else {
                alert("Error on login");
            }
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
                            <label>
                                Name
                                <input className={styles.input} value={name} onKeyPress={onKeyPress} onChange={(e) => setName(e.target.value)} />
                            </label>
                        </div>}
                    <div className={styles.id}>
                        <label>
                            ID
                            <input className={styles.input} value={loginId} onKeyPress={onKeyPress} onChange={(e) => setLoginId(e.target.value)} />
                        </label>
                    </div>
                    <div className={styles.id}>
                        <label>
                            Password
                            <input className={styles.input} value={loginPassword} onKeyPress={onKeyPress} onChange={(e) => setLoginPassword(e.target.value)} />
                        </label>
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