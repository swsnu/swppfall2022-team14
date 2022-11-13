import './Reply.scss'
import './Comment.scss'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { commentActions, deleteComment, editComment, selectComment } from '../../store/slices/comment/comment';
import { CommentType } from '../../store/slices/comment/comment';

const Reply = (props: CommentType) => {
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

    const editCommentHandler = () => {
        dispatch(editComment({id: props.id, content: content}))
    }
    
    if(commentState.commentItem?.id == props.id && commentState.state == "EDIT"){
        return (
            <div className="reply__edit">
                <textarea id="reply_text" className="reply__input" value={content} onChange={(e) => setContent(e.target.value)}/>
                <div className="reply__add-box">
                    <button className="reply__add" onClick={() => editCommentHandler()}>
                        Edit
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className='reply'>
            <div className='reply__content'>{props.content}</div>
            <div className='reply__author'>written by {props.author_id}</div>
            <div className='reply__button-box'>
                {accessible && <button className='reply__edit-button' onClick={() => editStateHandler()}>Edit</button>}
                {accessible && <button className='reply__delete-button' onClick={() => deleteCommentHandler()}>Delete</button>}
            </div>
        </div>
    )
};

export default Reply;