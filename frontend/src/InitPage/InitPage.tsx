import { useState } from "react"
import { useNavigate } from "react-router"
import Filter from "./Components/Filter"
import Item from "./Components/Item"

import "./InitPage.scss"
import { CocktailType } from "./Components/Item"
import LoginModal from "./Modals/LoginModal"
import InitMyLiqourModal from "./Modals/InitMyLiqourModal"


const InitPage = () => {
    const dummyCocktails: CocktailType[] =
        [{
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
        }]
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



    return <>
        <div className="header">
            {fakeLoginState ? <button onClick={onClickProfile}>내 프로필</button> : <button onClick={onClickLogin}>로그인</button>}
            {fakeLoginState && isOpenProfile ? <div>
                <button onClick={onClickMyPage}>My Page</button>
                <button onClick={onClicklogout}>Logout</button>
            </div> : null}
        </div>
        <div className="nav">
            <button onClick={() => onClickToggle(true)} disabled={isStandard}>스탠다드</button>
            <button onClick={() => onClickToggle(false)} disabled={!isStandard}>커스텀</button>
            <input placeholder="칵테일 이름 검색" value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={onFilterClick}>FILTER</button>
            <button onClick={onClickSearch}>SEARCH</button>
            {isOpenFilter ? <Filter /> : null}
        </div>
        <div className="main">
            <div className="main__inner">
                {dummyCocktails.map((cocktail) => <Item key={cocktail.id} image={cocktail.image}
                    name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} />)}
            </div>
        </div>
        <button onClick={onClickMyLiqour}>My Liqour</button>
        <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} setLoginState={setFakeLoginState} />
        <InitMyLiqourModal isOpen={isInitMyLiqourOpen} setIsOpen={setIsInitMyLiqourOpen} />
    </>
}


export default InitPage