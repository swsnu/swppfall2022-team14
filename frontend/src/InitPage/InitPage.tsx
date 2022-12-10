import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Filter from "./Components/Filter"
import Item from "../common/Components/Item"
import React from 'react';
import LoginModal from "./Modals/LoginModal"
import InitMyLiqourModal from "./Modals/InitMyLiquorModal"
import { fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser, selectUser } from '../store/slices/user/user';
import { AppDispatch } from "../store"
import { fetchMyIngredientList } from "../store/slices/ingredient/ingredient";
import RecommendModal from "./Modals/RecommendModal";
import { styled } from '@mui/material/styles';
import {
    Grid,
    IconButton,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ToggleButtonGroup,
    ToggleButton,
    TextField,
    Stack,
    Typography
} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import LiquorIcon from '@mui/icons-material/Liquor';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import {useSearchParams} from "react-router-dom";


const StyledItem = styled(ListItemButton)({
    position: 'relative',
    justifyContent: "flex-start",
    gap: 10,
});

const StyledItemIcon = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 10,
});

export interface Filterparam {
    type_one: string[],
    type_two: string[],
    type_three: string[],
    available_only: boolean
}

const InitPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const cocktailState = useSelector(selectCocktail)
    const userState = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()

    const loginState = userState.isLogin;
    const [filterParam, setFilterParam] = useState<Filterparam>({ type_one: [], type_two: [], type_three: [], available_only: false })
    const [input, setInput] = useState('')

    const request_param = { filter_param: filterParam, name_param: input }

    const navigate = useNavigate()

    const [toggle, setToggle] = useState<'standard' | 'custom' | 'ingredient'>('standard')
    const [isStandard, setIsStandard] = useState(searchParams.get('type') === 'custom')
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const onClickFilter = () => {
        setIsOpenFilter(!isOpenFilter)
    }
    const [isOpenProfile, setisOpenProfile] = useState(false) // 프로필 클릭 시 나오는 버튼 handle
    const onClickProfile = () => {
        setisOpenProfile(!isOpenProfile)
    }

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const onClickLogin = () => {
        setIsLoginOpen(true)
    }
    const [isInitMyLiqourOpen, setIsInitMyLiqourOpen] = useState(false);
    const onClickMyLiqour = () => {
        if(userState.isLogin && userState.user?.id !== null){
            setIsInitMyLiqourOpen(true)
        }
        else{
            setIsLoginOpen(true)
        }

    }
    const onClickLogout = async () => {
        await dispatch(logoutUser(userState.token));
        location.reload();
    }
    const onClickSearch = () => {
        // TODO : give params with filter information
        if (searchParams.get('type') === 'custom'){
            navigate(`/custom`, { state: request_param })
        }
        else{
            navigate(`/standard`, { state: request_param })
        }
    }

    const onClickToggle = (
        event: React.MouseEvent<HTMLElement>,
        toggle: 'standard' | 'custom' | 'ingredient',
    ) => {
        setToggle(toggle)

        if (toggle === 'standard') {
            setIsStandard(true)
            setSearchParams({type: ''})
        } else if (toggle === 'custom') {
            setIsStandard(false)
            setSearchParams({type: "custom"})
        } else {
            onClickRecommendButton()
        }
    }

    const onClickMyPage = () => {
        navigate(`/mypage`)
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
        const type = searchParams.get('type')
        if (type == 'custom') {
            setToggle('custom')
            dispatch(fetchCustomCocktailList(null))
        } else {
            setToggle('standard')
            dispatch(fetchStandardCocktailList(null))
        }
    }, [searchParams])



    return (
        <Stack spacing={2} sx={{ width: 1, pl: 2, pr: 3, py: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <LocalBarIcon sx={{ ml: 13, fontSize: 50 }} />
                <Typography variant="h3">
                    {"Top 15 Cocktails"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                    {loginState && isOpenProfile ? (
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                            <IconButton data-testid="my page" onClick={onClickMyPage}>
                                <PersonOutlineIcon />
                            </IconButton>
                            <IconButton data-testid="logout" onClick={onClickLogout}>
                                <LogoutIcon />
                            </IconButton>
                        </Stack> 
                    ) : null}
                    {loginState ? 
                        <IconButton data-testid="my profile" size="large" onClick={onClickProfile}>
                            <AccountCircleIcon fontSize="large" />
                        </IconButton> : 
                        <IconButton data-testid="login" onClick={onClickLogin}>
                            <LoginIcon />
                        </IconButton>
                    }
                </Stack>
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
                <Stack direction="row" spacing={1} alignItems='stretch'>
                    <Stack direction="row" alignItems='center' sx={{ pl: 2, pr: 1, bgcolor: 'primary.main', borderRadius: 4 }}>
                        <TextField 
                            placeholder="검색어" variant="standard" value={input} onChange={(e) => setInput(e.target.value)} 
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
                        <IconButton data-testid="search" onClick={onClickSearch}>
                            <SearchIcon />
                        </IconButton>
                    </Stack>
                    <StyledItem
                        data-testid="filter"
                        onClick={onClickFilter}
                        sx={{ px: 2, bgcolor: 'primary.main', borderRadius: 4 }}
                    >
                        <ListItemText disableTypography primary="필터 검색" />
                        <StyledItemIcon>
                            <FilterAltIcon />
                        </StyledItemIcon>
                    </StyledItem>
                </Stack>
            </Stack>
            {isOpenFilter ? <Filter setUrlParams={setFilterParam} onClickSearch={onClickSearch} input={input} setInput={setInput} /> : null}
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
            <IconButton
                data-testid="my liquor"
                onClick={onClickMyLiqour}
                size='large'
                sx={{
                    bgcolor: 'primary.light',
                    position: 'fixed',
                    right: 50,
                    bottom: 50,
                }}>
                <LiquorIcon fontSize='large' />
            </IconButton>
            <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            {isInitMyLiqourOpen ?
                (userState.isLogin && userState.user?.id !== null) ?
                    <InitMyLiqourModal isOpen={isInitMyLiqourOpen} setIsOpen={setIsInitMyLiqourOpen} />
                    :
                    null
                :
                null
            }
            {isRecommendOpen ? <RecommendModal isOpen={isRecommendOpen} setIsOpen={setIsRecommendOpen} /> : null}
        </Stack >
    )
}


export default InitPage