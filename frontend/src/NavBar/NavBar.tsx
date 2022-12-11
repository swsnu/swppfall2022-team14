import React, {useEffect, useState} from 'react';
import './NavBar.scss'
import NavFilter from "./NavFilter/NavFilter";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import {fetchMyIngredientList, selectIngredient} from '../store/slices/ingredient/ingredient';
import { selectUser } from "../store/slices/user/user";
import LoginModal from "../InitPage/Modals/LoginModal";
import AddIngredientModal from "../common/Modals/AddIngredientModal";
import { styled } from '@mui/material/styles';
import { Box, Button, Divider, ListItemIcon, ListItemButton, ListItemText, Stack, IconButton, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import KitchenIcon from '@mui/icons-material/Kitchen';
import CottageIcon from '@mui/icons-material/Cottage';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LiquorIcon from '@mui/icons-material/Liquor';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import {AppDispatch} from "../store";


const StyledItem = styled(ListItemButton)({
    height: 48,
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

const NavBar = () => {

    const navigate = useNavigate()
    const userState = useSelector(selectUser)
    const ingredientState = useSelector(selectIngredient)

    const dispatch = useDispatch<AppDispatch>()

    const [openMyIngr, setOpenMyIngr] = useState(false)
    const [curFilter, setCurFilter] = useState('ST')
    const [pop, setPop] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false);

    const handleST = () => {
        if (pop) {
            setPop(false)
            return
        }
        setPop(true)
        setCurFilter('ST')
    }
    const handleCS = () => {
        if (pop) {
            setPop(false)
            return
        }
        setPop(true)
        setCurFilter('CS')
    }
    const handleIG = () => {
        if (pop) {
            setPop(false)
            return
        }
        setPop(true)
        setCurFilter('IG')
    }
    const handleUpload = () => {
        if (userState.isLogin) {
            navigate('/custom/create')
        }
        else {
            setIsLoginOpen(true)
        }
    }
    const handleHome = () => {
        navigate('/')
    }
    const handleMyPage = () => {
        if (userState.isLogin) {
            navigate('/mypage')
        }
        else {
            setIsLoginOpen(true)
        }
    }
    const handleMyIngr = () => {
        if (userState.isLogin) {
            setOpenMyIngr(!openMyIngr)
        }
        else {
            setIsLoginOpen(true)
        }
    }

    const onIngredientClick = (id: number) => {
        navigate(`/ingredient/${id}`)
    }

    useEffect(() => {
        if(openMyIngr){
            if (userState.isLogin){
                dispatch(fetchMyIngredientList(userState.token))
            }
        }
    },[openMyIngr])

    return (
        <Stack direction="row" sx={{ boxShadow: "1px -20px 10px 5px #181818" }}>
            <Stack justifyContent="flex-start" sx={{ width: 270, minWidth: 270, maxWidth: 270, px: 1 }}>
                <Box component="span" sx={{ height: 80, p: 2 }}>
                    <LocalBarIcon onClick={handleHome} sx={{ cursor: 'pointer', fontSize: 50 }} />
                </Box>
                <Stack 
                    direction="row" justifyContent="center" alignItems="center" spacing={1} 
                    sx={{ 
                        height: 50, 
                        bgcolor: 'primary.dark',
                        borderRadius: 4,
                        mb: 2,
                    }}>
                    {[
                        { onClick: handleHome,   icon: <CottageIcon />       , type: "Home"},
                        { onClick: handleMyIngr, icon: <LiquorIcon />        , type: "MyIngr"},
                        { onClick: handleUpload, icon: <FileUploadIcon />    , type: "Upload"},
                        { onClick: handleMyPage, icon: <PersonOutlineIcon /> , type: "MyPage"},
                    ].map((btn, idx) => {
                        return (
                            <IconButton
                                key={idx}
                                data-testid={`${btn.type}_button`}
                                onClick={btn.onClick}
                                >
                                {btn.icon}
                            </IconButton>
                        )
                    })}
                </Stack>
                {[
                    { title: "Standard"  , type: 'ST', onClick: handleST, icon: <AutoAwesomeIcon /> },
                    { title: "Custom"    , type: 'CS', onClick: handleCS, icon: <PeopleAltIcon /> },
                    { title: "Ingredient", type: 'IG', onClick: handleIG, icon: <KitchenIcon /> },
                ].map((menu) => {
                    return (
                        <Stack key={menu.title} spacing={0.5}>
                            <StyledItem
                                onClick={menu.onClick}
                            >
                                <StyledItemIcon>{menu.icon}</StyledItemIcon>
                                <ListItemText disableTypography primary={menu.title} />
                            </StyledItem>
                            {
                                curFilter === menu.type && pop ? <NavFilter type={menu.type} /> : null
                            }
                        </Stack>
                    )
                })}
                <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
                {<AddIngredientModal isOpen={isAddIngredientModalOpen} setIsOpen={setIsAddIngredientModalOpen} user_id={Number(userState.user?.id)} />}
            </Stack>
            <Divider orientation="vertical" flexItem />
            {openMyIngr &&
                <Stack spacing={4} alignItems="center" justifyContent="flex-start" sx={{ width: 160, px: 2, py: 10 }}>
                    {ingredientState.myIngredientList.map((ingredient) =>
                        <Button
                            key={ingredient.id}
                            sx={{ bgcolor: 'primary.light', borderRadius: 5, px: 1, py: 0.5, textAlign: 'center' }}
                            onClick={() => onIngredientClick(ingredient.id)}
                        >
                            <Typography fontSize={12} color='text.primary'>
                                {ingredient.name}
                            </Typography>
                        </Button>
                    )}
                </Stack>
            }
        </Stack>
    )
}

export default NavBar