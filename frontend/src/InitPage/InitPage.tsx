import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Filter from "./Components/Filter"
import Item from "./Components/Item"

import styles from "./InitPage.module.scss"
import LoginModal from "./Modals/LoginModal"
import InitMyLiqourModal from "./Modals/InitMyLiqourModal"
import { CocktailType, fetchCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"


const InitPage = () => {

    const cocktailState = useSelector(selectCocktail)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchCocktailList("custom"))
    }, [])


    // const dummyCocktails: CocktailType[] =
    //     [{
    //         id: 1,
    //         name: 'name',
    //         image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
    //         introduction: '소개',
    //         recipe: '제조법',
    //         ABV: 42.4,
    //         price_per_glass: 3400,
    //         type: 'CS',
    //         author_id: 3,
    //         created_at: new Date(2022, 6, 17),
    //         updated_at: new Date(2022, 7, 14),
    //         rate: 4.8
    //     }, {
    //         id: 2,
    //         name: 'name2',
    //         image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
    //         introduction: '소개',
    //         recipe: '제조법',
    //         ABV: 42.4,
    //         price_per_glass: 3400,
    //         type: 'CS',
    //         author_id: 3,
    //         created_at: new Date(2022, 6, 17),
    //         updated_at: new Date(2022, 7, 14),
    //         rate: 3.4
    //     }, {
    //         id: 3,
    //         name: 'name3',
    //         image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
    //         introduction: '소개',
    //         recipe: '제조법',
    //         ABV: 42.4,
    //         price_per_glass: 3400,
    //         type: 'CS',
    //         author_id: 3,
    //         created_at: new Date(2022, 6, 17),
    //         updated_at: new Date(2022, 7, 14),
    //         rate: 5.0
    //     }]
    const [fakeLoginState, setFakeLoginState] = useState(false)


    const navigate = useNavigate()
    const [input, setInput] = useState('')
    const [isStandard, setIsStandard] = useState(true)
    const onClickToggle = (isStandard: boolean) => {
        setIsStandard(isStandard)
    }
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const onFilterClick = () => {
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
        if (isStandard) navigate('/standard')
        else navigate('/custom')
    }

    const onClickMyPage = () => {
        navigate(`/mypage`)
    }



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
                <button className={styles.button} onClick={onFilterClick}>FILTER</button>
                <button className={styles.button} onClick={onClickSearch}>SEARCH</button>
            </div>

            {isOpenFilter ? <Filter /> : null}
        </div>
        <div className={styles.main}>
            <div className={styles.main__inner}>
                {cocktailState.cocktailList.map((cocktail) => <Item key={cocktail.id} image={cocktail.image}
                    name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} />)}
            </div>
        </div>
        <button className={styles['my-liqour']} onClick={onClickMyLiqour}>My Liqour</button>
        <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} setLoginState={setFakeLoginState} />
        <InitMyLiqourModal isOpen={isInitMyLiqourOpen} setIsOpen={setIsInitMyLiqourOpen} />
    </div >
}


export default InitPage