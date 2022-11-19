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
    FilterParamType,
    selectCocktail
} from "../store/slices/cocktail/cocktail";
import NavBar from "../NavBar/NavBar";
import qs from 'qs';
import { fetchIngredientList, IngredientType, selectIngredient } from "../store/slices/ingredient/ingredient";
import Ingr from "./Ingr/Ingr";


const ListPage = () => {

    const dispatch = useDispatch<AppDispatch>()
    const params = useParams()
    const cocktailState = useSelector(selectCocktail)
    const ingrState = useSelector(selectIngredient)

    const [pageType, setPageType] = useState<any>('')
    const [list, setList] = useState<CocktailItemType[]>([])
    const [ingrList, setIngrList] = useState<IngredientType[]>([])
    const location = useLocation()

    const pageStatus = pageType === 'ingredient' ? ingrState.listStatus : cocktailState.listStatus

    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true
    });

    useEffect(() => {
        setPageType(params.type)
        console.log(pageType)
        console.log(location.state)
    }, [pageType, location])

    useEffect(() => {

        if (pageType === 'ingredient') {
            dispatch(fetchIngredientList())
        }
        else if (location.state) {
            const param: FilterParamType = {
                type_one: location.state.filter_param.type_one,
                type_two: location.state.filter_param.type_two,
                type_three: location.state.filter_param.type_three,
                name_param: location.state.name_param,
                my_ingredient_id_list: location.state.my_ingredient_param
            }
            console.log(param)
            if (pageType === 'standard') {
                dispatch(fetchStandardCocktailList(param))
            }
            else if (pageType === 'custom') {
                dispatch(fetchCustomCocktailList(param))
            }
        }

    }, [pageType, location])


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
                    Searched by [  Type 1 :  {query.filter_type_one?.toString()},  Type 2 :  {query.filter_type_two?.toString()},  Type 3 :  {query.filter_type_three?.toString()},  Text :  {query.text?.toString()} ]
                </div>
            </div>
            {pageType === 'ingredient' ?
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