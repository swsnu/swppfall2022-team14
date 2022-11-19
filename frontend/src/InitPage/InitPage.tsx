import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import Filter from "./Components/Filter"
import Item from "../common/Components/Item"
import React from 'react';
import styles from "./InitPage.module.scss"
import LoginModal from "./Modals/LoginModal"
import InitMyLiqourModal from "./Modals/InitMyLiquorModal"
import { fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import { fetchMyIngredientList, selectIngredient } from "../store/slices/ingredient/ingredient";

export interface Filterparam {
    type_one: string[],
    type_two: string[],
    type_three: string[]
}


const InitPage = () => {
    const dummy_user_id = 4;
    const ingredientState = useSelector(selectIngredient)

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()

    const [fakeLoginState, setFakeLoginState] = useState(false)
    // const [urlParams, setUrlParams] = useState<string>("")
    const [filterParam, setFilterParam] = useState<Filterparam>({ type_one: [], type_two: [], type_three: [] })
    const [input, setInput] = useState('')
    const my_ingredient_id_list = ingredientState.myIngredientList.map(ingredient => ingredient.id)

    const request_param = { filter_param: filterParam, name_param: input, my_ingredient_param: my_ingredient_id_list }

    const navigate = useNavigate()

    const [isStandard, setIsStandard] = useState(true)
    const onClickToggle = (isStandard: boolean) => {
        setIsStandard(isStandard)
    }
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const onClickFilter = () => {
        setIsOpenFilter(!isOpenFilter)
    }
    const [isOpenProfile, setisOpenProfile] = useState(false) // 프로필 클릭 시 나오는 버튼 handle
    const onClickProfile = () => {
        setisOpenProfile(!isOpenProfile)
    }
    // TODO : HANDLE LOGIN
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const onClickLogin = () => {
        setIsLoginOpen(true)
    }
    const [isInitMyLiqourOpen, setIsInitMyLiqourOpen] = useState(false);
    const onClickMyLiqour = () => {
        setIsInitMyLiqourOpen(true)
    }
    const onClicklogout = () => {
        setFakeLoginState(false)
    }
    const onClickSearch = () => {
        // TODO : give params with filter information
        if (isStandard) navigate(`/standard`,
            { state: request_param }
        )
        else navigate(`/custom`, { state: request_param })
    }

    const onClickMyPage = () => {
        navigate(`/mypage`)
    }

    useEffect(() => {
        if (isStandard) {
            dispatch(fetchStandardCocktailList(null))
        } else {
            dispatch(fetchCustomCocktailList(null))
        }
    }, [isStandard])
    useEffect(() => {
        dispatch(fetchMyIngredientList(dummy_user_id))
    }, [])



    return <div className={styles.margin}>
        <div className={styles.header}>
            {fakeLoginState ? <button onClick={onClickProfile}>내 프로필</button> : <div className={`${styles.button} ${styles.header__login}`} onClick={onClickLogin}>로그인</div>}
            {fakeLoginState && isOpenProfile ? <div>
                <button onClick={onClickMyPage}>My Page</button>
                <button onClick={onClicklogout}>Logout</button>
            </div> : null}
        </div>
        <div className={styles.nav}>
            <div className={`${styles['flex-box']} ${styles.nav__left}`}>
                <button className={styles.button} onClick={() => onClickToggle(true)} disabled={isStandard}>스탠다드</button>
                <button className={styles.button} onClick={() => onClickToggle(false)} disabled={!isStandard}>커스텀</button>
            </div>
            <div className={`${styles['flex-box']} ${styles.nav__right}`}>
                <input className={styles.nav__input} placeholder="칵테일 이름 검색" value={input} onChange={(e) => setInput(e.target.value)} />
                <button className={styles.button} onClick={onClickFilter}>FILTER</button>
                <button className={styles.button} onClick={onClickSearch}>SEARCH</button>
            </div>

            {isOpenFilter ? <Filter setUrlParams={setFilterParam} /> : null}
        </div>
        <div className={styles.main}>
            <div className={styles.main__inner}>
                {cocktailState.cocktailList.map((cocktail) => <Item key={cocktail.id} image={cocktail.image}
                    name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} tags={cocktail.tags} />)}
            </div>
        </div>
        <button className={styles['my-liquor']} onClick={onClickMyLiqour}>My Liquor</button>
        <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} setLoginState={setFakeLoginState} />
        <InitMyLiqourModal isOpen={isInitMyLiqourOpen} setIsOpen={setIsInitMyLiqourOpen} />

    </div >
}


export default InitPage