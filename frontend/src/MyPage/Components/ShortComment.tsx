import styles from './ShortComment.module.scss'
import React from 'react';
import { useNavigate } from 'react-router';
import { CocktailItemType } from '../../store/slices/cocktail/cocktail';
import { ImageListItem, Link, Stack, Typography } from "@mui/material";

export interface CommentType {
    id: number
    cocktail: CocktailItemType;
    content: string;
    updated_at: Date;
}

const ShortComment = (prop: CommentType) => {

    const cocktail_url = (
        prop.cocktail.type === 'CS' ?
        `/custom/${prop.cocktail.id}` :
        `/standard/${prop.cocktail.id}`
    )

    const month = prop.updated_at.toString().slice(5, 7)
    const day = prop.updated_at.toString().slice(8, 10)
    const hour = prop.updated_at.toString().slice(11, 13)
    const min = prop.updated_at.toString().slice(14, 16)

    return (
        <Stack spacing={1} sx={{ width: 1 }}>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    width: 1,
                    p: 2,
                    bgcolor: 'primary.main',
                    borderRadius: 2
                }}
            >
                <Typography fontSize={16}>
                    {month}월 {day}일
                </Typography>
                {prop.updated_at.toString()}
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ px: 2 }}>
                <Stack spacing={3} alignItems="flex-start" justifyContent="space-between">
                    <Typography fontSize={20} sx={{ whiteSpace: 'pre-wrap' }}>
                        {prop.content}
                    </Typography>
                    <Stack spacing={1} alignItems="flex-start">
                        <Stack direction="row">
                            <Link 
                                href={cocktail_url} 
                                underline="always" 
                                sx={{ cursor: 'pointer', color: 'text.secondary' }}
                            >
                                {prop.cocktail.name}
                            </Link>
                            <Typography>
                                에 남긴 댓글
                            </Typography>
                        </Stack>
                        <Typography fontSize={12}>
                            {hour}:{min}
                        </Typography>
                    </Stack>
                </Stack>
                <ImageListItem sx={{ width: 0.2, height: 'fit-content' }}>
                    <img
                        src={prop.cocktail.image}
                        style={{ borderRadius: 20, height: 'auto' }}
                    />
                </ImageListItem>
            </Stack>
        </Stack>
    )
}


export default ShortComment;