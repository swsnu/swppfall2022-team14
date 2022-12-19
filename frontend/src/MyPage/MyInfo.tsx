import React from 'react';
import { useNavigate } from "react-router";
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from '../store';
import { editUser, selectUser } from "../store/slices/user/user";
import { Button, FormControl, FormHelperText, IconButton, Input, InputLabel, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Modal from '@mui/material/Modal';
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
    open: boolean;
    onClose: () => void;
}

const MyInfo = (props: prop) => {
    const { open, onClose } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser)

    const [id, setId] = useState<string>(userState.user?.username ?? "")
    const [pw, setPw] = useState<string>("")
    const [newPw, setNewPw] = useState<string>("")
    const [pwConfirm, setPwConfirm] = useState<string>("")
    const [errorText, setErrorText] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const checkPW = (asValue: string) => {
        const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
        return regExp.test(asValue);
    }

    const onChangePw = async (pw: string) => {
        setNewPw(pw)

        if (checkPW(pw)) {
            setErrorText("")
        } else {
            setErrorText("비밀번호의 형식을 다시 확인해주세요")
        }
    }

    const onClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onChangePwConfirm = async (pw: string) => {
        setPwConfirm(pw)

        if (newPw === pw) {
            setErrorText("")
        } else {
            setErrorText("새로운 비밀번호와 일치하지 않습니다.")
        }
    }

    const onClickEdit = async () => {
        const data = {
            token: userState.token,
            org_password: pw,
            password: newPw
        }

        const result = await dispatch(editUser(data))
        if (result.type === `${editUser.typePrefix}/fulfilled`) {
            navigate('../')
            onClose()
        } else {
            if(result.payload === 10){
                setErrorText("원래 비밀번호가 일치하지 않습니다.");
            }
        }
    }

    return (
        <Modal 
            open={open} 
            onClose={onClose} 
        >
            <Stack spacing={5} sx={style}>
                <Stack spacing={2} >
                    <TextField 
                        label="아이디" 
                        variant="standard" 
                        value={id} 
                        disabled
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
                        <InputLabel>기존 비밀번호</InputLabel>
                        <Input 
                            type={showPassword ? "text" : "password"}
                            value={pw} 
                            onChange={(e) => {setPw(e.target.value)}}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        data-testid="show_password_button"
                                        tabIndex={-1}
                                        onClick={onClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
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
                        <InputLabel>새로운 비밀번호</InputLabel>
                        <Input 
                            type={showPassword ? "text" : "password"}
                            value={newPw} 
                            onChange={(e) => {onChangePw(e.target.value)}}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        data-testid="show_password_button"
                                        tabIndex={-1}
                                        onClick={onClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>
                            {<> 영문과 숫자 조합의 8-20자의 비밀번호를 설정해주세요. <br /> 특수문자(!@#$%^&*)도 사용 가능합니다. </>}
                        </FormHelperText>
                    </FormControl>
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
                        <InputLabel>비밀번호 확인</InputLabel>
                        <Input 
                            type={showPassword ? "text" : "password"}
                            value={pwConfirm} 
                            onChange={(e) => {onChangePwConfirm(e.target.value)}}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        data-testid="show_password_button"
                                        tabIndex={-1}
                                        onClick={onClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>
                            {<> 영문과 숫자 조합의 8-20자의 비밀번호를 설정해주세요. <br /> 특수문자(!@#$%^&*)도 사용 가능합니다. </>}
                        </FormHelperText>
                    </FormControl>
                </Stack>
                <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
                    <Typography 
                        color='error.main' 
                        variant='body2'
                    >
                        {errorText}
                    </Typography>
                    <Button variant="contained"
                        disabled={!checkPW(newPw) || newPw !== pwConfirm}
                        onClick={onClickEdit}
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
                        수정
                    </Button>
                </Stack>
            </Stack>
        </Modal>
    )
}


export default MyInfo