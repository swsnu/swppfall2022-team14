import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import React from 'react';
import { CocktailItemType, toggleBookmark } from "../../store/slices/cocktail/cocktail";
import { selectUser } from "../../store/slices/user/user";
import { Box, Card, Checkbox, Typography, Stack, Rating } from "@mui/material";
import { styled } from '@mui/material/styles';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
});

const Item = (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags" | "is_bookmarked" | "ABV" | "price_per_glass">) => {

    const navigate = useNavigate()
    const userState = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>();
    
    const toggleBookmarkHandler = () => {
        if (userState.isLogin && userState.token) {
            dispatch(toggleBookmark({ cocktail_id: prop.id, token: userState.token }));
        }
    }

    const onClickItem = () => {
        if (prop.type === 'CS') navigate(`/custom/${prop.id}`)
        else navigate(`/standard/${prop.id}`)
    }

    return (
        <Card data-testid="item" sx={{ cursor: 'pointer', textAlign: 'left', borderRadius: 4, boxShadow: 5, bgcolor: 'primary.main' }}>
            <Box onClick={onClickItem} sx={{ pt: '100%', position: 'relative', cursor: 'pointer' }}>
                <StyledProductImg src={prop.image} />
            </Box>
            <Stack spacing={1} sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography onClick={onClickItem} sx={{ cursor: 'pointer' }} noWrap>
                        {prop.name}
                    </Typography>
                    <Checkbox
                        sx={{ mt: -1, mr: -1 }}
                        icon={<BookmarkBorderIcon sx={{ color: 'text.icon' }} />}
                        checkedIcon={<BookmarkIcon sx={{ color: 'text.icon' }} />}
                        onClick={toggleBookmarkHandler}
                        checked={prop.is_bookmarked}
                    />
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Typography variant="body1">
                        {Math.round(prop.ABV)}%
                    </Typography>
                    <Typography variant="body1">
                        {prop.price_per_glass.toLocaleString()}원
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1} sx={{ height: 30 }}>
                    {prop.tags.slice(0, 2).map((tag) =>
                        <Box 
                            key={tag} 
                            sx={{ bgcolor: 'primary.light', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                        >
                            <Typography fontSize={12}>
                                #{tag}
                            </Typography>
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