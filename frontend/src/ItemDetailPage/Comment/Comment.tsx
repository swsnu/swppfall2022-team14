import './Comment.scss'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { CommentType, deleteComment, editComment, postComment, selectComment } from '../../store/slices/comment/comment';
import Reply from './Reply';
import { commentActions } from "../../store/slices/comment/comment"
import {selectUser} from "../../store/slices/user/user";
import LoginModal from "../../InitPage/Modals/LoginModal";

const Comment = (props: CommentType) => {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser)

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const deleteCommentHandler = () => {
        dispatch(deleteComment(props.id));
    }
    const accessible = (props.author_id == 1)
    const commentState = useSelector(selectComment)
    const [content, setContent] = useState<string>(props.content)
    const [replyContent, setReplyContent] = useState<string>("")
    
    
    const editStateHandler = () => {
        dispatch(commentActions.editCommentState(props))
    }

    const editCommentHandler = () => {
        dispatch(editComment({id: props.id, content: content}))
    }

    const replyStateHandler = () => {
        dispatch(commentActions.replyCommentState(props))
    }

    const replyCommentHandler = () => {
        if(userState.isLogin){
            dispatch(postComment({cocktail: props.cocktail.id, parent_comment:props.id, content:replyContent}))
            setReplyContent("")
        }
        else{
            setIsLoginOpen(true)
        }
    }

    if(commentState.commentItem?.id == props.id && commentState.state == "EDIT"){
        return (
            <div className="comments__create">
                <textarea id="comment_text" className="comments__input" value={content} onChange={(e) => setContent(e.target.value)}/>
                <div className="comments__add-box">
                    <button className="comments__add" onClick={() => editCommentHandler()}>
                        Edit
                    </button>
                </div>
                <div className="reply_list">
                    {commentState.commentList.map((comment) => {
                        if(comment.parent_comment==props.id){
                            return (
                                <Reply
                                    key={`${comment.id}_comment`}
                                    id={comment.id}
                                    author_id={comment.author_id}
                                    content={comment.content}
                                    created_at={comment.created_at}
                                    updated_at={comment.updated_at}
                                    parent_comment={null}
                                    is_deleted={comment.is_deleted}
                                    cocktail={comment.cocktail}
                                />
                            )
                        }
                        /*
                        else{
                            return null
                        }
                        */
                    })}
                </div>
            </div>
        )
    }else{
        return (
            <div>
                <div className='comment'>
                    <div className='comment__content'>{props.content}</div>
                    <div className='comment__author'>written by {props.author_id}</div>
                    <div className='comment__button-box'>
                        <button className='comment__reply-button'onClick={() => replyStateHandler()} disabled={props.is_deleted}>Reply</button>
                        {accessible && <button className='comment__edit-button' onClick={() => editStateHandler()}>Edit</button>}
                        {accessible && <button className='comment__delete-button' onClick={() => deleteCommentHandler()}>Delete</button>}
                    </div>
                </div>
                <div className="reply_list">
                    {commentState.commentList.map((comment) => {
                        if(comment.parent_comment==props.id){
                            return (
                                <Reply
                                    key={`${comment.id}_comment`}
                                    id={comment.id}
                                    author_id={comment.author_id}
                                    content={comment.content}
                                    created_at={comment.created_at}
                                    updated_at={comment.updated_at}
                                    parent_comment={null}
                                    is_deleted={comment.is_deleted}
                                    cocktail={comment.cocktail}
                                />
                            )
                        }
                        /*
                        else{
                            return null
                        }
                        */
                    })}
                </div>
                {
                    (commentState.commentItem?.id == props.id && commentState.state == "REPLY") &&
                    <div>
                        <div className="comments__create">
                        <textarea id="comment_text" className="comments__input" value={replyContent} onChange={(e) => setReplyContent(e.target.value)}/>
                        <div className="comments__add-box">
                        <button className="comments__add" onClick= {() => replyCommentHandler()}>
                            Add
                        </button>
                        </div>
                    </div>
                    </div>
                }
                <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            </div>
        )
    }

};

export default Comment;