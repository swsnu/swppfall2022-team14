import { useState, SetStateAction, Dispatch } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IngredientType, PostIngredientProps, postMyIngredients, selectIngredient } from '../../store/slices/ingredient/ingredient';
import { AppDispatch } from '../../store';
import {selectUser} from "../../store/slices/user/user";
import Modal from '@mui/material/Modal';
import { Box, Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

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

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
});

interface prop {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    user_id: number;
}

const AddIngredientModal = (props: prop) => {

    const { isOpen, setIsOpen, user_id } = props;
    const ingredientState = useSelector(selectIngredient)
    const userState = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()
    const [newIngredients, setNewIngredients] = useState<number[]>([]);
    const [input, setInput] = useState<string>("")

    const onClickIngredient = (ingredient_id: number) => {
        if (newIngredients.includes(ingredient_id)) {
            setNewIngredients(newIngredients.filter((ingre) => (ingre !== ingredient_id)))
        } else {
            setNewIngredients([...newIngredients, ingredient_id]);
        }
    };

    const onClickEdit = (body: PostIngredientProps) => {
        dispatch(postMyIngredients(body))
        setNewIngredients([])
        setIsOpen(false)
    }

    const is_not_my_ingredient_filter = (ingredient: IngredientType) => {
        const my_ingredient_id_list = ingredientState.myIngredientList.map(ingredient => ingredient.id)
        return !my_ingredient_id_list.includes(ingredient.id)
    }

    const onClose = () => {
        onClickEdit({ id: user_id, ingredients: newIngredients, token: userState.token }); 
        setNewIngredients([])
        setIsOpen(false);
    }

    return (
        <Modal 
            open={isOpen} 
            onClose={onClose}
        >
            <Stack sx={style}>
                <Stack 
                    direction="row" justifyContent="flex-end"
                    sx={{
                        mr: 1,
                        mb: 3
                    }}
                >
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
                </Stack>
                <Grid container spacing={3} columns={4}>
                    {ingredientState.ingredientList
                        .filter(ingredient => is_not_my_ingredient_filter(ingredient))
                        .map((ingredient) => (
                            <Grid key={ingredient.id} item xs={1}>
                                <Card 
                                    sx={{ 
                                        cursor: 'pointer',
                                        pt: 2,
                                        textAlign: 'left', 
                                        borderRadius: 4, 
                                        boxShadow: 5, 
                                        bgcolor: (
                                            newIngredients.includes(ingredient.id) ? 
                                            'secondary.dark' :
                                            'primary.main' 
                                        )
                                    }} 
                                    onClick={() => onClickIngredient(ingredient.id)}
                                >
                                    <Box sx={{ pt: '100%', position: 'relative' }}>
                                        <StyledProductImg src={ingredient.image} />
                                    </Box>
                                    <Stack direction="row" spacing={2} sx={{ p: 3 }} justifyContent="space-between">
                                        <Typography noWrap>
                                            {ingredient.name}
                                        </Typography>
                                        <Typography noWrap>
                                            {ingredient.ABV}%
                                        </Typography>
                                    </Stack>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            </Stack>
        </Modal >
    );
};

export default AddIngredientModal;