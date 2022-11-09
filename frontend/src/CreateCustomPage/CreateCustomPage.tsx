import {useState, useEffect, useRef} from "react";
import AddIngredientModal from "./Modals/AddIngredientModal"
import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { CocktailDetailType, IngredientPrepareType, postCocktail, selectCocktail } from "../store/slices/cocktail/cocktail";
import './CreateCustomPage.scss';
import React from 'react';
import { IngredientType } from "../store/slices/ingredient/ingredient";

export default function CreateCustomPage() {
    const [name, setName] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [ABV, setABV] = useState<number>(20);  // Temporary
    const [price, setPrice] = useState<number>(80000);  // Temporary

    const [ingredientList, setIngredientList] = useState<IngredientPrepareType[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState<IngredientType|null>(null);

    const [confirmed, setConfirmed] = useState<boolean>(false);

    const [img, setImg] = useState<any>(null)
    const [thumb, setThumb] = useState<any>(null)
    const [img64, setImg64] = useState<any>(null)
    const imgRef = useRef<any>({});

    const navigate = useNavigate();
    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };

    const cocktailState = useSelector(selectCocktail);
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

    const handleImg = (e: any) => {
        const reader = new FileReader();
        const formData = new FormData();

        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
            setThumb(e.target.files[0]); // 파일 상태 업데이트
            console.log(e.target.files[0]);
            formData.append('image',e.target.files[0]);
        }
        reader.onloadend = () => {
            // 2. 읽기가 완료되면 아래코드가 실행됩니다.
            const base64 = reader.result;
            if (base64) {
                setImg(base64.toString()); // 파일 base64 상태 업데이트
            }
        };
        console.log(img)
    }

    const createCocktailHandler = async () => {
        const tagList = tag.replaceAll(/\s/g, '').split('#')
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
                    Name:
                    <input className='title__name-input' value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <button className="title__confirm-button"
                onClick={() => createCocktailHandler()}>Confirm</button>
            </div>
            <div className="content">
                <div className="content__imgbox">
                    <input type={"file"} accept={"image/*"} ref={imgRef} onChange={handleImg} name="imgFile" id="imgFile" />
                    <img className="content__image" src={img}/>
                </div>
                <div className="content__description-box">
                    <p className="content__abv">Expected 20% ABV</p>
                    <div className='content__description'>
                        Description:<br />
                        <textarea className='content__description-input' value={introduction} onChange={(e) => setIntroduction(e.target.value)}/>
                    </div>
                    <div className="content__ingredient-box">
                        Ingredient:
                        {[...ingredientList, { name: "", amount: undefined }].map((ingredient, idx) => {
                            return (
                                <div className="content__ingredient" key={`${ingredient.name}_${idx}`}>
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
                        Recipte:<br />
                        <textarea className='content__recipe-input' value={recipe} onChange={(e) => setRecipe(e.target.value)}/>
                    </div>
                    <div className='content__tag'>
                        Tag:<br />
                        <textarea className='content__tag-input' value={tag} onChange={(e) => setTag(e.target.value)}/>
                    </div>
                    <p className="content__price">Expected ${price}</p>
                </div>
            </div>
        </div>
        )
    }
