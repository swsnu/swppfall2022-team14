import { useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { selectCocktail, getCocktail } from "../store/slices/cocktail/cocktail";
import Comment from "./Comment";
import './ItemDetailPage.scss';
import React from 'react';

interface User {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    author_name: string;
    content: string;
    accessible: boolean;
}

export default function ItemDetailPage() {
    const dummyUsers: User[] = [
        { id: 1, name: "Kevin" },
        { id: 2, name: "Sophie" },
    ];

    const dummyComments: Comment[] = [
        { id: 1, author_name: "user 1", content: "content 1", accessible: false },
        { id: 2, author_name: "user 2", content: "content 2", accessible: true },
    ];

    const { type, id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const cocktailState = useSelector(selectCocktail);

    useEffect(() => {
        dispatch(getCocktail(Number(id)));
    }, [id]);

    const cocktail = cocktailState.cocktailItem;
    const isCustom = cocktail?.type === "CS";

    // Non-existing cocktail
    if (!cocktail) {
        return <div>Non-existing cocktail</div>
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
                    <p className="content__price">${cocktail.price_per_glass}</p>
                </div>
                <div className="comments">
                    <div className="comments__create">
                        <textarea className="comments__input" />
                        <div className="comments__add-box">
                            <button className="comments__add">
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="comments_list">
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
            </div>
        )
    }
}