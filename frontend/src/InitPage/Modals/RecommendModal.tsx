import { SetStateAction, Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import React from 'react';
import { getRecommendIngredientList, selectIngredient, postMyIngredients } from '../../store/slices/ingredient/ingredient';
import { selectUser } from '../../store/slices/user/user';
import { useNavigate } from 'react-router';
import Modal from '@mui/material/Modal';
import { Box, Button, Card, FormGroup, Grid, IconButton, ImageListItem, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    overflow: 'scroll',
};

export interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const RecommendModal = (props: prop) => {
    const { isOpen, setIsOpen } = props;
    const dispatch = useDispatch<AppDispatch>();
    const ingredientState = useSelector(selectIngredient)
    const userState = useSelector(selectUser)

    useEffect(() => {
        if (userState.isLogin && userState.user?.id !== null) {
            dispatch(getRecommendIngredientList(userState.token))
        }

    }, [isOpen])


    const navigate = useNavigate()

    const onClickCocktailName = (id: number, type: string) => {
        if (type === 'ST') navigate(`/standard/${id}`)
        else if (type === 'CS') navigate(`/custom/${id}`)
    }

    const onClickItem = (id: number) => {
        navigate(`/ingredient/${id}`)
    }

    const onClickAdd = async (ingredient_id: number) => {
        await dispatch(postMyIngredients({ id: Number(userState.user?.id), ingredients: [ingredient_id], token: userState.token }))
        dispatch(getRecommendIngredientList(userState.token))
    }


    return (
        <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <Stack spacing={2} sx={style}>
                <Grid container spacing={3} columns={4}>
                    {ingredientState.recommendIngredientList.map((ingredient) => (
                        <Grid key={ingredient.id} item md={1} sm={2} xs={4}>
                            <Card
                                sx={{
                                    width: 1, textAlign: 'left', borderRadius: 4, boxShadow: 5, bgcolor: 'primary.main',
                                }}
                            >
                                <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" sx={{ width: 1, height: 20 }}>
                                    <IconButton
                                        size="small"
                                        data-testid="add"
                                        sx={{
                                            mr: 1,
                                            mt: 1
                                        }}
                                        onClick={() => onClickAdd(ingredient.id)}
                                    >
                                        <AddIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
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
                                        onClick={() => onClickItem(ingredient.id)}
                                        sx={(theme) => ({
                                            width: 1, aspectRatio: 1, cursor: 'pointer',
                                            [theme.breakpoints.down('sm')]: {
                                                width: 0.4,
                                                mx: 1,
                                            },
                                        })}
                                    >
                                        <img
                                            src={ingredient.image}
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
                                            noWrap onClick={() => onClickItem(ingredient.id)}
                                            sx={(theme) => ({
                                                cursor: 'pointer',
                                                [theme.breakpoints.down('sm')]: {
                                                    mb: 2,
                                                },
                                            })}
                                        >
                                            {ingredient.name}
                                        </Typography>
                                        <Typography noWrap>
                                            {ingredient.ABV}%
                                        </Typography>
                                    </Box>
                                </Box>
                                {ingredientState.availableCocktails.find(info => info?.ingredient_id === ingredient.id) ?
                                    <FormGroup row sx={{ gap: 1, p: 2 }}>
                                        <Typography
                                            fontSize={12} noWrap
                                            sx={(theme) => ({
                                                width: 1,
                                                [theme.breakpoints.down('sm')]: {
                                                    width: 'fit-content',
                                                    mt: 0.25,
                                                    mr: 0.25,
                                                },
                                            })}
                                        >
                                            이것만 있으면!
                                        </Typography>
                                        {ingredientState.availableCocktails
                                            .find(info => info.ingredient_id === ingredient.id)?.cocktails
                                            .map(cocktail => (
                                                <Button
                                                    key={cocktail.id}
                                                    size="small"
                                                    sx={{ bgcolor: 'primary.light', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                                                    onClick={() => onClickCocktailName(cocktail.id, cocktail.type)}
                                                >
                                                    <Typography variant="caption" color='text.primary'>
                                                        {cocktail.name}
                                                    </Typography>
                                                </Button>
                                            ))}
                                    </FormGroup> :
                                    <Typography sx={{ p: 2 }} fontSize={12} noWrap>
                                        일반적으로 많이 들어가는 재료
                                    </Typography>
                                }
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Modal >
    );
};

export default RecommendModal;