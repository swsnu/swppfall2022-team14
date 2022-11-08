import './Comment.scss'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { CommentType, deleteComment, editComment, selectComment } from '../../store/slices/comment/comment';
import Reply from './Reply';
import { commentActions } from "../../store/slices/comment/comment"

const Comment = (props: CommentType) => {
    const dispatch = useDispatch<AppDispatch>();
    const deleteCommentHandler = () => {
        dispatch(deleteComment(props.id));
    }
    const accessible = (props.author_id == 1)
    const commentState = useSelector(selectComment)
    const [content, setContent] = useState<string>(props.content)
    
    
    const editStateHandler = () => {
        dispatch(commentActions.editCommentState(props))
    }

    const editCommentHandler = async () => {
        await dispatch(editComment({id: props.id, content: content}))
    }

    if(commentState.commentItem?.id == props.id && commentState.state == "EDIT"){
        return (
            <div className="comments__create">
                <textarea id="comment_text" className="comments__input" value={content} onChange={(e) => setContent(e.target.value)}/>
                <div className="comments__add-box">
                    <button className="comments__add" onClick={() => editCommentHandler()}>
                        Add
                    </button>
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
                        <button className='comment__reply-button'>Reply</button>
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
                                    author_name={comment.author_id}
                                    content={comment.content}
                                    accessible={true}
                                />
                            )
                        }
                        else{
                            return null
                        }
                    })}
                </div>
            </div>
        )
    }

};

export default Comment;