import { useState, useEffect } from "react"
import React from "react";
import NavBar from "../NavBar/NavBar";
import {Route, Routes} from "react-router-dom";
import ListPage from "../ListPage/ListPage";
import EditCustomPage from "../EditCustomPage/EditCustomPage";
import CreateCustomPage from "../CreateCustomPage/CreateCustomPage";
import IngredientDetailPage from "../ItemDetailPage/IngredientDetailPage";
import ItemDetailPage from "../ItemDetailPage/ItemDetailPage";
import MyPage from "../MyPage/MyPage";
import { Box, Stack } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const MainPage = () => {

    const [isOpenNavBar, setIsOpenNavBar] = useState(true)

    useEffect(() => {
        setIsOpenNavBar(true)
    })

    return(
        <Stack direction="row" alignItems="stretch" justifyContent="flex-start">
            <Stack direction="row"
                sx={{
                    zIndex: 2,
                }}
            >
                <NavBar isOpenNavBar={isOpenNavBar} />
                <Box
                    alignItems="center"
                    justifyContent="center"
                    sx={(theme) => ({
                        position: 'relative',
                        top: 30,
                        bgcolor: 'primary.dark',
                        width: 'fit-content',
                        height: 'fit-content',
                        paddingTop: 0.5,
                        paddingLeft: 0.5,
                        paddingRight: 1,
                        borderRadius: "0px 20px 20px 0px / 0px 20px 20px 0px",
                        boxShadow: "8px 0px 8px 2px #181818",
                        cursor: 'pointer',
                        [theme.breakpoints.up('md')]: {
                            display: 'none'
                        },
                    })}
                >
                    {isOpenNavBar ?
                        <KeyboardDoubleArrowLeftIcon 
                            sx={{
                                fontSize: 30
                            }}
                            onClick={() => setIsOpenNavBar(false)}
                        /> :
                        <KeyboardDoubleArrowRightIcon
                            sx={{
                                fontSize: 30
                            }}
                            onClick={() => setIsOpenNavBar(true)}
                        />
                    }
                </Box>
            </Stack>
            <Box
                sx={(theme) => ({
                    zIndex: 1,
                    [theme.breakpoints.down('md')]: {
                        position: 'absolute',
                    },
                })}
                onClick={() => setIsOpenNavBar(false)}
            >
                <Routes>
                    <Route path="/:type" element={<ListPage />} />
                    <Route path="/custom/:id/edit" element={<EditCustomPage />} />
                    <Route path='/custom/create' element={<CreateCustomPage />} />
                    <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
                    <Route path="/:type/:id" element={<ItemDetailPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </Box>
        </Stack>
    )
}

export default MainPage