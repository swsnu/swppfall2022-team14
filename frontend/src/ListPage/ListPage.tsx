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


const ListPage = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { type } = useParams<string>()
    const cocktailState = useSelector(selectCocktail)
    const ingrState = useSelector(selectIngredient)
    const userState = useSelector(selectUser)
    const [list, setList] = useState<CocktailItemType[]>([])
    const [ingrList, setIngrList] = useState<IngredientType[]>([])
    const location = useLocation()

    const pageStatus = type === 'ingredient' ? ingrState.listStatus : cocktailState.listStatus




    useEffect(() => {

        const param: FilterParamType | null = type === 'ingredient' ? null : {
            type_one: location.state.filter_param.type_one,
            type_two: location.state.filter_param.type_two,
            type_three: location.state.filter_param.type_three,
            name_param: location.state.name_param,
            available_only: location.state.filter_param.available_only
        }

        dispatch(fetchIngredientList())
        if (userState.isLogin)
            dispatch(fetchMyIngredientList())
        if (type === 'standard')
            dispatch(fetchStandardCocktailList(param))
        else if (type === 'custom')
            dispatch(fetchCustomCocktailList(param))

    }, [location])


    useEffect(() => {
        setList(cocktailState.cocktailList)
    }, [cocktailState.cocktailList])
    useEffect(() => {
        setIngrList(ingrState.ingredientList)
    }, [ingrState.ingredientList])
    //param

    if (pageStatus === "loading") return <div></div> // Loading Window
    else if (pageStatus === "failed") return <div></div> // Failed Window
    else return <div className="list">
        <div className="list__navbar">
            <NavBar />
        </div>
        <div className="list__content">
            <div className="list__content-up">
                <div className="list__content-search-wrap">

                </div>
            </div>
            {type === 'ingredient' ?
                <div className="list__content-down">
                    <div className="list__content-item-wrap">
                        {/*TODO use Real data*/}
                        {ingrList.map((ingredient) => <Ingr key={ingredient.id} image={ingredient.image} name={ingredient.name} id={ingredient.id} />)}
                    </div>
                </div>
                :
                <div className="list__content-down">
                    <div className="list__content-item-wrap">
                        {/*TODO use Real data*/}
                        {list.map((cocktail) => <Item key={cocktail.id} image={cocktail.image}
                            name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} tags={cocktail.tags} />)}
                    </div>
                </div>
            }
        </div >
    </div >

}

export default ListPage