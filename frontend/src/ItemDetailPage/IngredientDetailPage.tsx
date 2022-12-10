import { useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import './IngredientDetailPage.scss';
import React from 'react';
import { getIngredient, selectIngredient } from "../store/slices/ingredient/ingredient";
import NavBar from "../NavBar/NavBar";

export default function IngredientDetailPage() {

    const { id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const ingredientState = useSelector(selectIngredient);

    useEffect(() => {
        dispatch(getIngredient(Number(id)));
    }, [id]);



    if (ingredientState.itemStatus == "loading") {
        return <div>Loading ..</div>
    }
    else if (ingredientState.itemStatus == "failed" || !ingredientState.ingredientItem) {
        return <div>Non existing Ingredient</div>
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
                </div>
            </div>
        )
    }
}