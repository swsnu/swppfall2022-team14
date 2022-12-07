import './Comment.scss'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { CommentType, deleteComment, editComment, postComment, selectComment } from '../../store/slices/comment/comment';
import Reply from './Reply';
import { commentActions } from "../../store/slices/comment/comment"
import {selectUser} from "../../store/slices/user/user";
import LoginModal from "../../InitPage/Modals/LoginModal";
import { Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface AccessCommentType extends CommentType {
    accessible: boolean;
}

const Comment = (props: AccessCommentType) => {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser)

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const deleteCommentHandler = () => {
        const data = {
            id: props.id,
            token: userState.token
        }
        dispatch(deleteComment(data));
    }
    
    const commentState = useSelector(selectComment)
    const [content, setContent] = useState<string>("")
    const [replyContent, setReplyContent] = useState<string>("")
    const [openSetting, setOpenSetting] = useState(false)
    const [openAddReply, setOpenAddReply] = useState(false);
    
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

    const replyStateHandler = () => {
        dispatch(commentActions.replyCommentState(props))
    }

    const replyCommentHandler = () => {
        if(userState.isLogin && userState.token !== null){
            dispatch(postComment({cocktail: props.cocktail.id, parent_comment:props.id, content:replyContent, token: userState.token}))
            setReplyContent("")
        }
        else{
            setIsLoginOpen(true)
        }
    }

    if (commentState.commentItem?.id == props.id && commentState.state == "EDIT") {
        return (
            <Stack spacing={1} alignItems='flex-start' sx={{ width: 1 }}>
                <Typography variant="button" align='left' sx={{ mb: -0.5 }}>
                    {props.author_name}
                </Typography>
                <TextField 
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
                <Stack spacing={1} alignItems='flex-start' sx={{ width: 1 }}>
                    {commentState.commentList.map((comment) => {
                        if (comment.parent_comment == props.id) {
                            return (
                                <Reply
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
        )
    } else {
        return (
            <Stack spacing={0.2} alignItems='flex-start' sx={{ width: 1 }}>
                <Stack direction="row" alignItems='center' justifyContent="space-between" sx={{ width: 1, mb: -0.5 }}>
                    <Typography variant="button" align='left'>
                        {props.author_name}
                    </Typography>
                    {openSetting ?
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <IconButton size='small' onClick={replyStateHandler} disabled={props.is_deleted}>
                                <SubdirectoryArrowRightIcon fontSize='small' />
                            </IconButton>
                            {props.accessible && 
                                <IconButton size='small' onClick={editStateHandler}>
                                    <EditIcon fontSize='small' />
                                </IconButton>
                            }
                            {props.accessible && 
                                <IconButton size='small' onClick={deleteCommentHandler}>
                                    <DeleteIcon fontSize='small' />
                                </IconButton>
                            }
                        </Stack> :
                        <IconButton size='small' onClick={() => setOpenSetting(true)}>
                            <MoreVertIcon fontSize='small' />
                        </IconButton>
                    }
                </Stack>
                <Typography variant='body2' sx={{ whiteSpace: 'pre' }} align='left'>
                    {props.content}
                </Typography>
                <Stack spacing={3} alignItems='flex-start' sx={{ width: 1, pt: 3, pl: 2 }}>
                    {commentState.commentList.map((comment) => {
                        if (comment.parent_comment == props.id) {
                            return (
                                <Reply
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
                {
                    (commentState.commentItem?.id == props.id && commentState.state == "REPLY") &&
                    <Stack direction="row" spacing={1} alignItems='flex-start' sx={{ width: 1, pt: 3, pl: 2 }}>
                        <SubdirectoryArrowRightIcon fontSize='small' />
                        <Stack spacing={1} sx={{ width: 1 }}>
                            <Typography variant="button" align='left'>
                                {userState.user?.username}
                            </Typography>
                            <TextField 
                                variant="standard" 
                                placeholder="댓글 추가..." 
                                onClick={() => setOpenAddReply(true)}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                multiline
                                fullWidth 
                            />
                            {openAddReply &&
                                <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ width: 1 }}>
                                    <Button 
                                        size="small"
                                        sx={{ bgcolor: 'background.default', borderRadius: 3, py: 1, textAlign: 'center' }}
                                        onClick={() => {setOpenAddReply(false); nullStateHandler();}}
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
                                        onClick={() => {replyCommentHandler(); setOpenAddReply(false);}}
                                        disabled={!content}
                                    >
                                        <Typography variant="caption" color='text.primary'>
                                            댓글
                                        </Typography>
                                    </Button>
                                </Stack>
                            }
                        </Stack>
                    </Stack>
                }
                <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            </Stack>
        )
    }

};

export default Comment;