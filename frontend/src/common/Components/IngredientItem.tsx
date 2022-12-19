import { useNavigate } from "react-router"
import { CocktailDetailType } from "../../store/slices/cocktail/cocktail";
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { AppDispatch } from "../../store";
import { deleteMyIngredients, postMyIngredients } from "../../store/slices/ingredient/ingredient";
import {selectUser} from "../../store/slices/user/user";
import { Box, Card, IconButton, ImageListItem, Stack, Typography } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const IngredientItem = (prop: Pick<CocktailDetailType, "image" | "name" | "ABV" | "id"> & { my_item: boolean, user_id: number }) => {

    const navigate = useNavigate()
    const userState = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()

    const onClickItem = () => {
        navigate(`/ingredient/${prop.id}`)
    }

    const onClickAdd = () => {
        dispatch(postMyIngredients({ id: Number(userState.user?.id), ingredients: [prop.id], token: userState.token }))
    }

    const onClickDelete = () => {
        dispatch(deleteMyIngredients({ user_id: prop.user_id, ingredient_id: prop.id, token: userState.token }))
    }

    return (
        <Card 
            sx={{ 
                width: 1, textAlign: 'left', borderRadius: 4, boxShadow: 5, bgcolor: 'primary.main',
            }} 
        >
            <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" sx={{ width: 1, height: 20 }}>
                {prop.my_item ? 
                    <IconButton 
                        size="small"
                        data-testid="delete"
                        sx={{
                            mr: 1,
                            mt: 1,
                        }}
                        onClick={onClickDelete}
                    >
                        <RemoveIcon sx={{ fontSize: 20 }} />
                    </IconButton> :
                    <IconButton 
                        size="small"
                        data-testid="add"
                        sx={{
                            mr: 1,
                            mt: 1,
                        }}
                        onClick={onClickAdd}
                    >
                        <AddIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                }
            </Stack>
            <Box 
                sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: {
                        display: 'flex',
                        pb: 2,
                    },
                })}
            >
                <ImageListItem 
                    onClick={onClickItem} 
                    sx={(theme) => ({ 
                        width: 1, aspectRatio: 1, cursor: 'pointer', 
                        [theme.breakpoints.down('sm')]: {
                            width: 0.4,
                            mx: 1,
                        },
                    })}
                >
                    <img 
                        src={prop.image} 
                        loading="lazy" 
                        style={{
                            aspectRatio: 1
                        }} 
                    />
                </ImageListItem>
                <Box 
                    justifyContent="space-between"
                    sx={(theme) => ({ 
                        width: 1, p: 3, display: 'flex',
                        [theme.breakpoints.down('sm')]: {
                            width: 0.6,
                            p: 2,
                            pb: 0,
                            mt: 2,
                            display: 'block',
                            textAlign: 'right',
                        },
                    })}
                >
                    <Typography 
                        noWrap onClick={onClickItem} 
                        sx={(theme) => ({ 
                            cursor: 'pointer',
                            [theme.breakpoints.down('sm')]: {
                                mb: 2,
                            },
                        })}
                        data-testid="item"
                    >
                        {prop.name}
                    </Typography>
                    <Typography noWrap>
                        {prop.ABV}%
                    </Typography>
                </Box>
            </Box>
        </Card>
    )
}

IngredientItem.defaultProps = {
    my_item: false,
    user_id: 4
}

export default IngredientItem