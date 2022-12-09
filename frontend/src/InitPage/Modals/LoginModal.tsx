import { useState, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './LoginModal.module.scss'
import { toast } from 'react-toastify';
import { AppDispatch } from '../../store';
import { loginUser, logoutUser, registerUser, selectUser } from '../../store/slices/user/user';
import React from 'react';
import Modal from '@mui/material/Modal';
import { Button, Stack, TextField, Typography } from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    overflow: 'scroll',
};

export interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginModal = (props: prop) => {
    const { isOpen, setIsOpen } = props;

    const [loginId, setLoginId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [errorText, setErrorText] = useState('');

    const onClickMode = () => {
        setLoginId('');
        setLoginPassword('');
        setErrorText('');
        setIsLoginMode(!isLoginMode);
    }

    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser);

    const checkID = (asValue: string) => {
        const regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
        return regExp.test(asValue);
    }

    const checkPW = (asValue: string) => {
        const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
        return regExp.test(asValue);
    }

    const onKeyPress = (e: { key: string; }) => {
        if (e.key == 'Enter') {
            onClickLogin();
        }
    };


    const onClickLogin = async () => {
        if (loginId !== '' && loginPassword !== '')  {
            const data = { username: loginId, password: loginPassword };
            const result = await dispatch(loginUser(data));
            if (result.type === `${loginUser.typePrefix}/fulfilled`) {
                setIsOpen(false)
            } else {
                setErrorText("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
        }
    };

    const onClickRegister = async () => {

        const data = {
            username: loginId,
            password: loginPassword
        }
        if (!checkID(data.username)) {
            setErrorText("아이디 형식 오류")
            return
        }
        if (!checkPW(data.password)) {
            setErrorText("비밀번호 형식 오류")
            return
        }

        const result = await dispatch(registerUser(data))
        if (result.type === `${registerUser.typePrefix}/fulfilled`) {
            onClickMode()
        } else {
            setErrorText("계정 생성 실패");
        }
    };
    const onClickClose = () => {
        setLoginId('');
        setLoginPassword('');
        setIsOpen(false)
    }

    return (
        <Modal 
            open={isOpen} 
            onClose={onClickClose} 
        >
            <Stack spacing={2} sx={style}>
                <TextField 
                    label="아이디" 
                    variant="standard" 
                    helperText="2-10자의 영문과 숫자, 일부 특수문자(., _, -)만 입력 가능합니다."
                    value={loginId} 
                    onChange={(e) => {setLoginId(e.target.value); setErrorText('');}}
                    onKeyPress={onKeyPress}
                    sx={{
                        '& label.Mui-focused': {
                            color: 'secondary.light',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: 'secondary.light',
                        },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: 'secondary.light',
                            },
                        },
                    }}
                />
                <TextField 
                    label="비밀번호" 
                    variant="standard" 
                    helperText={<> 영문과 숫자 조합의 8-20자의 비밀번호를 설정해주세요. <br /> 특수문자(!@#$%^&*)도 사용 가능합니다. </>}
                    type="password" 
                    value={loginPassword} 
                    onChange={(e) => {setLoginPassword(e.target.value); setErrorText('');}}
                    onKeyPress={onKeyPress}
                    sx={{
                        '& label.Mui-focused': {
                            color: 'secondary.light',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: 'secondary.light',
                        },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: 'secondary.light',
                            },
                        },
                    }}
                />
                {isLoginMode ? 
                    <Button variant="text" onClick={onClickLogin}
                        sx={{
                            bgcolor: 'primary.dark',
                            borderRadius: 3,
                            boxShadow: 3,
                            '&:hover': {
                                backgroundColor: 'secondary.main',
                                boxShadow: 2,
                            },
                        }}
                    >
                        <Typography color='text.primary'>
                            로그인
                        </Typography>
                    </Button> : 
                    <Button variant="text" onClick={onClickRegister}
                        sx={{
                            bgcolor: 'primary.dark',
                            borderRadius: 3,
                            boxShadow: 3,
                            '&:hover': {
                                backgroundColor: 'secondary.main',
                                boxShadow: 2,
                            },
                        }}
                    >
                        <Typography color='text.primary'>
                            회원가입
                        </Typography>
                    </Button>
                }
                <Stack direction="row" alignItems='flex-end' justifyContent='space-between'>
                    <Typography 
                        color='error.main' 
                        variant='body2'
                    >
                        {errorText}
                    </Typography>
                    <Typography 
                        color='text.primary' 
                        variant='body2'
                        onClick={onClickMode}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'text.secondary',
                            },
                        }}
                    >
                        {isLoginMode ? "회원가입하러 가기" : "로그인하러 가기"}
                    </Typography>
                </Stack>
            </Stack>
        </Modal >
    );
};

export default LoginModal;