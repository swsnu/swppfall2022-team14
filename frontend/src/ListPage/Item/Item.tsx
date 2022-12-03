import './Item.scss'
import React from 'react';
import { useNavigate, useParams } from "react-router";
import { CocktailItemType } from "../../store/slices/cocktail/cocktail";
import { Box, Card, Typography, Stack, Rating } from "@mui/material";
import { styled } from '@mui/material/styles';
import { cyan } from '@mui/material/colors';


const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'scale-down',
    position: 'absolute',
});


const Item = (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => {

    const navigate = useNavigate()
    const params = useParams()

    const onClickItem = () => {
        navigate(`/${params.type}/${prop.id}`)
    }

    return (
        <Card sx={{ textAlign: 'left' }} onClick={onClickItem}>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                <StyledProductImg src={prop.image} />
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
                <Typography noWrap>
                    {prop.name}
                </Typography>
                <Stack direction="row" justifyContent="flex-start" spacing={1}>
                    {prop.tags.slice(0, 2).map((tag) =>
                        <Box 
                            key={tag} 
                            sx={{ bgcolor: cyan[100], borderRadius: 2, px: 1 }}
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
    /*
    return (
        <div className="list-item" onClick={onClickItem}>
            <div className="list-item-img-wrap">
                <img className="list-item-img" src={prop.image} />
            </div>
            <div className="list-item-main">
                <div className="list-item-name">{prop.name}</div>
            </div>
            <div className="list-item-sub">
                <div>{prop.tags.map(tag => { return `#${tag} ` })}</div>
                <div className="list-item-rate">{prop.rate} / 5점</div>
            </div>

        </div>
    )
    */
}

export default Item