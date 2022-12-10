import { useState } from "react"
import React from 'react';
import { useSelector } from "react-redux"
import AddIngredientModal from "../common/Modals/AddIngredientModal";
import IngredientItem from "../common/Components/IngredientItem";
import { selectIngredient } from "../store/slices/ingredient/ingredient";
import { selectUser } from "../store/slices/user/user";
import { Grid, IconButton, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const MyIngredient = () => {
    const ingredientState = useSelector(selectIngredient)
    const userState = useSelector(selectUser)


    const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
    const onClickAdd = () => {
        setIsAddIngredientOpen(true)
    }


    return (
        <Stack spacing={1} sx={{ width: 1, pr: 3, py: 2 }}>
            <Stack direction="row" justifyContent="flex-end">
                <IconButton 
                    size="large"
                    onClick={onClickAdd}
                >
                    <AddIcon />
                </IconButton>
            </Stack>
            <Grid container columns={4} spacing={3} sx={{ pr: 3 }}>
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
            <AddIngredientModal isOpen={isAddIngredientOpen} setIsOpen={setIsAddIngredientOpen} user_id={Number(userState.user?.id)} />
        </Stack>

    )
}


export default MyIngredient