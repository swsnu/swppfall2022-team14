import './ListPage.scss'
import React, {useEffect, useState} from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import Item from "./Item/Item";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../store";
import {useNavigate, useParams} from "react-router";
import cocktail, {
    CocktailItemType,
    fetchCustomCocktailList,
    fetchStandardCocktailList, searchCustomCocktailList, searchStandardCocktailList,
    selectCocktail
} from "../store/slices/cocktail/cocktail";
import NavBar from "../NavBar/NavBar";

const dummyListIem = [
    {
        id: 1,
        name: 'name',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 4.8
    }, {
        id: 2,
        name: 'name2',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 3.4
    }, {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },

]

const ListPage = () => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const params = useParams()
    const cocktailState = useSelector(selectCocktail)

    const [pageType, setPageType] = useState<any>('')
    const [list, setList] = useState<CocktailItemType[]>([])
    const [word, setWord] = useState('')

    useEffect(() => {
        setPageType(params.type)
    },[])

    useEffect(() => {
        if(pageType === 'standard'){
            dispatch(fetchStandardCocktailList())
        }
        else if(pageType === 'custom'){
            dispatch(fetchCustomCocktailList())
        }
        else if(pageType === 'ingredient'){
            //TODO
            //add ingredient fetch function
        }
        else{
            navigate(`/standard`)
        }
    },[pageType])
    useEffect(() => {
        setList(cocktailState.cocktailList)
    },[cocktailState.cocktailList])
    //param

    const handleSearchWord = () => {
        if(pageType === 'standard'){
            dispatch(searchStandardCocktailList(word))
        }
        else if(pageType === 'custom'){
            dispatch(searchCustomCocktailList(word))
        }
    }
    return(
        <div className="list">
            <div className="list__navbar">
                <NavBar />
            </div>
            <div className="list__content">
                <div className="list__content-up">
                    <div className="list__content-search-wrap">
                        <BiSearchAlt2 onClick={handleSearchWord} className="list__content-search-icon" />
                        {/*TODO handle search param*/}
                        <input className="list__content-search" placeholder={"search"} value={word} onChange={(e) => setWord(e.target.value)}/>
                    </div>
                </div>
                {pageType === '' ?
                    <h1>loading ...</h1>
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