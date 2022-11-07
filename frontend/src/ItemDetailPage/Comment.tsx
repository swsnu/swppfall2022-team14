import './Comment.scss'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { deleteComment } from '../store/slices/comment/comment';
interface IProps {
    id: number;
    author_name: number;
    content: string;
    accessible: boolean;
}

const Comment = (props: IProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const deleteCommentHandler = () => {
        dispatch(deleteComment(props.id));
    }

    return (
        <div className='comment'>
            <div className='comment__content'>{props.content}</div>
            <div className='comment__author'>written by {props.author_name}</div>
            <div className='comment__button-box'>
                <button className='comment__reply-button'>Reply</button>
                {props.accessible && <button className='comment__edit-button'>Edit</button>}
                {props.accessible && <button className='comment__delete-button' onClick={() => deleteCommentHandler()}>Delete</button>}
            </div>
        </div>
    )
};

export default Comment;