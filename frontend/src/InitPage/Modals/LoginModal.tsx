import { useState, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import styles from './LoginModal.module.scss'
import { toast } from 'react-toastify';
import { AppDispatch } from '../../store';
import { loginUser, logoutUser, registerUser, selectUser } from '../../store/slices/user/user';
import {TextField} from "@mui/material";
import React from 'react';
import {Visibility, VisibilityOff} from "@mui/icons-material";

export interface prop {
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

    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser);

    //Modal.setAppElement('#root');

    const checkID = (asValue:string) => {
        const regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
        return regExp.test(asValue);
    }

    const checkPW = (asValue:string) => {
        const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
        return regExp.test(asValue);
    }

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') {
            // TODO : IMPLEMENT THIS
        }
    };

    const onClickLogin = async () => {
        if (loginId === '') {
            toast.success('asdf')
            //toast.error('아이디를 입력해주세요.');
        } else if (loginPassword === '') {
            toast.error('비밀번호를 입력해주세요.');
        } else {
            const data = { username: loginId, password: loginPassword };
            const result = await dispatch(loginUser(data));
            if (result.type === `${loginUser.typePrefix}/fulfilled`) {
                console.log("front - success")
                console.log(result)
                alert("로그인 성공")
                setIsOpen(false)
            } else {
                console.log("front - failed")
                console.log(result)
                alert("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
        }
    };

    const onClickRegister = async () => {

        const data = {
            username: loginId,
            password: loginPassword
        }
        if(!checkID(data.username)){
            alert("아이디 형식 오류")
            return
        }
        if(!checkPW(data.password)){
            alert("비밀번호 형식 오류")
            return
        }

        const result = await dispatch(registerUser(data))
        if (result.type === `${registerUser.typePrefix}/fulfilled`) {
            console.log("front - success")
            console.log(result)
            alert("계정 생성 성공")
        } else {
            console.log("front - failed")
            console.log(result)
            alert("계정 생성 실패");
        }
    };
    const onClickClose = () => {
        setName('');
        setLoginId('');
        setLoginPassword('');
        setIsOpen(false)
    }



    return (
        <Modal className={styles['login-modal']} isOpen={isOpen} onRequestClose={() => onClickClose()} ariaHideApp={false}>
            <div className={styles.container}>
                <TextField id="id-input" label="아이디" variant="outlined" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
                <div className={styles['regex']}>아이디는 2-10자의 영문과 숫자와 일부 특수문자(._-)만 입력 가능</div>
                <TextField id="pw-input" label="비밀번호" variant="outlined" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
                <div className={styles['regex']}>영문과 숫자 조합의 8-20자의 비밀번호를 설정해주세요. 특수문자(!@#$%^&*)도 사용</div>
                <div className={styles['button-box']}>
                    <div className={styles.button}>
                        {isLoginMode ? <button className={styles.login} onClick={onClickLogin}>Login</button> : null}
                        {!isLoginMode ? <button className={styles.login} onClick={onClickRegister}>Register</button> : null}
                    </div>
                    <div className={styles['type']} onClick={onClickMode}>{isLoginMode ? "회원가입하러 가기" : "로그인하러 가기"}</div>
                </div>
            </div>
        </Modal >
    );
};

export default LoginModal;