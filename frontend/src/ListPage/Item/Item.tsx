import './Item.scss'
import React from 'react';
import { useNavigate, useParams } from "react-router";
import { CocktailItemType } from "../../store/slices/cocktail/cocktail";
import { Box, Card, Typography, Stack, Rating } from "@mui/material";
import { styled } from '@mui/material/styles';


const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
});


const Item = (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => {

    const navigate = useNavigate()
    const params = useParams()

    const onClickItem = () => {
        navigate(`/${params.type}/${prop.id}`)
    }

    return (
        <Card sx={{ textAlign: 'left', borderRadius: 4, boxShadow: 5 }} onClick={onClickItem}>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                <StyledProductImg src={prop.image} />
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
                <Typography noWrap>
                    {prop.name}
                </Typography>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1} sx={{ height: 30 }}>
                    {prop.tags.slice(0, 2).map((tag) =>
                        <Box 
                            key={tag} 
                            sx={{ bgcolor: 'primary.light', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                        >
                            #{tag}
                        </Box>
                    )}
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography noWrap>
                        {prop.rate.toFixed(1)}
                    </Typography>
                    <Rating value={prop.rate} precision={0.1} readOnly />
                </Stack>
            </Stack>
        </Card>
    )
}

export default Item