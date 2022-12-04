import React, { useState } from 'react';
import './NavBar.scss'
import NavFilter from "./NavFilter/NavFilter";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectIngredient } from '../store/slices/ingredient/ingredient';
import { selectUser } from "../store/slices/user/user";
import LoginModal from "../InitPage/Modals/LoginModal";
import AddIngredientModal from "../common/Modals/AddIngredientModal";
import { styled } from '@mui/material/styles';
import { Box, ListItemIcon, ListItemButton, ListItemText, Stack, IconButton } from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import CottageIcon from '@mui/icons-material/Cottage';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LiquorIcon from '@mui/icons-material/Liquor';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalBarIcon from '@mui/icons-material/LocalBar';


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

    const handleAddIngr = () => {
        setIsAddIngredientModalOpen(true)
    }

    return (
        <Stack justifyContent="flex-start" sx={{ width: 1/4, px: 1}}>
            <Box component="span" sx={{ height: 80, p: 2 }}>
                <LocalBarIcon sx={{ fontSize: 50 }} />
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
                    { onClick: handleHome,   icon: <CottageIcon />       },
                    { onClick: handleMyIngr, icon: <LiquorIcon />        },
                    { onClick: handleUpload, icon: <FileUploadIcon />    },
                    { onClick: handleMyPage, icon: <PersonOutlineIcon /> },
                ].map((btn, idx) => {
                    return (
                        <IconButton
                            key={idx}
                            onClick={btn.onClick}
                            >
                            {btn.icon}
                        </IconButton>
                    )
                })}
            </Stack>
            {[
                { title: "Standard"  , type: 'ST', onClick: handleST, icon: <AbcIcon /> },
                { title: "Custom"    , type: 'CS', onClick: handleCS, icon: <AbcIcon /> },
                { title: "Ingredient", type: 'IG', onClick: handleIG, icon: <AbcIcon /> },
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
            {
                openMyIngr ?
                    <div className="nav__side">
                        <div className="nav__side-util">
                            <button onClick={handleAddIngr}>ADD</button>
                        </div>
                        {ingredientState.myIngredientList.map(ingredient =>
                            <div key={ingredient.id} className="nav__side-ingr">
                                <div className="nav__side-ingr-name">{ingredient.name}</div>
                                <div className="nav__side-ingr-abv">{ingredient.ABV}</div>
                            </div>
                        )}

                    </div>
                    :
                    null
            }
            <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            {<AddIngredientModal isOpen={isAddIngredientModalOpen} setIsOpen={setIsAddIngredientModalOpen} user_id={Number(userState.user?.id)} />}
        </Stack>
    )
}

export default NavBar