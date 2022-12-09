import { useNavigate } from "react-router"
import { CocktailDetailType } from "../../store/slices/cocktail/cocktail";
import styles from './IngredientItem.module.scss'
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { AppDispatch } from "../../store";
import { deleteMyIngredients } from "../../store/slices/ingredient/ingredient";
import {selectUser} from "../../store/slices/user/user";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import RemoveIcon from '@mui/icons-material/Remove';

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
});

const IngredientItem = (prop: Pick<CocktailDetailType, "image" | "name" | "ABV" | "id"> & { my_item: boolean, user_id: number }) => {

    const navigate = useNavigate()
    const userState = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()

    const onClickItem = () => {
        navigate(`/ingredient/${prop.id}`)
    }

    const onClickDelete = (e: any) => {
        e.stopPropagation();
        dispatch(deleteMyIngredients({ user_id: prop.user_id, ingredient_id: prop.id, token: userState.token }))
    }

    return (
        <Card 
            onClick={onClickItem}
            sx={{ textAlign: 'left', borderRadius: 4, boxShadow: 5, bgcolor: 'primary.main' }}
        >
            <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" sx={{ height: 20 }}>
                {prop.my_item && 
                    <IconButton 
                        size="small"
                        sx={{
                            mr: 1,
                            mt: 0.5
                        }}
                        onClick={onClickDelete}
                    >
                        <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                }
            </Stack>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                <StyledProductImg src={prop.image} />
            </Box>
            <Stack direction="row" spacing={2} sx={{ p: 3 }} justifyContent="space-between">
                <Typography noWrap>
                    {prop.name}
                </Typography>
                <Typography noWrap>
                    {prop.ABV}%
                </Typography>
            </Stack>
        </Card>
    )
}

IngredientItem.defaultProps = {
    my_item: false,
    user_id: 4
}

export default IngredientItem