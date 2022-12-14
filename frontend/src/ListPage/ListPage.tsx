import './ListPage.scss'
import React, { useEffect, useState } from 'react';
import Item from "../common/Components/Item";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { useLocation, useParams } from "react-router";
import {
    CocktailItemType,
    fetchCustomCocktailList,
    fetchStandardCocktailList,
    FilterParamType,
    selectCocktail
} from "../store/slices/cocktail/cocktail";
import { fetchIngredientList, fetchMyIngredientList, IngredientType, selectIngredient } from "../store/slices/ingredient/ingredient";
import IngredientItem from "../common/Components/IngredientItem";
import { selectUser } from '../store/slices/user/user';
import { Grid, Container, Typography, Stack } from "@mui/material";
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import "@fontsource/hi-melody";
import { ClipLoader } from 'react-spinners';
import { useSearchParams } from 'react-router-dom';

function filterParamsToSentence(filterParam: FilterParamType | null) {

    if (!filterParam)
        return ""

    const { type_one, type_two, type_three } = filterParam;



    let sentence = ""
    if (type_one.length === 2)
        sentence += "클래식한 혹은 여름 느낌의"
    else if (type_one.length === 1)
        if (type_one[0] === "클래식")
            sentence += "클래식한"
        else if (type_one[0] === "트로피컬")
            sentence += "여름 느낌의"



    if (type_three.length > 0 && sentence !== "")
        sentence += ", "
    else
        sentence += " "

    if (type_three[0] === "weak")
        sentence += "가볍게 마시는 "
    else if (type_three[0] === "medium")
        sentence += "은은하게 취하는 "
    else if (type_three[0] === "strong")
        sentence += "도수 높은 "
    else if (type_three[0] == "extreme")
        sentence += "주당을 위한 "


    if (sentence.length === 1)
        sentence = "모든 칵테일들 목록"
    else
        sentence += "칵테일들"

    return sentence
}

const ListPage = () => {

    const dispatch = useDispatch<AppDispatch>()
    const [searchParams, setSearchParams] = useSearchParams();
    const { type } = useParams<string>()
    const cocktailState = useSelector(selectCocktail)
    const ingrState = useSelector(selectIngredient)
    const userState = useSelector(selectUser)
    const [list, setList] = useState<CocktailItemType[]>([])
    const [ingrList, setIngrList] = useState<IngredientType[]>([])
    const location = useLocation()
    const [filterParam, setFilterParam] = useState<FilterParamType | null>(null)

    const pageStatus = type === 'ingredient' ? ingrState.listStatus : cocktailState.listStatus

    useEffect(() => {

        const param: FilterParamType | null = (type === 'ingredient' || !location.state) ? null : {
            type_one: location.state.filter_param.type_one,
            type_two: location.state.filter_param.type_two,
            type_three: location.state.filter_param.type_three,
            name_param: location.state.name_param,
            available_only: location.state.filter_param.available_only,
            color: location.state.filter_param.color
        }
        setFilterParam(param)


        if (type === 'standard'){
            dispatch(fetchStandardCocktailList({ params: param, token: userState.token }))
        }
        else if (type === 'custom'){
            dispatch(fetchCustomCocktailList({ params: param, token: userState.token }))
        }
        else if (type === 'ingredient'){
            const search = searchParams.get('search')
            dispatch(fetchIngredientList(search))
        }

    }, [location])


    useEffect(() => {
        setList(cocktailState.cocktailList)
    }, [cocktailState.cocktailList])

    useEffect(() => {
        setIngrList(ingrState.ingredientList)
    }, [ingrState.ingredientList])

    if (pageStatus === "loading") {
        return (
            <>
                {/*<NavBar />*/}
                <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ width: 1, pt: 20 }}>
                    <ClipLoader
                        color='primary.light'
                        loading
                    />
                </Stack>
            </>
        )
    }
    else if (pageStatus === "failed") {
        return (
            <>
                {/*<NavBar />*/}
                <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ width: 1, pt: 20 }}>
                    <Typography
                        variant="h6"
                        color="primary.light"
                    >
                        서버로부터 정보를 불러오지 못하였습니다.
                    </Typography>
                </Stack>
            </>
        )
    }
    else return (
        <>
            {/*<NavBar />*/}
            <Container sx={{ width: 1, py: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-end"
                    sx={{
                        width: 1,
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontFamily="Hi Melody"
                        color="#BC953B"
                        sx={{
                            height: 50,
                        }}
                    >
                        {(type !== "ingredient" && cocktailState.cocktailList.length === 0) ?
                            "No Cocktails" :
                            filterParamsToSentence(filterParam)
                        }
                    </Typography>
                    {filterParam?.color &&
                        <LocalBarRoundedIcon
                            sx={{
                                fontSize: 20,
                                color: filterParam?.color,
                                ml: 2,
                                mb: 2.5,
                            }}
                        />
                    }
                </Stack>

                {type === 'ingredient' ?
                    <Grid container spacing={3} columns={4}>
                        {ingrList.map((ingredient) =>
                            <Grid key={ingredient.id} item md={1} sm={2} xs={4}>
                                <IngredientItem
                                    key={ingredient.id}
                                    image={ingredient.image}
                                    name={ingredient.name}
                                    id={ingredient.id}
                                    ABV={ingredient.ABV}
                                    my_item={ingrState.myIngredientList.map(ingr => ingr.id).includes(ingredient.id)}
                                />
                            </Grid>
                        )}
                        {ingrList.length === 0 ? <div>&nbsp;&nbsp;&nbsp; 검색 결과가 없습니다.</div> : null}
                    </Grid> :
                    <Grid container spacing={3} columns={4}>
                        {list.map((cocktail) =>
                            <Grid key={cocktail.id} item md={1} sm={2} xs={4}>
                                <Item
                                    key={cocktail.id}
                                    image={cocktail.image}
                                    name={cocktail.name}
                                    rate={cocktail.rate}
                                    type={cocktail.type}
                                    id={cocktail.id}
                                    tags={cocktail.tags}
                                    is_bookmarked={cocktail.is_bookmarked}
                                    ABV={cocktail.ABV}
                                    price_per_glass={cocktail.price_per_glass}
                                />
                            </Grid>
                        )}
                    </Grid>
                }
            </Container>
        </>
    )
}

export default ListPage