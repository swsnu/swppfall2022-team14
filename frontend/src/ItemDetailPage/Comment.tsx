import './Comment.scss'
import React from 'react';
interface IProps {
    author_name: number;
    content: string;
    accessible: boolean;
}

const Comment = (props: IProps) => {
    return (
        <div className='comment'>
            <div className='comment__content'>{props.content}</div>
            <div className='comment__author'>written by {props.author_name}</div>
            <div className='comment__button-box'>
                <button className='comment__reply-button'>Reply</button>
                {props.accessible && <button className='comment__edit-button'>Edit</button>}
                {props.accessible && <button className='comment__delete-button'>Delete</button>}
            </div>
        </div>
    )
};

export default Comment;