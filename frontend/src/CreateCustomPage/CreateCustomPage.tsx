import { useState, useEffect } from "react";
import AddIngredientModal from "./Modals/AddIngredientModal"
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
    authPostCocktail,
    CocktailDetailType,
    IngredientPrepareType,
    PostForm,
} from "../store/slices/cocktail/cocktail";
import './CreateCustomPage.scss';
import React from 'react';
import { IngredientType } from "../store/slices/ingredient/ingredient";
import { selectUser } from "../store/slices/user/user";

function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}
function rgbToHex(r: number, g: number, b: number) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function addVector(a: number[], b: number[]) {
    return a.map((e, i) => e + b[i]);
}

export default function CreateCustomPage() {
    const [name, setName] = useState<string>("");
    const [nameEng, setNameEng] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagItem, setTagItem] = useState<string>("");
    const [expectedABV, setExpectedABV] = useState<number>(0);  // Temporary
    const [expectedPrice, setExpectedPrice] = useState<number>(0);  // Temporary
    const [expectedColor, setExpectedColor] = useState<string>('');

    const [ingredientList, setIngredientList] = useState<IngredientPrepareType[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState<IngredientType | null>(null);
    const [unitList, setUnitList] = useState<string[]>([]);
    const [newUnit, setNewUnit] = useState<string | null>(null);

    const navigate = useNavigate();
    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };


    const calculateABV = () => {
        let abv = 0
        let amount = 0
        for (let i = 0; i < ingredientList.length; i++) {
            const ing_abv = ingredientList[i].ABV
            let ing_amount = Number(ingredientList[i].amount)
            if (!['ml', 'oz', 'gram'].includes(unitList[i]) || ingredientList[i].name == '얼음')
                continue // ml, oz, gram이 아니거나 얼음인 경우 계산 X
            else if (unitList[i] == 'oz')
                ing_amount *= 30

            abv += (ing_abv * ing_amount)
            amount += ing_amount
        }
        abv /= amount
        setExpectedABV(Math.round(abv * 10) / 10)
    }
    const calculatePrice = () => {
        let price = 0
        for (let i = 0; i < ingredientList.length; i++) {
            let ing_amount = Number(ingredientList[i].amount)
            let ing_price = Number(ingredientList[i].price)
            if (!['ml', 'oz',].includes(unitList[i]) && (ingredientList[i].unit.includes('개') || ingredientList[i].unit.includes('조각')))
                ing_price /= 100 // TODO : 단위 constraint
            if (unitList[i] == 'oz')
                ing_amount *= 30

            price = price + (ing_price * ing_amount)
        }

        setExpectedPrice(Math.round(price))
    }
    const calculateColor = () => {
        let color = [0, 0, 0]
        let amount = 0

        for (let i = 0; i < ingredientList.length; i++) {
            let ing_amount = Number(ingredientList[i].amount)
            const ing_color: string = ingredientList[i].color
            console.log(ing_color)
            if (['투명', '고체'].includes(ing_color))
                continue
            const ing_color_rgb = hexToRgb(ing_color)
            if (!ing_color_rgb)
                return

            if (unitList[i] == 'oz')
                ing_amount *= 30

            ing_color_rgb[0] *= ing_amount
            ing_color_rgb[1] *= ing_amount
            ing_color_rgb[2] *= ing_amount
            console.log(ing_color_rgb)
            color = addVector(ing_color_rgb, color)
            amount += ing_amount
        }
        console.log(color)
        color[0] = Math.round(color[0] / amount)
        color[1] = Math.round(color[1] / amount)
        color[2] = Math.round(color[2] / amount)
        setExpectedColor(rgbToHex(color[0], color[1], color[2]))
        console.log(expectedColor)
    }



    useEffect(() => {
        calculateABV()
        calculatePrice()
        calculateColor()
    }, [unitList, ingredientList])



    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser)

    const onChangeAmount = (selectedIdx: number, changedAmount: string) => {
        if (changedAmount[0] === "0" || changedAmount[0] === "-") return
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

    const onChangeIngredientUnit = (selectedIdx: number, unit: string) => {
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
        const updatedTagList = [...tagList]
        updatedTagList.push(tagItem)

        setTagList(updatedTagList)
        setTagItem("")
    }

    const onDeleteTagItem = (deletedTagItem: string) => {
        setTagList(tagList.filter(tagItem => tagItem !== deletedTagItem))
    }

    const createCocktailHandler = async () => {
        if (userState.user?.id !== null && userState.token !== null) {
            const ingredients = ingredientList.map((ingr, ind) => {
                return { ...ingr, amount: ingr.amount, unit: unitList[ind] }
            })
            const data: PostForm = {
                cocktail: {
                    name: name,
                    name_eng: nameEng,
                    image: "https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg",
                    introduction: introduction,
                    recipe: recipe,
                    ABV: expectedABV,
                    color: expectedColor,
                    price_per_glass: expectedPrice,
                    tags: tagList,
                    author_id: Number(userState.user?.id),
                    ingredients: ingredients,
                },
                token: userState.token
            }
            const response = await dispatch(authPostCocktail(data))
            console.log(response)
            navigate(`/custom/${(response.payload as CocktailDetailType).id}`)
        }
    }

    useEffect(() => {
        if (!userState.isLogin) {
            navigate(-1)
            console.log("먼저 로그인 해주세요")
        }
    }, [])

    useEffect(() => {
        if (newIngredient && newUnit) {
            setIngredientList([...ingredientList, { ...newIngredient, amount: "" }]);
            setNewIngredient(null);
            setUnitList([...unitList, newUnit])
            setNewUnit(null)
        }
    }, [newIngredient, newUnit])

    return (
        <div className="item-detail">
            <div className="title">
                <div className="title__name">
                    <label>
                        Name:
                        <input className='title__name-input' value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                        영어 이름(선택):
                        <input className='title__name-input' value={nameEng} onChange={(e) => setNameEng(e.target.value)} />
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
                    <p className="content__abv"> {isNaN(expectedABV) ? "재료를 입력하여 예상 도수를 알아보세요." : `Expected ${expectedABV}% ABV`} </p>
                    <div className='content__description'>
                        <label>
                            Description:<br />
                            <textarea className='content__description-input' value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
                        </label>
                    </div>
                    <div className="content__ingredient-box">
                        Ingredient:
                        {[...ingredientList, { name: "", amount: undefined, unit: [""] }].map((ingredient, idx) => {
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
                                        onChange={(event) => { onChangeAmount(idx, event.target.value); calculateABV(); }}
                                        min="0"
                                    />
                                    <select
                                        data-testid="ingredientUnitSelect"
                                        onChange={(e) => { onChangeIngredientUnit(idx, e.target.value); calculateABV(); }}>
                                        {ingredient.unit.map((u) => {
                                            return <option
                                                key={"key" + u}
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
                            <textarea className='content__recipe-input' value={recipe} onChange={(e) => setRecipe(e.target.value)} />
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
                    <p className="content__price">예상 가격: {expectedPrice}원</p>
                    예상 색깔: <div className="content__color" style={{ "backgroundColor": `#${expectedColor}` }}></div>
                </div>
            </div>
        </div >
    )
}
