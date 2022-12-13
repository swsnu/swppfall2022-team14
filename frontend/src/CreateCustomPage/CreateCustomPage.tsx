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
import { v4 as uuid } from 'uuid'
import { Button, Grid, ImageListItem, ImageListItemBar, FormGroup, IconButton, Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveIcon from '@mui/icons-material/Remove';

export interface Image {
    key: string;
    url: string;
}
import { calculateABV, calculateColor, calculatePrice } from "../common/utils/utils";


export default function CreateCustomPage() {
    const typeOneList: string[] = ["클래식", "트로피컬"]
    const typeTwoList: string[] = ["롱 드링크", "숏 드링크", "샷"]
    const [name, setName] = useState<string>("");
    const [nameEng, setNameEng] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagItem, setTagItem] = useState<string>("");
    const [image, setImage] = useState<Image | null>(null);
    const [typeOne, setTypeOne] = useState<string>("");
    const [typeTwo, setTypeTwo] = useState<string>("");
    const [expectedABV, setExpectedABV] = useState<number>(0);
    const [expectedPrice, setExpectedPrice] = useState<number>(0);
    const [expectedColor, setExpectedColor] = useState<string>('');

    const [ingredientList, setIngredientList] = useState<IngredientPrepareType[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState<IngredientType | null>(null);

    const navigate = useNavigate();
    const onClickIngredientDelete = (selectedIdx: number) => {
        setIngredientList(ingredientList.filter((_value, idx) => idx !== selectedIdx));
    };



    useEffect(() => {
        setExpectedABV(calculateABV(ingredientList));
        setExpectedColor(calculateColor(ingredientList));
        setExpectedPrice(calculatePrice(ingredientList));
    }, [ingredientList])



    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(selectUser)

    const onChangeAmount = (selectedIdx: number, changedAmount: string) => {
        setIngredientList(
            ingredientList.map((ingredient, idx) => {
                if (idx !== selectedIdx) {
                    return ingredient;
                } else {
                    return { ...ingredient, amount: changedAmount.replace(/\D/g, '').replace(/^0+/, '') } as IngredientPrepareType;
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

    const createCocktailHandler = async () => {
        if (name === "") {
            window.alert("칵테일의 이름을 입력해주세요.")
            return
        } else if (introduction === "") {
            window.alert("칵테일의 설명을 입력해주세요.")
            return
        } else if (recipe === "") {
            window.alert("칵테일의 만드는 방법을 입력해주세요.")
            return
        } else if (ingredientList.length === 0) {
            window.alert("칵테일의 재료를 추가해주세요.")
            return
        } else if (ingredientList.find(ingre => ingre.amount === '')) {
            window.alert("칵테일 재료의 양을 기재해주세요.")
            return
        }
        if (userState.user?.id !== null && userState.token !== null) {
            const ingredients = ingredientList.map((ingr, ind) => {
                return { ...ingr, amount: ingr.amount, unit: ingr.recipe_unit }
            })
            const data: PostForm = {
                cocktail: {
                    name: name,
                    name_eng: (nameEng) ? nameEng : null,
                    image: (image) ? image.url : "https://cdn.pixabay.com/photo/2015/07/16/06/48/bahama-mama-847225_1280.jpg",
                    introduction: introduction,
                    recipe: recipe,
                    ABV: expectedABV,
                    color: expectedColor,
                    price_per_glass: expectedPrice,
                    tags: tagList,
                    author_id: Number(userState.user?.id),
                    ingredients: ingredients,
                    filter_type_one: typeOne,
                    filter_type_two: typeTwo
                },
                token: userState.token
            }
            const response = await dispatch(authPostCocktail(data))
            if (response.type === `${authPostCocktail.typePrefix}/fulfilled`) {
                navigate(`/custom/${(response.payload as CocktailDetailType).id}`)
            } else {
                if (response.payload === 9001) {
                    window.alert("중복되는 칵테일 이름입니다.")
                }
                else if (response.payload === 9002) {
                    window.alert("중복되는 칵테일 영어 이름입니다.")
                }
            }
        }
    }

    const S3_config = {
        bucketName: process.env.REACT_APP_BUCKET_NAME!,
        region: "ap-northeast-2",
        accessKeyId: process.env.REACT_APP_ACCESS!,
        secretAccessKey: process.env.REACT_APP_SECRET!,
    }

    const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
                const S3Client = new S3(S3_config)
                // delete previous image
                if (image !== null) {
                    await S3Client.deleteFile(image.key)
                }

                // upload file and setImage(S3 Link)
                const fileName = 'cocktail' + '/' + uuid()
                const response = await S3Client.uploadFile(file, fileName)
                if (response.status == 204) {
                    setImage({ key: response.key, url: response.location })
                }
            } else {
                alert('이미지 파일(jpeg, png, jpg)만 업로드 가능합니다.')
                e.target.files = null
            }
        }
    }
    useEffect(() => {
        if (!userState.isLogin) {
            navigate(-1)
        }
    }, [])

    useEffect(() => {
        if (newIngredient) {
            setIngredientList([...ingredientList, { ...newIngredient, amount: "", recipe_unit: newIngredient.unit[0] }]);
            setNewIngredient(null);
        }
    }, [newIngredient])

    return (
        <>
            {/*<NavBar />*/}
            <Stack alignItems="flex-start" spacing={2} sx={{ width: 1, p: 3 }}>
                <TextField
                    label="칵테일 이름"
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={(theme) => ({
                        [theme.breakpoints.down('md')]: {
                            ml: 4
                        },
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
                    })}
                />
                <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
                    <TextField
                        label="영어 이름 (선택)"
                        variant="standard"
                        size="small"
                        value={nameEng}
                        onChange={(e) => setNameEng(e.target.value)}
                        sx={(theme) => ({
                            [theme.breakpoints.down('md')]: {
                                ml: 4
                            },
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
                        })}
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
                <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between" sx={{ width: 1 }}>
                    <ImageListItem sx={{ width: 0.25 }}>
                        <img
                            src={
                                image ?
                                    image.url :
                                    "https://cdn.pixabay.com/photo/2015/07/16/06/48/bahama-mama-847225_1280.jpg"
                            }
                            style={{ borderRadius: 20, height: 'auto' }}
                            loading="lazy"
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
                                    <label data-testid="file" htmlFor='file' style={{ "marginBottom": -2 }}>
                                        <FileUploadIcon fontSize="small" />
                                    </label>
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                    <input type="file" onChange={handleSelectFile} id='file' style={{ "display": "none" }} />
                    <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 0.75 }}>
                        <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1, p: 2, bgcolor: 'primary.main', borderRadius: 3 }}>
                            <Typography variant="body2" align="left" sx={{ color: 'text.secondary' }}>
                                재료를 추가하여 예상 도수, 가격, 색을 알아보세요.
                            </Typography>
                            <Grid container columns={2}>
                                <Grid item md={1} sm={2} xs={2}>
                                    <Stack spacing={2} alignItems="flex-start">
                                        <Typography variant="body1" sx={{ width: 0.75 }} align="left">
                                            도수 {isNaN(expectedABV) ? 0 : expectedABV.toFixed(1)}%
                                        </Typography>
                                        <Typography variant="body1" sx={{ width: 0.75 }} align="left">
                                            가격 {expectedPrice.toLocaleString()}원
                                        </Typography>
                                        <Box display="flex">
                                            <Typography variant="body1">
                                                색
                                            </Typography>
                                            <Box
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    mt: 0.75,
                                                    ml: 1,
                                                    borderRadius: 5,
                                                    bgcolor: `#${expectedColor}`
                                                }}
                                            />
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid item md={1} sm={2} xs={2}>
                                    <Stack spacing={1} alignItems="flex-start">
                                        <Stack 
                                            direction="row" 
                                            justifyContent="flex-start" 
                                            alignItems="center" 
                                            sx={(theme) => ({ 
                                                width: 1,
                                                [theme.breakpoints.down('md')]: {
                                                    mt: 1.5,
                                                },
                                                [theme.breakpoints.up('md')]: {
                                                    mt: -0.25,
                                                },
                                            })} 
                                        >
                                            <Typography 
                                                variant="body1" 
                                                sx={(theme) => ({
                                                    [theme.breakpoints.down('sm')]: {
                                                        width: 0.7,
                                                    },
                                                    [theme.breakpoints.up('sm')]: {
                                                        width: 0.5,
                                                    },
                                                })}
                                                align="left"
                                            >
                                                어떤 느낌인가요?
                                            </Typography>
                                            <TextField
                                                variant="standard"
                                                select
                                                value={typeOne}
                                                onChange={(e) => {
                                                    setTypeOne(e.target.value);
                                                }}
                                                size="small"
                                                sx={{
                                                    width: 0.3,
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
                                            >
                                                {typeOneList.map((typeone) => {
                                                    return (
                                                        <MenuItem key={typeone} value={typeone}>
                                                            {typeone}
                                                        </MenuItem>
                                                    )
                                                })}
                                            </TextField>
                                        </Stack>
                                        <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ width: 1 }}>
                                            <Typography 
                                                variant="body1" 
                                                sx={(theme) => ({
                                                    [theme.breakpoints.down('sm')]: {
                                                        width: 0.7,
                                                    },
                                                    [theme.breakpoints.up('sm')]: {
                                                        width: 0.5,
                                                    },
                                                })}
                                                align="left"
                                            >
                                                용량
                                            </Typography>
                                            <TextField
                                                variant="standard"
                                                select
                                                value={typeTwo}
                                                onChange={(e) => {
                                                    setTypeTwo(e.target.value);
                                                }}
                                                size="small"
                                                sx={{
                                                    width: 0.3,
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
                                            >
                                                {typeTwoList.map((typetwo) => {
                                                    return (
                                                        <MenuItem key={typetwo} value={typetwo}>
                                                            {typetwo}
                                                        </MenuItem>
                                                    )
                                                })}
                                            </TextField>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
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
                    </Stack>
                </Stack>
                <Box display="flex" sx={{ width: 1 }}>
                    <Box
                        sx={(theme) => ({
                            [theme.breakpoints.down('md')]: {
                                display: 'none',
                            },
                            [theme.breakpoints.up('md')]: {
                                width: 0.25,
                            },
                        })}
                    />
                    <Stack 
                        alignItems="flex-start" 
                        justifyContent="flex-start" 
                        spacing={1} 
                        sx={(theme) => ({
                            pr: 2,
                            [theme.breakpoints.down('md')]: {
                                width: 1,
                            },
                            [theme.breakpoints.up('md')]: {
                                width: 0.75,
                                pl: 3.5,
                            },
                        })}
                    >
                        {[...ingredientList, { name: "", amount: undefined, unit: [""], recipe_unit: "" }].map((ingredient, idx) => {
                            return (
                                <Stack key={ingredient.name} direction="row" spacing={1} alignItems="flex-end" justifyContent="space-between" sx={{ width: 1 }}>
                                    <Stack 
                                        key={ingredient.name} direction="row" spacing={1} alignItems="flex-end" justifyContent="flex-start" 
                                        sx={{ 
                                            width: 0.9,
                                        }}
                                    >
                                        <TextField
                                            label="재료"
                                            variant="standard"
                                            value={ingredient.name}
                                            onClick={() => (idx === ingredientList.length) && setOpen(true)}
                                            size="small"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            sx={{
                                                width: 0.5,
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
                                        <AddIngredientModal
                                            isOpen={isOpen}
                                            close={() => setOpen(false)}
                                            addedIngredientList={ingredientList.map((ingredient) => { return ingredient.name })}
                                            setNewIngrdient={setNewIngredient}
                                        />
                                        <TextField
                                            label="양"
                                            variant="standard"
                                            value={ingredient.amount}
                                            onChange={(event) => {
                                                onChangeAmount(idx, event.target.value);
                                                setExpectedABV(calculateABV(ingredientList));
                                                setExpectedColor(calculateColor(ingredientList));
                                                setExpectedPrice(calculatePrice(ingredientList));
                                            }}
                                            size="small"
                                            sx={(theme) => ({
                                                width: 0.35,
                                                [theme.breakpoints.down('sm')]: {
                                                    width: 0.2
                                                },
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
                                            })}
                                        />
                                        <TextField
                                            label="단위"
                                            variant="standard"
                                            select
                                            value={ingredient.recipe_unit}
                                            onChange={(e) => {
                                                onChangeIngredientUnit(idx, e.target.value);
                                                setExpectedABV(calculateABV(ingredientList));
                                                setExpectedColor(calculateColor(ingredientList));
                                                setExpectedPrice(calculatePrice(ingredientList));
                                            }}
                                            size="small"
                                            sx={(theme) => ({
                                                width: 0.15,
                                                [theme.breakpoints.down('sm')]: {
                                                    width: 0.25
                                                },
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
                                            })}
                                        >
                                            {ingredient.unit.map((u) => {
                                                return (
                                                    <MenuItem key={u} value={u}>
                                                        {u}
                                                    </MenuItem>
                                                )
                                            })}
                                        </TextField>
                                    </Stack>
                                    {idx !== ingredientList.length &&
                                        <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ width: 0.07 }}>
                                            <IconButton 
                                                data-testid="delete" size="small" onClick={() => onClickIngredientDelete(idx)}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    }
                                </Stack>
                            )
                        })}
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
                </Box>
                <FormGroup row sx={{ gap: 1, width: 1 }}>
                    {tagList.map((tagItem, idx) => {
                        return (
                            <Button
                                key={`${tagItem}_${idx}`}
                                sx={{ bgcolor: 'primary.light', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                                onClick={() => onDeleteTagItem(tagItem)}
                            >
                                <Typography color='text.primary'>
                                    #{tagItem}
                                </Typography>
                            </Button>
                        )
                    })}
                </FormGroup>
                <TextField
                    label="태그"
                    variant="standard"
                    value={tagItem}
                    size="small"
                    onChange={e => setTagItem(e.target.value)}
                    onKeyPress={onKeyPress}
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
            </Stack >
        </>
    )
}
