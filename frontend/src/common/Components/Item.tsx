import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import React from 'react';
import { CocktailItemType, toggleBookmark } from "../../store/slices/cocktail/cocktail";
import { selectUser } from "../../store/slices/user/user";
import { Box, Card, Checkbox, FormGroup, ImageListItem, Typography, Stack, Rating } from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

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
        <Card 
            data-testid="item" 
            sx={(theme) => ({
                width: 1, textAlign: 'left', borderRadius: 4, boxShadow: 5, bgcolor: 'primary.main',
                [theme.breakpoints.down('sm')]: {
                    display: 'flex',
                },
            })}
        >
            <ImageListItem 
                onClick={onClickItem} 
                sx={(theme) => ({ 
                    width: 1, aspectRatio: 1, cursor: 'pointer', 
                    [theme.breakpoints.down('sm')]: {
                        width: 0.3,
                    },
                })}
            >
                <img 
                    src={prop.image} 
                    loading="lazy" 
                    style={{
                        aspectRatio: 1
                    }} 
                />
            </ImageListItem>
            <Stack 
                spacing={1} 
                sx={(theme) => ({ 
                    width: 1, p: 3,
                    [theme.breakpoints.down('sm')]: {
                        width: 0.7,
                        p: 2,
                    },
                })}
            >
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
                <FormGroup row sx={{ gap: 1, width: 1 }}>
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
                </FormGroup>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography 
                        noWrap
                        sx={(theme) => ({
                            [theme.breakpoints.down('md')]: {
                                display: 'none'
                            },
                        })}
                    >
                        {prop.rate.toFixed(1)}
                    </Typography>
                    <Rating value={prop.rate} precision={0.1} readOnly />
                </Stack>
            </Stack>
        </Card>
    )
}


export default Item