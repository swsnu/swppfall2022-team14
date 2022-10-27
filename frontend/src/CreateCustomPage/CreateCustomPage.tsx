import { useState } from "react";
import AddIngredientModal from "./Modals/AddIngredientModal"
import './CreateCustomPage.scss';

interface Ingredient {
    name: string;
    amount?: number;
}

export default function CreateCustomPage() {
    const [IngredientList, setIngredientList] = useState<Ingredient[]>([{ name: "", amount: undefined }]);
    const [isOpen, setOpen] = useState(false);

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
                        {IngredientList.map((ingredient, idx) => {
                            return (
                                <div className="content__ingredient">
                                    <input 
                                        className="content__ingredient-name" 
                                        onClick={() => setOpen(true)}
                                        readOnly
                                    />
                                    <AddIngredientModal 
                                        isOpen={isOpen} 
                                        close={() => setOpen(false)} 
                                        addedIngredientList={IngredientList.map(() => {return {name: ""};})}
                                    />
                                    <input className="content__ingredient-input" />
                                    {IngredientList.length !== 1 && <button className="content__ingredient-delete-button">Delete</button>}
                                    {IngredientList.length - 1 === idx && <button className="content__ingredient-add-button">Add</button>}
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