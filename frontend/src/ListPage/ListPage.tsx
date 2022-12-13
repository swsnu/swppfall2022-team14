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


const ListPage = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { type } = useParams<string>()
    const cocktailState = useSelector(selectCocktail)
    const ingrState = useSelector(selectIngredient)
    const userState = useSelector(selectUser)
    const [list, setList] = useState<CocktailItemType[]>([])
    const [ingrList, setIngrList] = useState<IngredientType[]>([])
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const location = useLocation()

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
                <Typography variant="h4" sx={{ mb: 3 }}>
                    search filters
                </Typography>
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