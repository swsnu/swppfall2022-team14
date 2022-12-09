import { useState, useEffect } from "react";
import AddIngredientModal from "../CreateCustomPage/Modals/AddIngredientModal"
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { CocktailDetailType, IngredientPrepareType, editCocktail, getCocktail, selectCocktail, PostForm } from "../store/slices/cocktail/cocktail";
import './EditCustomPage.scss';
import NavBar from "../NavBar/NavBar";
import React from 'react';
import { IngredientType } from "../store/slices/ingredient/ingredient";
import { selectUser } from "../store/slices/user/user";
import { calculateABV, calculateColor, calculatePrice } from "../common/utils/utils";
import S3 from 'react-aws-s3-typescript'
import {v4 as uuid} from 'uuid'
import { Button, ImageListItem, ImageListItemBar, Divider, IconButton, Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveIcon from '@mui/icons-material/Remove';

export interface Image {
    key:string;
    url:string;
}

export default function EditCustomPage() {
    const { id } = useParams();

    const [name, setName] = useState<string>("");
    const [nameEng, setNameEng] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagItem, setTagItem] = useState<string>("");
    const [expectedABV, setExpectedABV] = useState<number>(123);  // Temporary
    const [expectedPrice, setExpectedPrice] = useState<number>(0);  // Temporary
    const [expectedColor, setExpectedColor] = useState<string>('');

    const [ingredientList, setIngredientList] = useState<IngredientPrepareType[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState<IngredientType | null>(null);

    const cocktailState = useSelector(selectCocktail);
    const cocktail = cocktailState.cocktailItem;
    const [image, setImage] = useState<Image|null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser)

    useEffect(() => {
        if (!userState.isLogin) {
            navigate(-1)
            console.log("먼저 로그인 해주세요")
        }
        else {
            dispatch(getCocktail(Number(id)));
        }
    }, []);

    // INITIALIZE
    useEffect(() => {
        if (cocktail) {
            setName(cocktail.name);
            setIntroduction(cocktail.introduction);
            setRecipe(cocktail.recipe);
            setTagList(cocktail.tags);
            setNameEng(cocktail.name_eng);
            setIngredientList(cocktail.ingredients);
            const url = cocktail.image.split('/')
            const key = url[url.length-2] + url[url.length-1].split('.')[0]
            console.log({url: cocktail.image, key: key})
            setImage({url: cocktail.image, key: key});
            console.log(cocktail.ingredients)
        }
    }, [cocktail]);


    const navigate = useNavigate();
    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };

    useEffect(() => {
        if (newIngredient) {
            setIngredientList([...ingredientList, { ...newIngredient, amount: "", recipe_unit: newIngredient.unit[0] }]);
            setNewIngredient(null);
        }
    }, [newIngredient])

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

    const onChangeIngredientUnit = (selectedIdx: number, changedUnit: string) => {
        setIngredientList(
            ingredientList.map((ingredient, idx) => {
                if (idx !== selectedIdx) {
                    return ingredient;
                } else {
                    return { ...ingredient, recipe_unit: changedUnit } as IngredientPrepareType;
                }
            })
        );
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

    useEffect(() => {
        setExpectedABV(calculateABV(ingredientList))
        setExpectedPrice(calculatePrice(ingredientList))
        setExpectedColor(calculateColor(ingredientList))
        console.log(expectedABV, expectedPrice, expectedColor)
    }, [ingredientList])

    const editCocktailHandler = async () => {
        if (userState.user?.id !== null && userState.token !== null) {
            const ingredients = ingredientList.map((ingr, ind) => {
                return { ...ingr, amount: ingr.amount, unit: ingr.recipe_unit }
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
            console.log(data)
            const response = await dispatch(editCocktail({ data: data, id: Number(id) }))
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

    if (cocktailState.itemStatus == "loading") {
        return <div>Loading ..</div>
    }
    else if (cocktailState.itemStatus == "failed" || !cocktail) {
        return <div>Non existing cocktail</div>
    }
    else {
        return (
            <Stack direction="row" justifyContent="space-between" sx={{ pr: 2 }} divider={<Divider orientation="vertical" flexItem />}>
                <NavBar />
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
                        onClick={() => editCocktailHandler()}>Confirm</button>
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
                            {[...ingredientList, { name: "", amount: undefined, unit: [""], recipe_unit: "" }].map((ingredient, idx) => {
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
                                            type="number"
                                            onChange={(event) => {
                                                onChangeAmount(idx, event.target.value);
                                                setExpectedABV(calculateABV(ingredientList));
                                                setExpectedPrice(calculatePrice(ingredientList));
                                                setExpectedColor(calculateColor(ingredientList));
                                            }}
                                            min="0"
                                        />
                                        <select
                                            data-testid="ingredientUnitSelect"
                                            onChange={(e) => {
                                                onChangeIngredientUnit(idx, e.target.value);
                                                setExpectedABV(calculateABV(ingredientList));
                                                setExpectedPrice(calculatePrice(ingredientList));
                                                setExpectedColor(calculateColor(ingredientList));
                                            }} defaultValue={ingredient.recipe_unit}>
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
                        <p className="content__price">예상 가격: {expectedPrice}원</p>
                        예상 색깔: <div className="content__color" style={{ "backgroundColor": `#${expectedColor}` }}></div>
                    </div>
                </div>
            </div>
            </Stack>
        )
    }
}