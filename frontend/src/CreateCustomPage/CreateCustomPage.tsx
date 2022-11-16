import { useState, useEffect } from "react";
import AddIngredientModal from "./Modals/AddIngredientModal"
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { CocktailDetailType, IngredientPrepareType, postCocktail, selectCocktail } from "../store/slices/cocktail/cocktail";
import './CreateCustomPage.scss';
import React from 'react';
import { IngredientType } from "../store/slices/ingredient/ingredient";

export default function CreateCustomPage() {
    const [name, setName] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagItem, setTagItem] = useState<string>("");
    const [ABV, _setABV] = useState<number>(20);  // Temporary
    const [price, _setPrice] = useState<number>(80000);  // Temporary

    const [ingredientList, setIngredientList] = useState<IngredientPrepareType[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState<IngredientType|null>(null);

    const navigate = useNavigate();
    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if(newIngredient){
            if(ingredientList.filter((i) => i.id === newIngredient.id).length === 0){
                setIngredientList([...ingredientList, { ...newIngredient, amount: "" }]);
                setNewIngredient(null);
            }

        }
    }, [newIngredient])

    const onChangeAmount = (selectedIdx: number, changedAmount: string) => {
        setIngredientList(
            ingredientList.map((ingredient, idx) => {
                if (idx !== selectedIdx) {
                    return ingredient;
                } else {
                    return { ...ingredient, amount: changedAmount } as IngredientPrepareType;
                }
            })
        );
    };

    const onKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
        if (tagItem.length !== 0 && e.key === 'Enter') {
          submitTagItem()
        }
    }
    
    const submitTagItem = () => {
        const updatedTagList = [ ...tagList ]
        updatedTagList.push(tagItem)

        setTagList(updatedTagList)
        setTagItem("")
    }

    const onDeleteTagItem = (deletedTagItem: string) => {
        setTagList(tagList.filter(tagItem => tagItem !== deletedTagItem))
    }

    const createCocktailHandler = async () => {
        const response = await dispatch(postCocktail({
            name: name,
            image:"https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg",
            introduction:introduction,
            recipe: recipe,
            ABV: ABV,
            price_per_glass: price,
            tags: tagList,
            author_id:1,
            ingredients: ingredientList
        }))

        console.log(response)
        navigate(`/custom/${(response.payload as CocktailDetailType).id}`)
    }

    return (
        <div className="item-detail">
            <div className="title">
                <div className="title__name">
                    <label>
                        Name:
                        <input className='title__name-input' value={name} onChange={(e) => setName(e.target.value)}/>
                    </label>
                </div>
                <button className="title__confirm-button"
                onClick={() => createCocktailHandler()}>Confirm</button>
            </div>
            <div className="content">
                <img
                    className="content__image"
                    src="https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg"
                />
                <div className="content__description-box">
                    <p className="content__abv">Expected 20% ABV</p>
                    <div className='content__description'>
                        <label>
                            Description:<br />
                            <textarea className='content__description-input' value={introduction} onChange={(e) => setIntroduction(e.target.value)}/>
                        </label>
                    </div>
                    <div className="content__ingredient-box">
                        Ingredient:
                        {[...ingredientList, { name: "", amount: undefined }].map((ingredient, idx) => {
                            return (
                                <div className="content__ingredient" key={`${ingredient.name}_${idx}`}>
                                    <input
                                        data-testid="ingredientInput"
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
                                        data-testid="ingredientAmountInput"
                                        className="content__ingredient-input"
                                        value={ingredient.amount ?? ""}
                                        onChange={(event) => onChangeAmount(idx, event.target.value)}
                                    />
                                    {idx !== ingredientList.length &&
                                        <button 
                                            data-testid="ingredientDeleteButton"
                                            className="content__ingredient-delete-button" 
                                            onClick={() => onClickIngredientDelete(idx)}
                                        >
                                            Delete
                                        </button>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div className='content__recipe'>
                        <label>
                            Recipe:<br />
                            <textarea className='content__recipe-input' value={recipe} onChange={(e) => setRecipe(e.target.value)}/>
                        </label>
                    </div>
                    <div className='content__tag-box'>
                        Tag: <br />
                        <div className='content__tag-inner-box'>
                            {tagList.map((tagItem, idx) => {
                                return (
                                    <div className="content__tag" key={`${tagItem}_${idx}`}>
                                        <span>{tagItem}</span>
                                        <button 
                                            data-testid="tagDeleteButton"
                                            onClick={(e) => onDeleteTagItem(e.currentTarget.parentElement?.firstChild?.textContent ?? "")}
                                        >
                                            X
                                        </button>
                                    </div>
                                )
                            })}
                            <input 
                                data-testid="tagInput"
                                className='content__tag-input'
                                type="text"
                                placeholder='Press enter to add tags'
                                onChange={e => setTagItem(e.target.value)}
                                value={tagItem}
                                onKeyPress={onKeyPress}
                            />
                        </div>
                    </div>
                    <p className="content__price">Expected ${price}</p>
                </div>
            </div>
        </div>
        )
    }
