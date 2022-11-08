import React, { useEffect, useState } from 'react';
import './NavBar.scss'
import NavFilter from "./NavFilter/NavFilter";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { useNavigate, useParams } from "react-router";

const NavBar = () => {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const params = useParams()
    const [urlParams, setUrlParams] = useState<string>("")
    const [trigger, setTrigger] = useState<string>("")

    useEffect(() => {
        setTrigger(urlParams)
        console.log(trigger)
    }, [urlParams])

    const [openIngr, setOpenIngr] = useState(false)
    const [curFilter, setCurFilter] = useState('ST')
    const [pop, setPop] = useState(false)

    const handleST = () => {
        if(pop){
            setPop(false)
            return
        }
        setPop(true)
        setCurFilter('ST')
    }
    const handleCS = () => {
        if(pop){
            setPop(false)
            return
        }
        setPop(true)
        setCurFilter('CS')
    }
    const handleIG = () => {
        if(pop){
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
        if (curFilter === 'ST') {
            navigate({
                pathname: `/standard`,
                search: urlParams
            }
            )
        }
        else if (curFilter === 'CS') {
            navigate({
                pathname: `/custom`,
                search: urlParams
            })
        }
        else if (curFilter === 'IG') {
            navigate('/ingredient')
        }
        else {
            console.log("TYPE NOT MATCH")
        }
        window.location.reload()
    }
    return (
        <div className="nav">
            <div className="nav__menu">
                <div className="nav__menu-wrap" onClick={handleST}>Standard</div>
                {
                    curFilter === 'ST' && pop ? <NavFilter setUrlParams={setUrlParams} handleSearch={onClickSearch} type={curFilter} /> : null
                }
                <div className="nav__menu-wrap" onClick={handleCS}>Custom</div>
                {
                    curFilter === 'CS' && pop ? <NavFilter setUrlParams={setUrlParams} handleSearch={onClickSearch} type={curFilter}/> : null
                }
                <div className="nav__menu-wrap" onClick={handleIG}>Ingredient</div>
                {
                    curFilter === 'IG' && pop ? <NavFilter setUrlParams={setUrlParams} handleSearch={onClickSearch} type={curFilter}/> : null
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