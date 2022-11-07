import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { selectCocktail, getCocktail } from "../store/slices/cocktail/cocktail";
import Comment from "./Comment";
import './ItemDetailPage.scss';
import React from 'react';
import { fetchCommentListByCocktailId, postComment, selectComment } from "../store/slices/comment/comment";
interface User {
    id: number;
    name: string;
}

export default function ItemDetailPage() {
    const dummyUsers: User[] = [
        { id: 1, name: "Kevin" },
        { id: 2, name: "Sophie" },
    ];

    const { type, id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const cocktailState = useSelector(selectCocktail);
    const commentState = useSelector(selectComment);
    const navigate = useNavigate()
    const onIngredientClick = (id: number) => {
        navigate(`/ingredient/${id}`)
    }
    const [content, setContent] = useState<string>("")

    useEffect(() => {
        dispatch(getCocktail(Number(id)));
        dispatch(fetchCommentListByCocktailId(Number(id)));
    }, [id]);

    const cocktail = cocktailState.cocktailItem;
    const isCustom = cocktail?.type === "CS";
    
    const createCommentHandler = () => {
        const data = {
            content:content,
            parent_comment:null,
            cocktail:Number(id)
        }
        dispatch(postComment(data));
        (document.getElementById("comment_text")! as HTMLInputElement).value = ""
    }

    if (cocktailState.itemStatus == "loading") {
        return <div>Loading ..</div>
    }
    else if (cocktailState.itemStatus == "failed" || !cocktail) {
        return <div>Non existing cocktail</div>
    }
    // Type mismatch
    else if (!((isCustom && type === "custom") || (!isCustom && type === "standard"))) {
        return <div>Type mismatch</div>
    }
    else {
        return (
            <div className="item-detail">
                <div className="title">
                    <div className="title__name">
                        {cocktail.name}
                        <button className="title__bookmark-button">
                            bookmark
                        </button>
                        {isCustom &&
                            <div className="title__author">
                                created by {dummyUsers.find(user => user.id === cocktail.author_id)?.name}
                            </div>
                        }
                    </div>
                    <button className="title__rate-button">rate button</button>
                    <div className="title__rate">{cocktail.rate.toFixed(1)} / 5.0</div>
                </div>
                <div className="content">
                    <img
                        className="content__image"
                        src={cocktail.image}
                    />
                    <div className="content__description-box">
                        <p className="content__abv">{cocktail.ABV.toFixed(1)}% ABV</p>
                        <p className="content__description">{cocktail.introduction}</p>
                        <p className="content__recipe">{cocktail.recipe}</p>
                    </div>
                    <div>{cocktail.ingredients?.map(ingre => { return <div key={ingre.id} onClick={() => onIngredientClick(ingre.id)} className="content__ingredient">{ingre.amount} {ingre.name}</div> })}</div>
                    <p className="content__price">${cocktail.price_per_glass}</p>
                </div>
                <div className="comments">
                    <div className="comments__create">
                        <textarea id="comment_text" className="comments__input" onChange={(event) =>setContent(event.target.value)}/>
                        <div className="comments__add-box">
                            <button className="comments__add" onClick={() => createCommentHandler()}>
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="comments_list">
                        {commentState.commentList.map((comment) => {
                            return (
                                <Comment
                                    key={`${comment.id}_comment`}
                                    author_name={comment.author_id}
                                    content={comment.content}
                                    accessible={true}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}