import { useState } from "react"
import "./Filter.scss"
interface typeOne {
    isClassic: boolean;
    isTropical: boolean;
    isNonAlcohol: boolean;
}
interface typeTwo {
    isLongDrink: boolean;
    isShortDrink: boolean;
    isShot: boolean;
}
const Filter = () => {
    const [typeOne, setTypeOne] = useState<typeOne>({ isClassic: false, isTropical: false, isNonAlcohol: false })
    const [typeTwo, setTypeTwo] = useState<typeTwo>({ isLongDrink: false, isShortDrink: false, isShot: false })

    return <div className="filter">
        <div>
            Type 1:
            클래식<input type="checkbox" name="type1" checked={typeOne.isClassic} onClick={() => setTypeOne({ ...typeOne, isClassic: !typeOne.isClassic })} />
            트로피컬<input type="checkbox" name="type1" checked={typeOne.isTropical} onClick={() => setTypeOne({ ...typeOne, isTropical: !typeOne.isTropical })} />
            논알콜<input type="checkbox" name="type1" checked={typeOne.isNonAlcohol} onClick={() => setTypeOne({ ...typeOne, isNonAlcohol: !typeOne.isNonAlcohol })} />
            {/* TODO : Fix Design Pattern */}
        </div>
        <div>   Type 2:
            롱드링크<input type="checkbox" name="type2" checked={typeTwo.isLongDrink} onClick={() => setTypeTwo({ ...typeTwo, isLongDrink: !typeTwo.isLongDrink })} />
            숏드링크<input type="checkbox" name="type2" checked={typeTwo.isShortDrink} onClick={() => setTypeTwo({ ...typeTwo, isShortDrink: !typeTwo.isShortDrink })} />
            샷<input type="checkbox" name="type2" checked={typeTwo.isShot} onClick={() => setTypeTwo({ ...typeTwo, isShot: !typeTwo.isShot })} />
        </div>
        <div>
            도수:
            <input style={{ "width": "20px" }} /> 이상 <input style={{ "width": "20px" }} /> 이하
        </div>
    </div>
}


export default Filter