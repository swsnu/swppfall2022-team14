import './AddIngredientModal.scss'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredientList, IngredientType, selectIngredient } from '../../store/slices/ingredient/ingredient';
import { useState, useEffect } from 'react';
import { AppDispatch } from '../../store';
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

export interface IProps {
    isOpen: boolean;
    close: () => void;
    addedIngredientList: string[];
    setNewIngrdient: React.Dispatch<React.SetStateAction<IngredientType|null>>;
}

const AddIngredientModal = (props: IProps) => {
    const { isOpen, close, addedIngredientList, setNewIngrdient} = props;
    const ingredientState = useSelector(selectIngredient)
    const dispatch = useDispatch<AppDispatch>()
    const [input, setInput] = useState<string>("")

    const onClickIngredient = (ingredient: IngredientType) => {
        setNewIngrdient(ingredient);
        close();
    };

    useEffect(() => {
        dispatch(fetchIngredientList(input))
    },[input])

    return (
        <Modal 
            open={isOpen} 
            onClose={close}
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
                <Grid container spacing={3}>
                    {ingredientState.ingredientList
                        .filter((ingredient) => !addedIngredientList.includes(ingredient.name))
                        .map((ingredient) => (
                            <Grid key={ingredient.id} item xs={12} sm={6} md={2}>
                                <Card 
                                    data-testid="ingredient"
                                    sx={{ textAlign: 'left', borderRadius: 4, boxShadow: 5, bgcolor: 'primary.main' }} 
                                    onClick={() => onClickIngredient(ingredient)}
                                >
                                    <Box sx={{ pt: '100%', position: 'relative' }}>
                                        <StyledProductImg src={ingredient.image} />
                                    </Box>
                                    <Typography sx={{ p: 3 }} noWrap>
                                        {ingredient.name}
                                    </Typography>
                                </Card>
                            </Grid> 
                        )
                    )}
                </Grid>
            </Stack>
        </Modal>
    )
};

export default AddIngredientModal;