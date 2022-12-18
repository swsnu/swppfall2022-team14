import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { selectCocktail, getCocktail, toggleBookmark, deleteCocktail } from "../store/slices/cocktail/cocktail";
import Comment from "./Comment/Comment";
import './ItemDetailPage.scss';
import React from 'react';
import { fetchCommentListByCocktailId, postComment, selectComment } from "../store/slices/comment/comment";
import axios from 'axios';
import LoginModal from "../InitPage/Modals/LoginModal";
import { selectUser } from "../store/slices/user/user";
import { postRate, editRate, deleteRate, getMyRate, selectRate, updateRate } from "../store/slices/rate/rate";
import { Box, Button, Checkbox, FormGroup, ImageListItem, Divider, IconButton, Modal, Rating, Stack, TextField, Typography } from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ClipLoader } from 'react-spinners';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default function ItemDetailPage() {
    const { type, id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const cocktailState = useSelector(selectCocktail);
    const commentState = useSelector(selectComment);
    const userState = useSelector(selectUser)
    const rateState = useSelector(selectRate)
    const navigate = useNavigate()
    const onIngredientClick = (id: number) => {
        navigate(`/ingredient/${id}`)
    }
    const [content, setContent] = useState<string>("")
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false)
    const [, setScore] = useState<number | null>(0)

    const [rateOpen, setRateOpen] = useState(false);
    const handleRateOpen = () => {
        if (userState.isLogin) {
            setRateOpen(true)
        }
        else {
            setIsLoginOpen(true)
        }
    };
    const handleRateClose = () => setRateOpen(false);

    const [openAddComment, setOpenAddComment] = useState(false);

    const cocktail = cocktailState.cocktailItem;
    const isCustom = cocktail?.type === "CS";

    useEffect(() => {
        if (userState.isLogin) {
            const data = {
                cocktail_id: Number(id),
                token: userState.token
            }
            dispatch(getMyRate(data))
            setScore(rateState.myRate)
        }
        dispatch(getCocktail(Number(id)));
        dispatch(fetchCommentListByCocktailId(Number(id)));
    }, []);

    useEffect(() => {
        if (cocktail) {
            setScore(rateState.myRate);
            dispatch(updateRate(Number(id)));
        }
    }, [cocktail,rateState.myRate]);

    const createCommentHandler = () => {
        if (userState.isLogin && userState.token !== null) {
            const data = {
                content: content,
                parent_comment: null,
                cocktail: Number(id),
                token: userState.token
            }
            dispatch(postComment(data));
            setContent("")
        }
    }

    const deleteCocktailHandler = () => {
        if (userState.isLogin && userState.token) {
            dispatch(deleteCocktail({ cocktail_id: Number(id), token: userState.token }));
            navigate("/custom")
        }

    }

    const toggleBookmarkHandler = () => {
        if (userState.isLogin && userState.token) {
            dispatch(toggleBookmark({ cocktail_id: Number(id), token: userState.token }));
        }
        else {
            setIsLoginOpen(true)
        }
    }

    const onChangeRate = async (changedScore: number | null) => {
        if (userState.isLogin) {
            if (changedScore) {
                const data = { cocktail_id: Number(id), score: changedScore, token: userState.token };
                if (rateState.myRate !== null) {  // PUT score
                    await dispatch(editRate(data));
                } else {      // POST score
                    await dispatch(postRate(data));
                }
            } else {
                const data = { cocktail_id: Number(id), token: userState.token };
                await dispatch(deleteRate(data));
            }
            dispatch(updateRate(Number(id)));
            setRateOpen(false)
        }
    }

    const detectLogin = () => {
        if(!userState.isLogin){
            setIsLoginOpen(true)
        }
    }

    if (cocktailState.itemStatus == "loading") {
        return (
            <>
                {/*<NavBar />*/}
                <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ width: 1, pt: 20 }}>
                    <ClipLoader
                        data-testid="load-button"
                        color='primary.light'
                        loading 
                    />
                </Stack>
            </>
        )
    }
    else if (cocktailState.itemStatus == "failed" || !cocktail) {
        return (
            <>
                {/*<NavBar />*/}
                <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ width: 1, pt: 20 }}>
                    <Typography 
                        variant="h6" 
                        color="primary.light"
                    >
                        서버로부터 정보를 불러오지 못하였습니다.
                    </Typography>
                </Stack>
            </>
        )
    }
    // Type mismatch
    else if (!((isCustom && type === "custom") || (!isCustom && type === "standard"))) {
        return (
            <>
                {/*<NavBar />*/}
                <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ width: 1, pt: 20 }}>
                    <Typography 
                        variant="h6" 
                        color="primary.light"
                    >
                        칵테일 타입이 일치하지 않습니다.
                    </Typography>
                </Stack>
            </>
        )
    }
    else {
        return (
            <>
                {/*<NavBar />*/}
                <Stack alignItems="flex-start" spacing={2} sx={{ width: 1, p: 3 }}>
                    <Stack
                        alignItems="flex-start" spacing={0.5}
                        sx={(theme) => ({
                            width: 1,
                            [theme.breakpoints.down('md')]: {
                                pl: 4
                            },
                        })}
                    >
                        <Typography
                            variant="h2"
                            sx={(theme) => ({
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: 30
                                },
                            })}
                        >
                            {cocktail.name}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={(theme) => ({
                                pl: 1,
                                [theme.breakpoints.down('sm')]: {
                                    pl: 0.5,
                                    fontSize: 15
                                },
                            })}
                        >
                            {cocktail.name_eng}
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
                        <Typography sx={{ color: 'primary.light' }} variant="body2" align="left">
                            {isCustom && `created by ${cocktail.author_name}`}
                        </Typography>
                        <Stack direction="row" justifyContent="flex-end">
                            {(Number(userState.user?.id) === cocktail.author_id && isCustom) &&
                                <IconButton onClick={() => deleteCocktailHandler()}
                                    data-testid={"delete_button"}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                            {(Number(userState.user?.id) === cocktail.author_id && isCustom) &&
                                <IconButton onClick={() => navigate(`/custom/${id}/edit`)}
                                    data-testid={"edit_button"}>
                                    <EditIcon />
                                </IconButton>
                            }
                            <Checkbox
                                data-testid={'bookmark_button'}
                                icon={<BookmarkBorderIcon sx={{ color: 'text.icon' }} />}
                                checkedIcon={<BookmarkIcon sx={{ color: 'text.icon' }} />}
                                onClick={toggleBookmarkHandler}
                                checked={cocktail.is_bookmarked}
                            />
                            <Button variant="contained" onClick={handleRateOpen}
                                sx={{
                                    bgcolor: 'primary.dark',
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    '&:hover': {
                                        backgroundColor: 'secondary.main',
                                        boxShadow: 2,
                                    },
                                }}
                            >
                                별점주기
                            </Button>
                            <Modal open={rateOpen} onClose={handleRateClose}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 300,
                                        bgcolor: 'background.paper',
                                        border: '2px solid #000',
                                        boxShadow: 24,
                                        p: 4,
                                    }}
                                >
                                    <Stack alignItems="center" justifyContent="space-between" spacing={2} sx={{ width: 1, height: 1 }}>
                                        <Rating
                                            data-testid="rating_button"
                                            value={rateState.myRate}
                                            precision={0.5}
                                            onChange={(event, newValue) => {
                                                onChangeRate(newValue)
                                            }}
                                        />
                                        <Typography variant="body1">
                                            별점을 남겨주세요!
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Modal>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: 1 }}>
                        <ImageListItem sx={{ width: 0.3, height: 'fit-content' }}>
                            <img
                                src={cocktail.image}
                                style={{ borderRadius: 20, height: 'auto' }}
                            />
                        </ImageListItem>
                        <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1 }}>
                            <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1, p: 2, bgcolor: 'primary.main', borderRadius: 3 }}>
                                <Rating value={Number(rateState.rate)} precision={0.1} readOnly />
                                <Stack spacing={1} alignItems="flex-start">
                                    <Typography variant="body1">
                                        {cocktail.filter_type_one} {cocktail.filter_type_one ? "칵테일" : null}{cocktail.filter_type_one && cocktail.filter_type_two ? "," : null} {cocktail.filter_type_two}
                                    </Typography>
                                    <Typography variant="body1">
                                        {cocktail.ABV.toFixed(1)}%
                                    </Typography>
                                    <Typography variant="body1">
                                        {cocktail.price_per_glass.toLocaleString()}원
                                    </Typography>
                                </Stack>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        bgcolor: `#${cocktail.color}`
                                    }}
                                />
                                <Typography variant="body2" align='left' sx={{ whiteSpace: 'pre-wrap' }}>
                                    {cocktail.introduction}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Box display="flex" sx={{ width: 1 }}>
                        <Box
                            sx={(theme) => ({
                                [theme.breakpoints.down('sm')]: {
                                    display: 'none',
                                },
                                [theme.breakpoints.up('sm')]: {
                                    width: 0.25,
                                },
                            })}
                        />
                        <Stack 
                            alignItems="flex-start" 
                            justifyContent="flex-start" 
                            spacing={1} 
                            sx={(theme) => ({
                                pr: 2,
                                [theme.breakpoints.down('sm')]: {
                                    width: 1,
                                },
                                [theme.breakpoints.up('sm')]: {
                                    width: 0.75
                                },
                            })}
                        >
                            <Typography variant="subtitle1">
                                Recipe:
                            </Typography>
                            <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1, px: 2 }}>
                                <FormGroup row sx={{ gap: 1, width: 1 }}>
                                    {cocktail.ingredients?.map((ingre) => {
                                        return (
                                            <Button
                                                data-testid={`ingre_button_${ingre.id}`}
                                                key={ingre.id}
                                                sx={{ bgcolor: 'primary.light', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                                                onClick={() => onIngredientClick(ingre.id)}
                                            >
                                                <Typography color='text.primary'>
                                                    {ingre.name}
                                                    &nbsp;
                                                    {ingre.amount && ingre.amount}
                                                    &nbsp;
                                                    {ingre.amount && ingre.recipe_unit}
                                                </Typography>
                                            </Button>
                                        )
                                    })}
                                </FormGroup>
                                <Typography variant="body2" align='left' sx={{ whiteSpace: 'pre-wrap' }}>
                                    {cocktail.recipe}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    <Divider flexItem />
                    <FormGroup row sx={{ gap: 1, width: 1, px: 1 }}>
                        {cocktail.tags.map((tag, idx) => {
                            return (
                                <Typography key={`${tag}_${idx}`} variant="body2" align='left'>
                                    #{tag}
                                </Typography>
                            )
                        })}
                    </FormGroup>
                    {cocktail.tags.length !== 0 && <Divider flexItem />}
                    <Stack spacing={1} sx={{ width: 1, pt: 2 }} onClick={detectLogin}>
                        <Typography variant="h6" align='left'>
                            {userState.user?.username}
                        </Typography>
                        <TextField
                            data-testid="add_comment_input"
                            variant="standard"
                            placeholder="댓글 추가..."
                            onClick={() => setOpenAddComment(true)}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            multiline
                            fullWidth
                        />
                        {openAddComment &&
                            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ width: 1 }}>
                                <Button
                                    size="small"
                                    sx={{ bgcolor: 'background.default', borderRadius: 3, py: 1, textAlign: 'center' }}
                                    onClick={() => setOpenAddComment(false)}
                                >
                                    <Typography variant="caption" color='text.primary'>
                                        취소
                                    </Typography>
                                </Button>
                                <Button
                                    size="small"
                                    sx={{
                                        bgcolor: content ? 'primary.light' : 'background.default', borderRadius: 3, py: 1, textAlign: 'center',
                                    }}
                                    onClick={() => { createCommentHandler(); setOpenAddComment(false); }}
                                    disabled={!content}
                                >
                                    <Typography variant="caption" color='text.primary'>
                                        댓글
                                    </Typography>
                                </Button>
                            </Stack>
                        }
                    </Stack>
                    <Stack spacing={3} sx={{ width: 1, pt: 2 }}>
                        {[...commentState.commentList].reverse().map((comment) => {
                            if (!comment.parent_comment) {
                                return (
                                    <Comment
                                        key={`${comment.id}_comment`}
                                        id={comment.id}
                                        author_id={comment.author_id}
                                        author_name={comment.author_name}
                                        content={comment.content}
                                        created_at={comment.created_at}
                                        updated_at={comment.updated_at}
                                        parent_comment={null}
                                        is_deleted={comment.is_deleted}
                                        cocktail={comment.cocktail}
                                        accessible={Number(userState.user?.id) == comment.author_id}
                                    />
                                )
                            }
                        })}
                    </Stack>
                </Stack>
                <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            </>
        )
    }
}