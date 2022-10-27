import './Comment.scss'

interface IProps {
    author_name: string;
    content: string;
    accessible: boolean;
}

const Comment = (props: IProps) => {
    return (
        <div className='comment'>
            <div className='comment__content'>{props.content}</div>
            <div className='comment__author'>written by {props.author_name}</div>
            {props.accessible && 
                <button className='comment__edit-button'>Edit</button>
            }
        </div>
    )
};

export default Comment;