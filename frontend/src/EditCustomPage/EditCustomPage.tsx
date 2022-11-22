import { useState, useEffect } from "react";
import AddIngredientModal from "../CreateCustomPage/Modals/AddIngredientModal"
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { CocktailDetailType, IngredientPrepareType, editCocktail, getCocktail, selectCocktail } from "../store/slices/cocktail/cocktail";
import './EditCustomPage.scss';
import React from 'react';
import { IngredientType, selectIngredient } from "../store/slices/ingredient/ingredient";

export default function EditCustomPage() {
    const { id } = useParams();

    const [name, setName] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagItem, setTagItem] = useState<string>("");
    const [ABV, setABV] = useState<number>(0);  // Temporary
    const [price, setPrice] = useState<number>(0);  // Temporary

    const [ingredientList, setIngredientList] = useState<IngredientPrepareType[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState<IngredientType|null>(null);
    const [unitList, setUnitList] = useState<string[]>([]);
    const [newUnit, setNewUnit] = useState<string|null>(null);

    const cocktailState = useSelector(selectCocktail);
    const cocktail = cocktailState.cocktailItem;
    const ingredientState = useSelector(selectIngredient)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getCocktail(Number(id)));
    }, []);

    useEffect(() => {
        if (cocktail) {
            setName(cocktail.name);
            setIntroduction(cocktail.introduction);
            setRecipe(cocktail.recipe);
            setTagList(cocktail.tags);
            setABV(cocktail.ABV);
            setPrice(cocktail.price_per_glass);
            setIngredientList(cocktail.ingredients);
        }
    }, [cocktail]);

    const navigate = useNavigate();
    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };

    useEffect(() => {
        if(newIngredient && newUnit){
            setIngredientList([...ingredientList, { ...newIngredient, amount: "" }]);
            setNewIngredient(null);
            setUnitList([...unitList, newUnit])
            setNewUnit(null)
        }
    }, [newIngredient, newUnit])

    const onChangeAmount = (selectedIdx: number, changedAmount: string) => {
        if(changedAmount[0] === "0" || changedAmount[0] === "-") return
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

    const onChangeIngredientUnit = (selectedIdx: number, unit:string)=> {
        console.log(selectedIdx)
        console.log(unit)
        const units = unitList
        units[selectedIdx] = unit
        setUnitList(units)
    }

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

    const editCocktailHandler = async () => {
        const ingredients = ingredientList.map((ingr, ind) => {
            return {...ingr, amount: ingr.amount +" "+ unitList[ind]}
        })
        const response = await dispatch(editCocktail({
            id: Number(id),
            name: name,
            image: "https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg",
            introduction: introduction,
            recipe: recipe,
            ABV: ABV,
            price_per_glass: price,
            tags: tagList,
            author_id: 1,
            ingredients: ingredients
        }))

        console.log(response)
        navigate(`/custom/${(response.payload as CocktailDetailType).id}`)
    }

    if (cocktailState.itemStatus == "loading") {
        return <div>Loading ..</div>
    }
    else if (cocktailState.itemStatus == "failed" || !cocktail) {
        return <div>Non existing cocktail</div>
    }
    else {
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
                    onClick={() => editCocktailHandler()}>Confirm</button>
                </div>
                <div className="content">
                    <img
                        className="content__image"
                        src="https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg"
                    />
                    <div className="content__description-box">
                        <p className="content__abv">Expected {ABV}% ABV</p>
                        <div className='content__description'>
                            <label>
                                Description:<br />
                                <textarea className='content__description-input' value={introduction} onChange={(e) => setIntroduction(e.target.value)}/>
                            </label>                        
                        </div>
                        <div className="content__ingredient-box">
                            Ingredient:
                            {[...ingredientList, { name: "", amount: undefined, unit:[""] }].map((ingredient, idx) => {
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
                                            setDefaultUnit={setNewUnit}
                                        />
                                        <input
                                            data-testid="ingredientAmountInput"
                                            className="content__ingredient-input"
                                            value={ingredient.amount ?? ""}
                                            type="number"
                                            onChange={(event) => onChangeAmount(idx, event.target.value)}
                                            min="0"
                                        />
                                        <select 
                                        onChange={(e) => onChangeIngredientUnit(idx, e.target.value)}>
                                            {ingredient.unit.map((u) => {
                                                return <option
                                                    key={"key"+u}
                                                    value={u}
                                                    >
                                                {u}
                                            </option>
                                        })}
                                    </select>
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
                                                className="content__tag-delete-button" 
                                                onClick={() => onDeleteTagItem(tagItem)}
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
}