import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { selectCocktail, getCocktail, toggleBookmark, updateRate, getAuthor } from "../store/slices/cocktail/cocktail";
import Comment from "./Comment/Comment";
import './ItemDetailPage.scss';
import React from 'react';
import { fetchCommentListByCocktailId, postComment, selectComment } from "../store/slices/comment/comment";
import NavBar from "../NavBar/NavBar";
import axios from 'axios';
import LoginModal from "../InitPage/Modals/LoginModal";
import { selectUser } from "../store/slices/user/user";
import { postRate, editRate } from "../store/slices/rate/rate";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
    const userState = useSelector(selectUser)
    const navigate = useNavigate()
    const onIngredientClick = (id: number) => {
        navigate(`/ingredient/${id}`)
    }
    const [content, setContent] = useState<string>("")
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)

    const cocktail = cocktailState.cocktailItem;
    const isCustom = cocktail?.type === "CS";

    useEffect(() => {
        dispatch(getCocktail(Number(id)));
        dispatch(fetchCommentListByCocktailId(Number(id)));
    }, []);

    useEffect(() => {
        if (cocktail) {
            setScore(cocktail.score);

            if (cocktail.author_id) {
                dispatch(getAuthor(cocktail.author_id));

            }
        }
    }, [cocktail]);

    const createCommentHandler = () => {
        if(userState.isLogin){
            const data = {
                content: content,
                parent_comment: null,
                cocktail: Number(id)
            }
            dispatch(postComment(data));
            setContent("")
        }
        else{
            setIsLoginOpen(true)
        }
    }

    const toggleBookmarkHandler = () => {
        if(userState.isLogin && userState.token){
            dispatch(toggleBookmark({cocktail_id:Number(id), token:userState.token}));
        }
        else{
            setIsLoginOpen(true)
        }
    }

    const onChangeRate = async (changedScore: string) => {
        if(userState.isLogin) {
            const data = { cocktail_id: Number(id), score: Number(changedScore) };
            if (score) {  // PUT score
                await dispatch(editRate(data));
            } else {      // POST score
                await dispatch(postRate(data));
            }
            dispatch(updateRate(Number(id)));
            setScore(Number(changedScore));
        } else {
            setIsLoginOpen(true);
        }
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
            <div className="main">
                <div className="left">
                    <NavBar />
                </div>
                <div className="right">
                    <div className="item-detail">
                        <div className="title">
                            <div className="title__name">
                                {cocktail.name}
                                <button className="title__bookmark-button"
                                onClick={() => toggleBookmarkHandler()}>
                                    {(cocktail.is_bookmarked)? "Remove from Bookmark" : "Add in Bookmark"}
                                </button>
                                {isCustom &&
                                    <div className="title__author">
                                        created by {dummyUsers.find(user => user.id === cocktail.author_id)?.name}
                                    </div>
                                }
                            </div>
                            <button 
                                className="title__edit-button"
                                onClick={(e) => navigate(`/custom/${id}/edit`)}
                            >
                                Edit
                            </button>
                            <input
                                value={score}
                                type="number"
                                onChange={(event) => onChangeRate(event.target.value)}
                                min="1"
                                max="5"
                            />
                            <div className="title__rate">
                                {cocktail.rate.toFixed(1)} / 5.0
                            </div>
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
                                <textarea id="comment_text" className="comments__input" value={content} onChange={(e) => setContent(e.target.value)} />
                                <div className="comments__add-box">
                                    <button className="comments__add" onClick={() => createCommentHandler()}>
                                        Add
                                    </button>
                                </div>
                            </div>
                            <div className="comments_list">
                                {commentState.commentList.map((comment) => {
                                    if (!comment.parent_comment) {
                                        return (
                                            <Comment
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
                                    else {
                                        return null
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            </div>
        )
    }
}