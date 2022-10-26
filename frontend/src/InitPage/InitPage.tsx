import { useState } from "react"
import Item from "./Item"

const InitPage = () => {
    const [input, setInput] = useState('')
    const [isStandard, setIsStandard] = useState(true)
    const onClickToggle = (isStandard: boolean) => {
        setIsStandard(isStandard)
    }
    return <>
        <div style={{ border: "1px solid black", height: "100px" }}>
            로그인 버튼 있는 헤더
            <button>로그인</button>
        </div>
        <div style={{ border: "1px solid blue", height: "100px" }}>
            토글버튼 2개, 인풋필드, 필터버튼, 검색버튼
            <button onClick={() => onClickToggle(true)}>스탠다드</button>
            <button onClick={() => onClickToggle(false)}>커스텀</button>
            <input placeholder="칵테일 이름 검색" value={input} onChange={(e) => setInput(e.target.value)} />
            <button>FILTER</button>
            <button>SEARCH</button>

        </div>
        <div style={{ border: "1px solid red", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="inner" style={{
                border: "1px solid green", width: "1376px", display: "flex", flexWrap: "wrap",

            }}>
                <Item /><Item /><Item /><Item /><Item /><Item /><Item /><Item /><Item /><Item /><Item /><Item /><Item /><Item /><Item />

            </div>
        </div>
    </>
}


export default InitPage