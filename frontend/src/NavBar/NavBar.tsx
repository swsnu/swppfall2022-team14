import React, { useEffect, useState } from 'react';
import './NavBar.scss'
import NavFilter from "./NavFilter/NavFilter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { useNavigate, useParams } from "react-router";
import { fetchMyIngredientList, selectIngredient } from '../store/slices/ingredient/ingredient';
import { Filterparam } from '../InitPage/InitPage';

const NavBar = () => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const dummy_user_id = 4;
    useEffect(() => {
        dispatch(fetchMyIngredientList(dummy_user_id))
    }, [])

    const [filterParam, setFilterParam] = useState<Filterparam>({ type_one: [], type_two: [], type_three: [], available_only: false })
    const ingredientState = useSelector(selectIngredient)
    const my_ingredient_id_list = ingredientState.myIngredientList.map(ingredient => ingredient.id)
    const [input, setInput] = useState('')
    const request_param = { filter_param: filterParam, name_param: input, my_ingredient_param: filterParam.available_only ? my_ingredient_id_list : null }





    //BELOW

    const [openIngr, setOpenIngr] = useState(false)
    const [curFilter, setCurFilter] = useState('ST')
    const [pop, setPop] = useState(false)

    const handleST = () => {
        if (pop) {
            setPop(false)
            return
        }
        setPop(true)
        setCurFilter('ST')
    }
    const handleCS = () => {
        if (pop) {
            setPop(false)
            return
        }
        setPop(true)
        setCurFilter('CS')
    }
    const handleIG = () => {
        if (pop) {
            setPop(false)
            return
        }
        setPop(true)
        setCurFilter('IG')
    }
    const handleUpload = () => {
        navigate('/custom/create')
    }
    const handleHome = () => {
        navigate('/')
    }
    const handleMyPage = () => {
        navigate('/mypage')
    }

    const onClickSearch = () => {
        /* istanbul ignore else */
        if (curFilter === 'ST') {
            navigate(`/standard`,
                { state: request_param }
            )
        }
        else if (curFilter === 'CS') {
            navigate(`/custom`, { state: request_param })
        }
        else if (curFilter === 'IG') {
            navigate('/ingredient')
        }
        else {
            // console.log("TYPE NOT MATCH")
        }
        // window.location.reload()
    }
    return (
        <div className="nav">
            <div className="nav__menu">
                <div className="nav__menu-wrap" onClick={handleST}>Standard</div>
                {
                    curFilter === 'ST' && pop ? <NavFilter setFilterParam={setFilterParam} handleSearch={onClickSearch} type={curFilter} /> : null
                }
                <div className="nav__menu-wrap" onClick={handleCS}>Custom</div>
                {
                    curFilter === 'CS' && pop ? <NavFilter setFilterParam={setFilterParam} handleSearch={onClickSearch} type={curFilter} /> : null
                }
                <div className="nav__menu-wrap" onClick={handleIG}>Ingredient</div>
                {
                    curFilter === 'IG' && pop ? <NavFilter setFilterParam={setFilterParam} handleSearch={onClickSearch} type={curFilter} /> : null
                }
                <div className="nav__menu-bigwrap">
                    <div className="nav__menu-page" onClick={handleUpload}>Upload</div>
                    <div className="nav__menu-page" onClick={() => setOpenIngr(!openIngr)}>My Liquor</div>
                    <div className="nav__menu-page" onClick={handleHome}>Home</div>
                    <div className="nav__menu-page" onClick={handleMyPage}>My Page</div>
                </div>
            </div>
            {
                openIngr ?
                    <div className="nav__side">
                        <div className="nav__side-util">
                            <button>ADD</button>
                        </div>
                        {/*TODO mapping ingr*/}
                        <div className="nav__side-ingr">
                            <div className="nav__side-ingr-name">1234</div>
                            <div className="nav__side-ingr-abv">3%</div>
                        </div>
                        <div className="nav__side-ingr">
                            <div className="nav__side-ingr-name">asdfasdf</div>
                            <div className="nav__side-ingr-abv">41%</div>
                        </div>
                        <div className="nav__side-ingr">
                            <div className="nav__side-ingr-name">jtafsdf</div>
                            <div className="nav__side-ingr-abv">123</div>
                        </div>
                        <div className="nav__side-ingr">
                            <div className="nav__side-ingr-name">aqethadgva sdfa</div>
                            <div className="nav__side-ingr-abv">23</div>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default NavBar