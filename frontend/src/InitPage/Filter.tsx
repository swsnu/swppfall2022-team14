import { useState } from "react"

interface typeOne {
    isClassic: boolean;
    isTropical: boolean;
    isNonAlcohol: boolean;
}
const Filter = () => {
    const [typeOne, setTypeOne] = useState<typeOne>({ isClassic: false, isTropical: false, isNonAlcohol: false })

    return <div style={{ border: "1px solid black", width: "300px", height: "100px", background: "lightgray" }}>
        <div>
            Type 1:
            클래식<input type="checkbox" name="type1" checked={typeOne.isClassic} onClick={() => setTypeOne({ ...typeOne, isClassic: !typeOne.isClassic })} />
            트로피컬<input type="checkbox" name="type1" checked={typeOne.isTropical} onClick={() => setTypeOne({ ...typeOne, isTropical: !typeOne.isTropical })} />
            논알콜<input type="checkbox" name="type1" checked={typeOne.isNonAlcohol} onClick={() => setTypeOne({ ...typeOne, isNonAlcohol: !typeOne.isNonAlcohol })} />
        </div>
        <div>   Type 2:
            롱드링크<input type="checkbox" name="type2" />
            숏드링크<input type="checkbox" name="type2" />
            샷<input type="checkbox" name="type2" />
        </div>
        <div>
            도수:
            <input style={{ "width": "20px" }} /> 이상 <input style={{ "width": "20px" }} /> 이하
        </div>
    </div>
}


export default Filter