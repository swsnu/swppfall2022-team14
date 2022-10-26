import { useState } from "react"
import Filter from "./Filter"
import Item from "./Item"

interface CocktailType {
    id: number,
    name: string,
    image: string,
    introduction: string,
    recipe: string,
    ABV: number,
    price_per_glass: number
    type: string,
    author_id: number,
    created_at: Date,
    updated_at: Date
}
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
            updated_at: new Date(2022, 7, 14)
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
            updated_at: new Date(2022, 7, 14)
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
            updated_at: new Date(2022, 7, 14)
        }]



    const [input, setInput] = useState('')
    const [isStandard, setIsStandard] = useState(true)
    const onClickToggle = (isStandard: boolean) => {
        setIsStandard(isStandard)
    }
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const onFilterClick = () => {
        setIsOpenFilter(!isOpenFilter)
    }


    return <>
        <div style={{ border: "1px solid black", height: "100px" }}>
            로그인 버튼 있는 헤더
            <button>로그인</button>
        </div>
        <div style={{ border: "1px solid blue", height: "100px" }}>
            토글버튼 2개, 인풋필드, 필터버튼, 검색버튼
            <button onClick={() => onClickToggle(true)} disabled={isStandard}>스탠다드</button>
            <button onClick={() => onClickToggle(false)} disabled={!isStandard}>커스텀</button>
            <input placeholder="칵테일 이름 검색" value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={onFilterClick}>FILTER</button>
            <button>SEARCH</button>
            {isOpenFilter ? <Filter /> : null}
        </div>
        <div style={{ border: "1px solid red", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="inner" style={{
                border: "1px solid green", width: "1376px", display: "flex", flexWrap: "wrap",

            }}>
                {dummyCocktails.map((cocktail) => <Item key={cocktail.id} type={cocktail.type} id={cocktail.id} name={cocktail.name} image={cocktail.image} />)}
            </div>
        </div>
        <button>My Liqour</button>
    </>
}


export default InitPage