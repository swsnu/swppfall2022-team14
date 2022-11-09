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
import { useSearchParams } from 'react-router-dom';
import { fetchIngredientList } from '../store/slices/ingredient/ingredient';


const ListPage = () => {

    const dispatch = useDispatch<AppDispatch>()
    const params = useParams()
    const cocktailState = useSelector(selectCocktail)

    const [pageType, setPageType] = useState<any>('')
    const [list, setList] = useState<CocktailItemType[]>([])
    const location = useLocation()
    useEffect(() => {
        setPageType(params.type)
    }, [])

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
        }
        else {
            // navigate(`/standard`)
        }
    }, [pageType])
    useEffect(() => {
        setList(cocktailState.cocktailList)
    }, [cocktailState.cocktailList])
    //param


    if (cocktailState.listStatus === "loading") return <div></div> // Loading Window
    else if (cocktailState.listStatus === "failed") return <div></div> // Failed Window
    else return (
        <div className="list">
            <div className="list__navbar">
                <NavBar />
            </div>
            <div className="list__content">
                <div className="list__content-up">
                    <div className="list__content-search-wrap">
                        <BiSearchAlt2 className="list__content-search-icon" />
                        {/*TODO handle search param*/}
                        <input className="list__content-search" placeholder={"search"} />
                    </div>
                </div>
                <div className="list__content-down">
                    <div className="list__content-item-wrap">
                        {/*TODO use Real data*/}
                        {list.map((cocktail) => <Item key={cocktail.id} image={cocktail.image}
                            name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListPage