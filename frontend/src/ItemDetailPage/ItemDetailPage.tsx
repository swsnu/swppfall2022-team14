import { useParams } from "react-router"
import Comment from "./Comment";
import './ItemDetailPage.scss';

interface Comment {
    id: number;
    author_name: string;
    content: string;
    accessible: boolean;
}

export default function ItemDetailPage() {
    const { type, id } = useParams();

    const dummyComments: Comment[] = [
        { id: 1, author_name: "user 1", content: "content 1", accessible: false },
        { id: 2, author_name: "user 2", content: "content 2", accessible: true },
    ];

    return (
        <div className="item-detail">
            <div className="title">
                <div className="title__name">Kahlua Milk</div>
                <div className="title__rate-button">rate button</div>
                <div className="title__rate">4.7 / 5.0</div>
            </div>
            <div className="content">
                <img 
                    className="content__image"
                    src="https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg"
                />
                <div className="content__description-box">
                    <p className="content__abv">20% ABV</p>
                    <p className="content__description">This is a description. This is a description. This is a description. This is a description. This is a description. This is a description. This is a description. </p>
                    <p className="content__recipe">This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. </p>
                </div>
                <p className="content__price">$8</p>
            </div>
            <div className="comments">
                {dummyComments.map((comment) => {
                    return (
                        <Comment
                            key={`${comment.id}_comment`}
                            author_name={comment.author_name}
                            content={comment.content}
                            accessible={comment.accessible}
                        />
                    )
                })}
            </div>
        </div>
    )
}