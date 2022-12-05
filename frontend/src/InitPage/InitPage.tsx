import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Filter from "./Components/Filter"
import Item from "../common/Components/Item"
import React from 'react';
import styles from "./InitPage.module.scss"
import LoginModal from "./Modals/LoginModal"
import InitMyLiqourModal from "./Modals/InitMyLiquorModal"
import { fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { getUser, logoutUser, selectUser } from '../store/slices/user/user';
import { AppDispatch } from "../store"
import { fetchMyIngredientList } from "../store/slices/ingredient/ingredient";
import RecommendModal from "./Modals/RecommendModal";
import { Grid, IconButton, ToggleButtonGroup, ToggleButton, TextField, Stack } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

export interface Filterparam {
    type_one: string[],
    type_two: string[],
    type_three: string[],
    available_only: boolean
}


const InitPage = () => {

    const cocktailState = useSelector(selectCocktail)
    const userState = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()

    const loginState = userState.isLogin;
    //const [loginState, setLoginState] = useState(false)
    // const [urlParams, setUrlParams] = useState<string>("")
    const [filterParam, setFilterParam] = useState<Filterparam>({ type_one: [], type_two: [], type_three: [], available_only: false })
    const [input, setInput] = useState('')

    const request_param = { filter_param: filterParam, name_param: input }

    const navigate = useNavigate()

    const [toggle, setToggle] = useState<'standard' | 'custom' | 'ingredient'>('standard')
    const [isStandard, setIsStandard] = useState(true)
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const onClickFilter = () => {
        setIsOpenFilter(!isOpenFilter)
    }
    const [isOpenProfile, setisOpenProfile] = useState(false) // 프로필 클릭 시 나오는 버튼 handle
    const onClickProfile = () => {
        setisOpenProfile(!isOpenProfile)
    }
    // TODO : HANDLE LOGIN
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const onClickLogin = () => {
        setIsLoginOpen(true)
    }
    const [isInitMyLiqourOpen, setIsInitMyLiqourOpen] = useState(false);
    const onClickMyLiqour = () => {
        setIsInitMyLiqourOpen(true)
    }
    const onClicklogout = async () => {
        await dispatch(logoutUser(userState.token));
        location.reload();
    }
    const onClickSearch = () => {
        // TODO : give params with filter information
        if (isStandard) navigate(`/standard`,
            { state: request_param }
        )
        else navigate(`/custom`, { state: request_param })
    }

    const onClickToggle = (
        event: React.MouseEvent<HTMLElement>,
        toggle: 'standard' | 'custom' | 'ingredient',
    ) => {
        setToggle(toggle)

        if (toggle === 'standard') {
            setIsStandard(true)
        } else if (toggle === 'custom') {
            setIsStandard(false)
        } else {
            onClickRecommendButton()
        }
    }

    const onClickMyPage = () => {
        navigate(`/mypage`)
    }

    const onClickUserInfo = async () => {
        const res = dispatch(getUser())
        console.log(res)
    }

    const [isRecommendOpen, setIsRecommendOpen] = useState(false);
    const onClickRecommendButton = () => {
        if (userState.isLogin) {
            setIsRecommendOpen(true)
        }
        else {
            setIsLoginOpen(true)
        }
    }


    useEffect(() => {
        if (isStandard) {
            dispatch(fetchStandardCocktailList(null))
        } else {
            dispatch(fetchCustomCocktailList(null))
        }
    }, [isStandard])
    useEffect(() => {
        if (userState.isLogin && userState.user?.id !== null) {
            dispatch(fetchMyIngredientList())
        }

    }, [])



    return (
        <Stack spacing={2} sx={{ width: 1, pl: 2, pr: 3, py: 2 }}>
            <Stack direction="row" justifyContent="flex-end">
                {loginState ? 
                    <button onClick={onClickProfile}>내 프로필</button> : 
                    <IconButton onClick={onClickLogin}>
                        <LoginIcon />
                    </IconButton>
                }
                {loginState && isOpenProfile ? <div>
                    <button onClick={onClickMyPage}>My Page</button>
                    <button onClick={onClicklogout}>Logout</button>
                    <button onClick={onClickUserInfo}>Get Info</button>
                </div> : null}
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ pl: 3 }}>
                <ToggleButtonGroup
                    value={toggle}
                    exclusive
                    onChange={onClickToggle}
                >
                    <ToggleButton value="standard">
                        스탠다드
                    </ToggleButton>
                    <ToggleButton value="custom">
                        커스텀
                    </ToggleButton>
                    <ToggleButton value="ingredient">
                        재료 추천
                    </ToggleButton>
                </ToggleButtonGroup>
                <Stack direction="row" spacing={1} alignItems='flex-end' justifyContent="flex-end">
                    <TextField 
                        label="추가 검색어" variant="standard" value={input} onChange={(e) => setInput(e.target.value)} 
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
                    <IconButton onClick={onClickFilter}>
                        <FilterAltIcon />
                    </IconButton>
                    <IconButton onClick={onClickSearch}>
                        <SearchIcon />
                    </IconButton>
                </Stack>

                {isOpenFilter ? <Filter setUrlParams={setFilterParam} /> : null}
            </Stack>
            <Grid container spacing={3} columns={5} sx={{ width: 1, pr: 2 }}>
                {cocktailState.cocktailList.map((cocktail) => 
                    <Grid key={cocktail.id} item xs={1}>
                        <Item 
                            key={cocktail.id} 
                            image={cocktail.image}
                            name={cocktail.name} 
                            rate={cocktail.rate} 
                            type={cocktail.type} 
                            id={cocktail.id} 
                            tags={cocktail.tags} 
                        />
                    </Grid>
                )}
            </Grid>
            <button className={styles['my-liquor']} onClick={onClickMyLiqour}>My Liquor</button>
            <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            <InitMyLiqourModal isOpen={isInitMyLiqourOpen} setIsOpen={setIsInitMyLiqourOpen} />
            <RecommendModal isOpen={isRecommendOpen} setIsOpen={setIsRecommendOpen} />
        </Stack >
    )
}


export default InitPage