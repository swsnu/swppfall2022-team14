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
import S3 from 'react-aws-s3-typescript'
import {v4 as uuid} from 'uuid'
export interface Image {
    key:string;
    url:string;
}
import { calculateABV, calculateColor, calculatePrice } from "../common/utils/utils";


export default function CreateCustomPage() {
    const [name, setName] = useState<string>("");
    const [nameEng, setNameEng] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagItem, setTagItem] = useState<string>("");
    const [image, setImage] = useState<Image|null>(null);
    
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



    useEffect(() => {
        setExpectedABV(calculateABV(ingredientList, unitList));
        setExpectedColor(calculateColor(ingredientList, unitList));
        setExpectedPrice(calculatePrice(ingredientList, unitList));
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
                    image: (image)? image.url:"https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg",
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
    
    const S3_config = {
        bucketName: process.env.REACT_APP_BUCKET_NAME!,
        region: "ap-northeast-2",
        accessKeyId: process.env.REACT_APP_ACCESS!,
        secretAccessKey: process.env.REACT_APP_SECRET!,
    }

    const handleSelectFile = async (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const file = e.target.files[0]
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
                const S3Client = new S3(S3_config)
                // delete previous image
                if(image !== null){
                    await S3Client.deleteFile(image.key)
                }
                
                // upload file and setImage(S3 Link)
                const fileName = 'cocktail' + '/' + uuid()
                const response = await S3Client.uploadFile(file, fileName)
                if(response.status == 204){
                    setImage({key: response.key, url: response.location})
                }
            }else{
                alert('이미지 파일(jpeg, png, jpg)만 업로드 가능합니다.')
                e.target.files=null
            }
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
            setIngredientList([...ingredientList, { ...newIngredient, amount: "", recipe_unit: "" }]);
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
                <div className="content__image-input">
                    {image ? <img src={image.url}/> : <img src="https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg"/>}
                    <label htmlFor='file'>파일 찾기</label>
                    <input type="file" onChange={handleSelectFile} id='file' style={{"display":"none"}}/>
                </div>
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
                                        onChange={(event) => {
                                            onChangeAmount(idx, event.target.value);
                                            setExpectedABV(calculateABV(ingredientList, unitList));
                                            setExpectedColor(calculateColor(ingredientList, unitList));
                                            setExpectedPrice(calculatePrice(ingredientList, unitList));
                                        }}
                                        min="0"
                                    />
                                    <select
                                        data-testid="ingredientUnitSelect"
                                        onChange={(e) => {
                                            onChangeIngredientUnit(idx, e.target.value);
                                            setExpectedABV(calculateABV(ingredientList, unitList));
                                            setExpectedColor(calculateColor(ingredientList, unitList));
                                            setExpectedPrice(calculatePrice(ingredientList, unitList));
                                        }}>
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
