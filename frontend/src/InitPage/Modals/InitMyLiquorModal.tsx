import { SetStateAction, Dispatch } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectIngredient } from '../../store/slices/ingredient/ingredient';
import IngredientItem from '../../common/Components/IngredientItem';
import Modal from '@mui/material/Modal';
import { Grid, Stack } from "@mui/material";

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

const InitMyLiqourModal = (props: prop) => {

    const { isOpen, setIsOpen } = props;
    const ingredientState = useSelector(selectIngredient)

    return (
        <Modal 
            open={isOpen} 
            onClose={() => setIsOpen(false)}
        >
            <Stack sx={style}>
                <Grid container columns={4} spacing={3}>
                    {ingredientState.myIngredientList.map(ingredient => (
                        <Grid key={ingredient.id} item xs={1}>
                            <IngredientItem 
                                key={ingredient.id} 
                                image={ingredient.image} 
                                name={ingredient.name} 
                                id={ingredient.id} 
                                ABV={ingredient.ABV} 
                                my_item={true} 
                            />
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Modal >
    );
};

export default InitMyLiqourModal;