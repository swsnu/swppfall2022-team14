import './ListPage.scss'
import React, { useEffect, useState } from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import Item from "./Item/Item";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { useLocation, useNavigate, useParams } from "react-router";
import cocktail, {
    CocktailItemType,
    fetchCustomCocktailList,
    fetchStandardCocktailList,
    selectCocktail
} from "../store/slices/cocktail/cocktail";
import NavBar from "../NavBar/NavBar";
import qs from 'qs';
import {fetchIngredientList, IngredientType, selectIngredient} from "../store/slices/ingredient/ingredient";
import Ingr from "./Ingr/Ingr";


const ListPage = () => {

    const dispatch = useDispatch<AppDispatch>()
    const params = useParams()
    const navigate = useNavigate()
    const cocktailState = useSelector(selectCocktail)
    const ingrState = useSelector(selectIngredient)

    const [pageType, setPageType] = useState<any>('')
    const [list, setList] = useState<CocktailItemType[]>([])
    const [ingrList, setIngrList] = useState<IngredientType[]>([])
    const location = useLocation()

    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true
    });

    useEffect(() => {
        setPageType(params.type)
    }, [pageType,location])

    useEffect(() => {
        if (pageType === 'standard') {
            dispatch(fetchStandardCocktailList(location.search.replace("?", "")))
        }
        else if (pageType === 'custom') {
            dispatch(fetchCustomCocktailList(location.search.replace("?", "")))
        }
        else if (pageType === 'ingredient') {
            //TODO
            //add ingredient fetch function
            dispatch(fetchIngredientList())
        }
        else {
            //TODO
            //handle invalid url
        }
    }, [pageType,location])

    useEffect(() => {
        setList(cocktailState.cocktailList)
    }, [cocktailState.cocktailList])
    useEffect(() => {
        setIngrList(ingrState.ingredientList)
    },[ingrState.ingredientList])
    //param

    return (
        <div className="list">
            <div className="list__navbar">
                <NavBar />
            </div>
            <div className="list__content">
                <div className="list__content-up">
                    <div className="list__content-search-wrap">
                        Searched by [  Type 1 :  {query.filter_type_one?.toString()},  Type 2 :  {query.filter_type_two?.toString()},  Type 3 :  {query.filter_type_three?.toString()},  Text :  {query.text?.toString()} ]
                    </div>
                </div>
                {pageType === '' ?
                    <h1>loading ...</h1>
                    :
                    pageType === 'ingredient' ?
                        <div className="list__content-down">
                            <div className="list__content-item-wrap">
                                {/*TODO use Real data*/}
                                {ingrList.map((cocktail) => <Ingr key={cocktail.id} image={cocktail.image} name={cocktail.name}  id={cocktail.id} />)}
                            </div>
                        </div>
                        :
                        <div className="list__content-down">
                            <div className="list__content-item-wrap">
                                {/*TODO use Real data*/}
                                {list.map((cocktail) => <Item key={cocktail.id} image={cocktail.image}
                                    name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} />)}
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ListPage