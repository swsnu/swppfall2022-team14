import React, { useEffect, useState } from 'react';
import './NavBar.scss'
import NavFilter from "./NavFilter/NavFilter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { useNavigate, useParams } from "react-router";
import { fetchMyIngredientList, selectIngredient } from '../store/slices/ingredient/ingredient';
import { Filterparam } from '../InitPage/InitPage';
import {selectUser} from "../store/slices/user/user";
import LoginModal from "../InitPage/Modals/LoginModal";
import AddIngredientModal from "../common/Modals/AddIngredientModal";
import IngredientItem from "../common/Components/IngredientItem";

const NavBar = () => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const userState = useSelector(selectUser)
    const ingredientState = useSelector(selectIngredient)


    //BELOW

    const [openIngr, setOpenIngr] = useState(false)
    const [curFilter, setCurFilter] = useState('ST')
    const [pop, setPop] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);

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
        if(userState.isLogin){
            navigate('/custom/create')
        }
        else{
            setIsLoginOpen(true)
        }
    }
    const handleHome = () => {
        navigate('/')
    }
    const handleMyPage = () => {
        if(userState.isLogin){
            navigate('/mypage')
        }
        else{
            setIsLoginOpen(true)
        }
    }
    const handleMyIngr = () => {
        if(userState.isLogin){
            setOpenIngr(!openIngr)
        }
        else{
            setIsLoginOpen(true)
        }
    }

    const handleAddIngr = () => {
        setIsAddIngredientOpen(true)
        dispatch(fetchMyIngredientList())
    }

    return (
        <div className="nav">
            <div className="nav__menu">
                <div className="nav__menu-wrap" onClick={handleST}>Standard</div>
                {
                    curFilter === 'ST' && pop ? <NavFilter type={'ST'} /> : null
                }
                <div className="nav__menu-wrap" onClick={handleCS}>Custom</div>
                {
                    curFilter === 'CS' && pop ? <NavFilter type={'CS'} /> : null
                }
                <div className="nav__menu-wrap" onClick={handleIG}>Ingredient</div>
                {
                    curFilter === 'IG' && pop ? <NavFilter type={'IG'} /> : null
                }
                <div className="nav__menu-bigwrap">
                    <div className="nav__menu-page" onClick={handleUpload}>Upload</div>
                    <div className="nav__menu-page" onClick={handleMyIngr}>My Liquor</div>
                    <div className="nav__menu-page" onClick={handleHome}>Home</div>
                    <div className="nav__menu-page" onClick={handleMyPage}>My Page</div>
                </div>
            </div>
            {
                openIngr ?
                    <div className="nav__side">
                        <div className="nav__side-util">
                            <button onClick={handleAddIngr}>ADD</button>
                        </div>
                        {ingredientState.myIngredientList.map(ingredient =>
                            <div key={ingredient.id} className="nav__side-ingr">
                                <div className="nav__side-ingr-name">{ingredient.name}</div>
                                <div className="nav__side-ingr-abv">{ingredient.ABV}</div>
                            </div>
                        )}
                        {/*TODO mapping ingr*/}
                        {/*
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
                        */}
                    </div>
                    :
                    null
            }
            <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            <AddIngredientModal isOpen={isAddIngredientOpen} setIsOpen={setIsAddIngredientOpen} user_id={Number(userState.user?.id)} />
        </div>
    )
}

export default NavBar