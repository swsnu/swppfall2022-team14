import './ListPage.scss'
import React, { useEffect, useState } from 'react';
import Item from "./Item/Item";
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
import NavBar from "../NavBar/NavBar";
import { fetchIngredientList, fetchMyIngredientList, IngredientType, selectIngredient } from "../store/slices/ingredient/ingredient";
import Ingr from "./Ingr/Ingr";
import { selectUser } from '../store/slices/user/user';
import { Grid, Container, Divider, Typography, Stack, Box } from "@mui/material";
import LocalBarIcon from '@mui/icons-material/LocalBar';

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

    sentence += "칵테일들"

    return sentence
}

const ListPage = () => {

    const dispatch = useDispatch<AppDispatch>()
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

        if (type === 'standard')
            dispatch(fetchStandardCocktailList(param))
        else if (type === 'custom')
            dispatch(fetchCustomCocktailList(param))
        else if (type === 'ingredient')
            dispatch(fetchIngredientList(null))

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
                <Stack spacing={2} sx={{ width: 1, p: 3 }} />
            </>
        )
    }
    else if (pageStatus === "failed") {
        return (
            <>
                {/*<NavBar />*/}
                <Stack spacing={2} sx={{ width: 1, p: 3 }} />
            </>
        )
    }
    else return (
        <>
            {/*<NavBar />*/}
            <Container sx={{ py: 3 }} >
                <Typography variant="h4" sx={{ mb: 3 }} fontFamily="Hi Melody" color="#BC953B">
                    {filterParamsToSentence(filterParam)} {filterParam?.color ? <Box component="span" sx={{ height: 100, p: 2 }}>
                        <LocalBarIcon sx={{ fontSize: 40, color: filterParam?.color }} />
                    </Box> : null}
                </Typography>
                {type === 'ingredient' ?
                    <Grid container spacing={3}>
                        {ingrList.map((ingredient) =>
                            <Grid key={ingredient.id} item xs={12} sm={6} md={3}>
                                <Ingr
                                    key={ingredient.id}
                                    image={ingredient.image}
                                    name={ingredient.name}
                                    id={ingredient.id}
                                />
                            </Grid>
                        )}
                    </Grid> :
                    <Grid container spacing={3}>
                        {list.map((cocktail) =>
                            <Grid key={cocktail.id} item xs={12} sm={6} md={3}>
                                <Item
                                    key={cocktail.id}
                                    image={cocktail.image}
                                    name={cocktail.name}
                                    rate={cocktail.rate}
                                    type={cocktail.type}
                                    id={cocktail.id}
                                    tags={cocktail.tags}
                                    is_bookmarked={cocktail.is_bookmarked}
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