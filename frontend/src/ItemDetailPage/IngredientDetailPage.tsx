import { useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import Comment from "./Comment";
import './IngredientDetailPage.scss';
import React from 'react';
import { fetchCommentListByCocktailId, selectComment } from "../store/slices/comment/comment";
import { fetchIngredientList, getIngredient, selectIngredient } from "../store/slices/ingredient/ingredient";
interface User {
    id: number;
    name: string;
}

export default function ItemDetailPage() {

    const { id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const ingredientState = useSelector(selectIngredient);

    useEffect(() => {
        dispatch(getIngredient(Number(id)));
        console.log(ingredientState.ingredientItem)
    }, [id]);



    if (ingredientState.itemStatus == "loading") {
        return <div>Loading ..</div>
    }
    else if (ingredientState.itemStatus == "failed" || !ingredientState.ingredientItem) {
        return <div>Non existing Ingredient</div>
    }
    else {
        return (
            <div className="item-detail">
                <div className="title">
                    <div className="title__name">{ingredientState.ingredientItem.name}</div>
                </div>
                <div className="content">
                    <img className="content__image" src={ingredientState.ingredientItem.image} />
                    <div className="content__description-box">
                        <p className="content__abv">{!ingredientState.ingredientItem.ABV ? "도수 없음" : ingredientState.ingredientItem.ABV.toFixed(1) + "% ABV"}</p>
                        <p className="content__description">{ingredientState.ingredientItem.introduction}</p>
                    </div>
                    <p className="content__price">${ingredientState.ingredientItem.price}</p>
                </div>
            </div>
        )
    }
}