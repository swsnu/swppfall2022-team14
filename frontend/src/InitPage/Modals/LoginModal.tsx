import { useState, SetStateAction, Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { loginUser, registerUser, selectUser } from '../../store/slices/user/user';
import React from 'react';
import Modal from '@mui/material/Modal';
import { Button, FormControl, FormHelperText, IconButton, Input, InputLabel, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const style = (theme: any) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    overflow: 'scroll',
    [theme.breakpoints.down('md')]: {
        width: 0.8,
    },
});

export interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginModal = (props: prop) => {
    const { isOpen, setIsOpen } = props;

    const [loginId, setLoginId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [pwConfirm, setPwConfirm] = useState<string>("")
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [errorText, setErrorText] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const onClickMode = () => {
        setLoginId('');
        setLoginPassword('');
        setPwConfirm('');
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

    const onClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onClickShowPasswordConfirm = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    }

    const onChangeId = async (id: string) => {
        setLoginId(id)

        if (checkID(id) || isLoginMode) {
            setErrorText("")
        } else {
            setErrorText("???????????? ????????? ?????? ??????????????????")
        }
    }

    const onChangePw = async (pw: string) => {
        setLoginPassword(pw)

        if (checkPW(pw) || isLoginMode) {
            setErrorText("")
        } else {
            setErrorText("??????????????? ????????? ?????? ??????????????????")
        }
    }

    const onChangePwConfirm = async (pw: string) => {
        setPwConfirm(pw)

        if (loginPassword === pw) {
            setErrorText("")
        } else {
            setErrorText("??????????????? ???????????? ????????????.")
        }
    }

    const onClickLogin = async () => {
        if (loginId !== '' && loginPassword !== '') {
            const data = { username: loginId, password: loginPassword };
            const result = await dispatch(loginUser(data));
            if (result.type === `${loginUser.typePrefix}/fulfilled`) {
                setIsOpen(false)
            } else {
                setErrorText("????????? ?????? ??????????????? ???????????? ????????????.");
            }
        }
    };

    const onClickRegister = async () => {
        const data = {
            username: loginId,
            password: loginPassword
        }

        const result = await dispatch(registerUser(data))
        if (result.type === `${registerUser.typePrefix}/fulfilled`) {
            const result = await dispatch(loginUser(data));
            if (result.type === `${loginUser.typePrefix}/fulfilled`) {
                setIsOpen(false)
            } else {
                setErrorText("??????????????? ??????! ?????? ????????? ????????????");
            }
            onClickMode()
        } else {
            setErrorText("????????? ??????????????????.");
        }
    };
    const onClickClose = () => {
        setLoginId('');
        setLoginPassword('');
        setPwConfirm('');
        setIsOpen(false)
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClickClose}
        >
            <Stack spacing={2} sx={style}>
                <TextField
                    label="?????????"
                    variant="standard"
                    helperText={!isLoginMode && "2-10?????? ????????? ??????, ?????? ????????????(., _, -)??? ?????? ???????????????."}
                    value={loginId}
                    onChange={(e) => { onChangeId(e.target.value) }}
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
                <FormControl
                    variant="standard"
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
                >
                    <InputLabel>????????????</InputLabel>
                    <Input
                        type={showPassword ? "text" : "password"}
                        data-testid="password"
                        value={loginPassword}
                        onChange={(e) => { onChangePw(e.target.value) }}
                        onKeyPress={onKeyPress}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    data-testid="showPassword"
                                    tabIndex={-1}
                                    onClick={onClickShowPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>
                        {!isLoginMode && <> ????????? ?????? ????????? 8-20?????? ??????????????? ??????????????????. <br /> ????????????(!@#$%^&*)??? ?????? ???????????????. </>}
                    </FormHelperText>
                </FormControl>
                {!isLoginMode &&
                    <FormControl
                        variant="standard"
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
                    >
                        <InputLabel>???????????? ??????</InputLabel>
                        <Input
                            type={showPasswordConfirm ? "text" : "password"}
                            value={pwConfirm}
                            data-testid="pwconfirm"
                            onChange={(e) => { onChangePwConfirm(e.target.value) }}
                            onKeyPress={onKeyPress}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        tabIndex={-1}
                                        onClick={onClickShowPasswordConfirm}
                                    >
                                        {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                }
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
                            ?????????
                        </Typography>
                    </Button> :
                    <Button variant="text" onClick={onClickRegister}
                        data-testid="register"
                        disabled={!checkID(loginId) || !checkPW(loginPassword) || loginPassword !== pwConfirm}
                        sx={{
                            bgcolor: 'primary.dark',
                            borderRadius: 3,
                            boxShadow: 3,
                            '&:hover': {
                                backgroundColor: 'secondary.main',
                                boxShadow: 2,
                            },
                            '&:disabled': {
                                backgroundColor: 'secondary.dark',
                                boxShadow: 2,
                            },
                        }}
                    >
                        <Typography color='text.primary'>
                            ????????????
                        </Typography>
                    </Button>
                }
                <Stack direction="row" spacing={1} alignItems='flex-end' justifyContent='space-between'>
                    <Typography
                        color='error.main'
                        variant='body2'
                        sx={{ width: 0.6 }}
                    >
                        {errorText}
                    </Typography>
                    <Typography
                        color='text.primary'
                        variant='body2'
                        align="right"
                        onClick={onClickMode}
                        sx={{
                            width: 0.4,
                            'word-break': 'keep-all',
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'text.secondary',
                            },
                        }}
                    >
                        {isLoginMode ? "???????????? ????????????" : "????????? ????????????"}
                    </Typography>
                </Stack>
            </Stack>
        </Modal >
    );
};

export default LoginModal;