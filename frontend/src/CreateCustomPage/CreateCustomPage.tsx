import { useState } from "react";
import AddIngredientModal from "./Modals/AddIngredientModal"
import './CreateCustomPage.scss';

export interface Ingredient {
    name: string;
    amount?: number;
}

export default function CreateCustomPage() {
    const [ingredientList, setIngredientList] = useState<Ingredient[]>([{ name: "", amount: undefined }]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState("");

    const onClickIngredientAdd = () => {
        setIngredientList([...ingredientList, { name: "", amount: undefined }]);
    }

    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };

    const onClickCloseModal = () => {
        if (newIngredient !== "") {
            setIngredientList([...ingredientList, { name: newIngredient, amount: undefined }]);
            setNewIngredient("");
        }
        setOpen(false);
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
                        Description:<br/>
                        <textarea className='content__description-input' />
                    </div>
                    <div className="content__ingredient-box">
                        Ingredient:
                        {ingredientList.map((ingredient, idx) => {
                            return (
                                <div className="content__ingredient">
                                    <input 
                                        className="content__ingredient-name" 
                                        onClick={() => setOpen(true)}
                                        readOnly
                                    />
                                    <AddIngredientModal 
                                        isOpen={isOpen} 
                                        close={onClickCloseModal} 
                                        addedIngredientList={ingredientList.map(() => { return { name: ingredient.name }; })}
                                        setNewIngrdient={setNewIngredient}
                                    />
                                    <input className="content__ingredient-input" />
                                    {ingredientList.length !== 1 && 
                                        <button className="content__ingredient-delete-button" onClick={() => onClickIngredientDelete(idx)}>Delete</button>}
                                    {ingredientList.length - 1 === idx && 
                                        <button 
                                            className="content__ingredient-add-button" 
                                            onClick={onClickIngredientAdd}
                                            disabled={ingredient.name === ""}
                                        >
                                            Add
                                        </button>}
                                </div>
                            )
                        })}
                    </div>
                    <div className='content__recipe'>
                        Recipte:<br/>
                        <textarea className='content__recipe-input' />
                    </div>
                    <div className='content__tag'>
                        Tag:<br/>
                        <textarea className='content__tag-input' />
                    </div>
                </div>
                <p className="content__price">Expected $8</p>
            </div>
        </div>
    )
}