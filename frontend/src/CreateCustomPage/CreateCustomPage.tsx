import { useState, useEffect } from "react";
import AddIngredientModal from "./Modals/AddIngredientModal"
import './CreateCustomPage.scss';
import React from 'react';
export interface Ingredient {
    name: string;
    amount?: number;
}

export default function CreateCustomPage() {
    const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState("");

    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };

    useEffect(() => {
        if (newIngredient !== "") {
            setIngredientList([...ingredientList, { name: newIngredient, amount: undefined }]);
            setNewIngredient("");
        }
    }, [newIngredient])

    const onchangeAmount = (selectedIdx: number, changedAmount: string) => {
        setIngredientList(
            ingredientList.map((ingredient, idx) => {
                if (idx !== selectedIdx) {
                    return ingredient;
                } else {
                    return { name: ingredient.name, amount: Number(changedAmount) };
                }
            })
        );
    };

    return (
        <div className="item-detail">
            <div className="title">
                <div className="title__name">
                    Name:
                    <input className='title__name-input' />
                </div>
                <button className="title__confirm-button">Confirm</button>
            </div>
            <div className="content">
                <img
                    className="content__image"
                    src="https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg"
                />
                <div className="content__description-box">
                    <p className="content__abv">Expected 20% ABV</p>
                    <div className='content__description'>
                        Description:<br />
                        <textarea className='content__description-input' />
                    </div>
                    <div className="content__ingredient-box">
                        Ingredient:
                        {[...ingredientList, { name: "", amount: undefined }].map((ingredient, idx) => {
                            return (
                                <div className="content__ingredient" key={idx}>
                                    <input
                                        className="content__ingredient-name"
                                        onClick={() => (idx === ingredientList.length) && setOpen(true)}
                                        value={ingredient.name}
                                        readOnly
                                    />
                                    <AddIngredientModal
                                        isOpen={isOpen}
                                        close={() => setOpen(false)}
                                        addedIngredientList={ingredientList.map((ingredient) => { return ingredient.name })}
                                        setNewIngrdient={setNewIngredient}
                                    />
                                    <input
                                        className="content__ingredient-input"
                                        value={ingredient.amount ?? ""}
                                        onChange={(event) => onchangeAmount(idx, event.target.value)}
                                    />
                                    {idx !== ingredientList.length &&
                                        <button className="content__ingredient-delete-button" onClick={() => onClickIngredientDelete(idx)}>Delete</button>}
                                </div>
                            )
                        })}
                    </div>
                    <div className='content__recipe'>
                        Recipte:<br />
                        <textarea className='content__recipe-input' />
                    </div>
                    <div className='content__tag'>
                        Tag:<br />
                        <textarea className='content__tag-input' />
                    </div>
                </div>
                <p className="content__price">Expected $8</p>
            </div>
        </div>
    )
}