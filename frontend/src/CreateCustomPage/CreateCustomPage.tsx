import { useState, useEffect } from "react";
import AddIngredientModal from "./Modals/AddIngredientModal"
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchCocktailList, postCocktail, selectCocktail } from "../store/slices/cocktail/cocktail";
import './CreateCustomPage.scss';

export interface Ingredient {
    name: string;
    amount?: number;
}

export default function CreateCustomPage() {
    const [name, setName] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [ABV, setABV] = useState<number>(20);  // Temporary
    const [price, setPrice] = useState<number>(8);  // Temporary

    const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState("");

    const [confirmed, setConfirmed] = useState<boolean>(false);

    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };

    const cocktailState = useSelector(selectCocktail);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (newIngredient !== "") {
            setIngredientList([...ingredientList, { name: newIngredient, amount: undefined }]);
            setNewIngredient("");
        }
    }, [newIngredient])

    const onChangeAmount = (selectedIdx: number, changedAmount: string) => {
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

    const onClickPost = async () => {
        dispatch(fetchCocktailList("custom"));
        
        const data = {
            image: image,
            name: name,
            introduction: introduction,
            recipe: recipe,
            ABV: ABV,
            price_per_glass: price,
            type: 'CS',
            author_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            rate: 0.0,
        };
        const result = await dispatch(postCocktail(data));

        if (result.type === `${postCocktail.typePrefix}/fulfilled`) {
            setConfirmed(true);
        } else {
            alert("Error on post Cocktail");
        }
    }

    if (confirmed) {
        const cocktail_address = "/custom/" + cocktailState.cocktailList.at(-1)!!.id;

        return <Navigate to={cocktail_address} />
    } else {
        return (
            <div className="item-detail">
                <div className="title">
                    <div className="title__name">
                        Name:
                        <input 
                            className='title__name-input' 
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <button 
                        className="title__confirm-button"
                        disabled={!name || !image || !introduction || !recipe || !tag || !(ingredientList && ingredientList.length)}
                        onClick={() => onClickPost()}
                    >
                        Confirm
                    </button>
                </div>
                <div className="content">
                    <textarea 
                        className="content__image-input"
                        value={image}
                        onChange={(event) => setImage(event.target.value)}
                    />
                    <div className="content__description-box">
                        <p className="content__abv">Expected {ABV}%</p>
                        <div className='content__introduction'>
                            Introduction:<br/>
                            <textarea 
                                className='content__introduction-input' 
                                value={introduction}
                                onChange={(event) => setIntroduction(event.target.value)}    
                            />
                        </div>
                        <div className="content__ingredient-box">
                            Ingredient:
                            {[...ingredientList, { name: "", amount: undefined }].map((ingredient, idx) => {
                                return (
                                    <div className="content__ingredient">
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
                                            onChange={(event) => onChangeAmount(idx, event.target.value)}
                                        />
                                        {idx !== ingredientList.length && 
                                            <button className="content__ingredient-delete-button" onClick={() => onClickIngredientDelete(idx)}>Delete</button>}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='content__recipe'>
                            Recipe:<br/>
                            <textarea 
                                className='content__recipe-input' 
                                value={recipe}
                                onChange={(event) => setRecipe(event.target.value)}
                            />
                        </div>
                        <div className='content__tag'>
                            Tag:<br/>
                            <textarea 
                                className='content__tag-input' 
                                value={tag}
                                onChange={(event) => setTag(event.target.value)}    
                            />
                        </div>
                    </div>
                    <p className="content__price">Expected ${price}</p>
                </div>
            </div>
        )
    }
}