import './Reply.scss'
import './Comment.scss'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { deleteComment } from '../../store/slices/comment/comment';
interface IProps {
    id: number;
    author_name: number;
    content: string;
    accessible: boolean;
}

const Reply = (props: IProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const deleteCommentHandler = () => {
        dispatch(deleteComment(props.id));
    }
    console.log(props)
    return (
        <div className='reply'>
            <div className='reply__content'>{props.content}</div>
            <div className='reply__author'>written by {props.author_name}</div>
            <div className='reply__button-box'>
                <button className='reply__reply-button'>Reply</button>
                {props.accessible && <button className='reply__edit-button'>Edit</button>}
                {props.accessible && <button className='reply__delete-button' onClick={() => deleteCommentHandler()}>Delete</button>}
            </div>
        </div>
    )
};

export default Reply;