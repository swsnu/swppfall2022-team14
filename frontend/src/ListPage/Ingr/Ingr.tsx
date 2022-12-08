import './Ingr.scss'
import React from 'react';
import {useNavigate, useParams} from "react-router";
import {IngredientType} from "../../store/slices/ingredient/ingredient";
import { Box, Card, Typography, Stack, Rating } from "@mui/material";
import { styled } from '@mui/material/styles';


const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
});


const Ingr = (prop: Pick<IngredientType, "image" | "name" | "id">) => {

    const navigate = useNavigate()
    const params = useParams()

    const onClickItem = () => {
        navigate(`/${params.type}/${prop.id}`)
    }

    return(
        <Card sx={{ textAlign: 'left', borderRadius: 4, boxShadow: 5, bgcolor: 'primary.main' }} onClick={onClickItem}>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                <StyledProductImg src={prop.image} />
            </Box>
            <Typography sx={{ p: 3 }} noWrap>
                {prop.name}
            </Typography>
        </Card>
    )
}

export default Ingr