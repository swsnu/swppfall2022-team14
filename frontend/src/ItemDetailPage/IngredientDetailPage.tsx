import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import './IngredientDetailPage.scss';
import React from 'react';
import { getIngredient, selectIngredient } from "../store/slices/ingredient/ingredient";
import { selectUser } from "../store/slices/user/user";
import { deleteMyIngredients, postMyIngredients } from "../store/slices/ingredient/ingredient";
import LoginModal from "../InitPage/Modals/LoginModal";
import { Box, ImageListItem, IconButton, Stack, Typography } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function IngredientDetailPage() {

    const { id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const ingredientState = useSelector(selectIngredient);
    const userState = useSelector(selectUser)
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false)

    useEffect(() => {
        dispatch(getIngredient(Number(id)));
    }, [id]);

    const ingredient = ingredientState.ingredientItem;

    const checkColor = (asValue: string) => {
        const regExp = /[0-9a-fA-F]{6}/;
        return regExp.test(asValue);
    }

    const onClickAdd = () => {
        if (userState.isLogin && userState.user && ingredient) {
            dispatch(postMyIngredients({ id: Number(userState.user.id), ingredients: [ingredient.id], token: userState.token }))
        } else {
            setIsLoginOpen(true)
        }
    }

    const onClickDelete = () => {
        if (userState.isLogin && userState.user && ingredient) {
            dispatch(deleteMyIngredients({ user_id: Number(userState.user.id), ingredient_id: ingredient.id, token: userState.token }))
        } else {
            setIsLoginOpen(true)
        }
    }

    if (ingredientState.itemStatus == "loading") {
        return <div>Loading ..</div>
    }
    else if (ingredientState.itemStatus == "failed" || !ingredient) {
        return <div>Non existing Ingredient</div>
    }
    else {
        return (
            <>
                {/*<NavBar />*/}
                <Stack alignItems="flex-start" spacing={2} sx={{ width: 1, p: 3 }}>
                    <Stack alignItems="flex-start" spacing={0.5} sx={{ width: 1 }}>
                        <Typography variant="h2">
                            {ingredient.name}
                        </Typography>
                        <Typography variant="h6" sx={{ pl: 1 }}>
                            {ingredient.name_eng}
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end" sx={{ width: 1 }}>
                        {ingredientState.myIngredientList.map(ingr => ingr.id).includes(ingredient.id) ?
                            <IconButton onClick={onClickDelete}>
                                <RemoveIcon />
                            </IconButton> :
                            <IconButton onClick={onClickAdd}>
                                <AddIcon />
                            </IconButton>
                        }
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: 1 }}>
                        <ImageListItem sx={{ width: 0.3, height: 'fit-content' }}>
                            <img
                                src={ingredient.image}
                                style={{ borderRadius: 20, height: 'auto' }}
                            />
                        </ImageListItem>
                        <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1 }}>
                            <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1, p: 2, bgcolor: 'primary.main', borderRadius: 3 }}>
                                <Stack spacing={1} alignItems="flex-start">
                                    <Typography variant="body1">
                                        {ingredient.ABV ? 
                                            `${ingredient.ABV.toFixed(1)}%` :
                                            '도수 없음'
                                        }
                                    </Typography>
                                    <Typography variant="body1">
                                        {ingredient.price.toLocaleString()}원
                                    </Typography>
                                    {
                                        !checkColor(ingredient.color) && 
                                        <Typography variant="body1">
                                            {ingredient.color}
                                        </Typography>
                                    }
                                </Stack>
                                {
                                    checkColor(ingredient.color) && 
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            bgcolor: `#${ingredient.color}`
                                        }}
                                    />
                                }
                                <Typography variant="body2" align='left' sx={{ whiteSpace: 'pre-wrap' }}>
                                    {ingredient.introduction}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
                </Stack>
            </>
        )
    }
}