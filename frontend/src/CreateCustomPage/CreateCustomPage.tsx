import { useState, useEffect } from "react";
import AddIngredientModal from "./Modals/AddIngredientModal"
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import NavBar from "../NavBar/NavBar";
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
import { Box, Button, Checkbox, ImageListItem, ImageListItemBar, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';

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
                    image: (image) ? image.url : "https://cdn.pixabay.com/photo/2015/07/16/06/48/bahama-mama-847225_1280.jpg",
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
        <Stack direction="row" justifyContent="space-between" sx={{ pr: 2 }} divider={<Divider orientation="vertical" flexItem />}>
            <NavBar />
            <Stack alignItems="flex-start" spacing={2} sx={{ width: 1, p: 3 }}>
                <TextField 
                    label="칵테일 이름" 
                    variant="standard" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                        '& label.Mui-focused': {
                            color: 'secondary.light',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: 'secondary.light',
                        },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: 'secondary.light',
                            },
                        },
                    }}
                />
                <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
                    <TextField 
                        label="영어 이름 (선택)" 
                        variant="standard" 
                        size="small"
                        value={nameEng} 
                        onChange={(e) => setNameEng(e.target.value)}
                        sx={{
                            '& label.Mui-focused': {
                                color: 'secondary.light',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: 'secondary.light',
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: 'secondary.light',
                                },
                            },
                        }}
                    />
                    <Button variant="contained" onClick={createCocktailHandler}
                        sx={{
                            bgcolor: 'primary.dark',
                            borderRadius: 3,
                            boxShadow: 3,
                            '&:hover': {
                                backgroundColor: 'secondary.main',
                                boxShadow: 2,
                            },
                        }}
                    >
                        업로드
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: 1 }}>
                    <ImageListItem sx={{ width: 0.3, height: 'fit-content' }}>
                        <img
                            src={
                                image ?
                                image.url :
                                "https://cdn.pixabay.com/photo/2015/07/16/06/48/bahama-mama-847225_1280.jpg"
                            }
                            style={{ borderRadius: 20 }}
                        />
                        <ImageListItemBar
                            sx={{
                                background: "rgba(0,0,0,0)"
                            }}
                            actionIcon={
                                <IconButton 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: "primary.main", m: 1, px: 0.8, boxShadow: 3,
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            boxShadow: 2,
                                        },
                                    }}
                                >
                                    <label htmlFor='file' style={{ "marginBottom": -2 }}>
                                        <FileUploadIcon fontSize="small" />
                                    </label>
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                    <input type="file" onChange={handleSelectFile} id='file' style={{ "display": "none" }} />
                    <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1 }}>
                        <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1, p: 2, bgcolor: 'primary.main', borderRadius: 3 }}>
                            <Typography variant="body1">
                                {isNaN(expectedABV) ? "재료를 입력하여 예상 도수를 알아보세요." : `예상 도수 ${expectedABV}%`}
                            </Typography>
                            <Typography variant="body1">
                                예상 가격: {expectedPrice.toLocaleString()}원
                            </Typography>
                            <TextField
                                label="설명"
                                variant="standard"
                                value={introduction}
                                onChange={(e) => setIntroduction(e.target.value)}
                                multiline
                                fullWidth
                                sx={{
                                    '& label.Mui-focused': {
                                        color: 'secondary.light',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: 'secondary.light',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'secondary.light',
                                        },
                                    },
                                }}
                            />
                        </Stack>
                        <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1, px: 2 }}>
                            <TextField
                                label="만드는 방법"
                                variant="standard"
                                value={recipe}
                                onChange={(e) => setRecipe(e.target.value)}
                                multiline
                                fullWidth
                                sx={{
                                    '& label.Mui-focused': {
                                        color: 'secondary.light',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: 'secondary.light',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'secondary.light',
                                        },
                                    },
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <div className="content">
                    <div className="content__description-box">
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
            </Stack >
        </Stack>
    )
}
