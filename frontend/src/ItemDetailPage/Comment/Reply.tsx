import './Reply.scss'
import './Comment.scss'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { commentActions, deleteComment, editComment, selectComment } from '../../store/slices/comment/comment';
import { CommentType } from '../../store/slices/comment/comment';
import { Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {selectUser} from "../../store/slices/user/user";

interface AccessCommentType extends CommentType {
    accessible: boolean;
}

const Reply = (props: AccessCommentType) => {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser)
    const deleteCommentHandler = () => {
        const data = {
            id: props.id,
            token: userState.token
        }
        dispatch(deleteComment(data));
    }
    
    const commentState = useSelector(selectComment)
    const [content, setContent] = useState<string>("")
    const [openSetting, setOpenSetting] = useState(false)

    const nullStateHandler = () => {
        dispatch(commentActions.nullCommentState(props))
    }

    const editStateHandler = () => {
        dispatch(commentActions.editCommentState(props))
        setContent(props.content)
    }

    const editCommentHandler = () => {
        if(userState.token !== null){
            dispatch(editComment({id: props.id, content: content, author_name: userState.token}))
        }
    }
    
    if (commentState.commentItem?.id == props.id && commentState.state == "EDIT") {
        return (
            <Stack direction="row" spacing={1} alignItems='flex-start' sx={{ width: 1 }}>
                <SubdirectoryArrowRightIcon fontSize='small' />
                <Stack alignItems='flex-start' sx={{ width: 1 }}>
                    <Typography variant="button" align='left' sx={{ mb: -0.5 }}>
                        {props.author_name}
                    </Typography>
                    <TextField 
                        data-testid="edit_comment_input"
                        variant="standard" 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        fullWidth 
                    />
                    <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ width: 1 }}>
                        <Button 
                            size="small"
                            sx={{ bgcolor: 'background.default', borderRadius: 3, py: 1, textAlign: 'center' }}
                            onClick={nullStateHandler}
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
                            onClick={editCommentHandler}
                            disabled={!content}
                        >
                            <Typography variant="caption" color='text.primary'>
                                수정
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        )
    }
    return (
        <Stack direction="row" spacing={1} alignItems='flex-start' sx={{ width: 1 }}>
            <SubdirectoryArrowRightIcon fontSize='small' />
            <Stack alignItems='flex-start' sx={{ width: 1 }}>
                <Stack direction="row" alignItems='center' justifyContent="space-between" sx={{ width: 1, mb: -0.5 }}>
                    <Typography variant="button" align='left'>
                        {props.author_name}
                    </Typography>
                    {props.accessible && 
                        (openSetting ?
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                {props.accessible && 
                                    <IconButton size='small' onClick={editStateHandler} data-testid={"edit_comment_button"}>
                                        <EditIcon fontSize='small' />
                                    </IconButton>
                                }
                                {props.accessible && 
                                    <IconButton size='small' onClick={deleteCommentHandler} data-testid={"delete_comment_button"}>
                                        <DeleteIcon fontSize='small' />
                                    </IconButton>
                                }
                            </Stack> :
                            <IconButton size='small' onClick={() => setOpenSetting(true)} data-testid={"more_button"}>
                                <MoreVertIcon fontSize='small' />
                            </IconButton>
                        )
                    }
                </Stack>
                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }} align='left'>
                    {props.content}
                </Typography>
            </Stack>
        </Stack>
    )
};

export default Reply;