import { SetStateAction, Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import React from 'react';
import { getRecommendIngredientList, selectIngredient, postMyIngredients } from '../../store/slices/ingredient/ingredient';
import { selectUser } from '../../store/slices/user/user';
import { useNavigate } from 'react-router';
import Modal from '@mui/material/Modal';
import { Box, Button, Card, FormGroup, Grid, IconButton, Stack, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
});

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

    const onClickAdd = (ingredient_id: number) => {
        dispatch(postMyIngredients({ id: Number(userState.user?.id), ingredients: [ingredient_id], token: userState.token }))
        dispatch(getRecommendIngredientList(userState.token))
    }


    return (
        <Modal 
            open={isOpen} 
            onClose={() => setIsOpen(false)}
        >
            <Stack spacing={2} sx={style}>
                <Grid container spacing={3}>
                    {ingredientState.recommendIngredientList.map((ingredient) => (
                        <Grid key={ingredient.id} item xs={12} sm={6} md={3}>
                            <Card 
                                sx={{ height: 1, textAlign: 'left', borderRadius: 4, boxShadow: 5, bgcolor: 'primary.main' }}
                            >
                                <Stack direction="row" alignItems="flex-start" justifyContent="flex-end">
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
                                    sx={{ pt: '100%', position: 'relative' }}
                                    onClick={() => navigate(`/ingredient/${ingredient.id}`)}
                                >
                                    <StyledProductImg src={ingredient.image} />
                                </Box>
                                <Stack direction="row" spacing={2} sx={{ p: 2 }} justifyContent="space-between">
                                    <Typography noWrap>
                                        {ingredient.name}
                                    </Typography>
                                    <Typography noWrap>
                                        {ingredient.ABV}%
                                    </Typography>
                                </Stack>
                                {ingredientState.availableCocktails.find(info => info?.ingredient_id === ingredient.id) ? 
                                    <Stack spacing={1} sx={{ p: 2 }}>
                                        <Typography fontSize={12} noWrap>
                                            이것만 있으면!
                                        </Typography>
                                        <FormGroup row sx={{ gap: 1 }}>
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
                                        </FormGroup>
                                    </Stack> : 
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