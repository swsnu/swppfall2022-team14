import React, {useEffect, useState} from 'react';
import './NavFilter.scss'
import styles from "../../InitPage/Components/Filter.module.scss";
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
interface typeThree {
    weak: boolean;
    medium: boolean;
    strong: boolean;
    extreme: boolean;
}

const NavFilter = () => {

    const [typeOne, setTypeOne] = useState<typeOne>({ isClassic: false, isTropical: false, isNonAlcohol: false })
    const [typeTwo, setTypeTwo] = useState<typeTwo>({ isLongDrink: false, isShortDrink: false, isShot: false })
    const [typeThree, setTypeThree] = useState<typeThree>({ weak: false, medium: false, strong: false, extreme: false })
    const typeThree_init: typeThree = { weak: false, medium: false, strong: false, extreme: false }

    return(
        <div className="navfilter">
            <div className="navfilter__wrap">
                <div className={"navfilter__title"}>Type 1</div>
                <div className={"navfilter__content"}>
                    <input type="checkbox" name="type1" checked={typeOne.isClassic} onClick={() => setTypeOne({ ...typeOne, isClassic: !typeOne.isClassic })} />
                    <div>클래식</div>
                    <input type="checkbox" name="type1" checked={typeOne.isTropical} onClick={() => setTypeOne({ ...typeOne, isTropical: !typeOne.isTropical })} />트로피컬
                    <input type="checkbox" name="type1" checked={typeOne.isNonAlcohol} onClick={() => setTypeOne({ ...typeOne, isNonAlcohol: !typeOne.isNonAlcohol })} />논알콜
                </div>
            </div>
            <div className="navfilter__wrap">
                <div className={"navfilter__title"}>Type 2</div>
                <div className={"navfilter__content"}>
                    <input type="checkbox" name="type2" checked={typeTwo.isLongDrink} onClick={() => setTypeTwo({ ...typeTwo, isLongDrink: !typeTwo.isLongDrink })} />롱드링크
                    <input type="checkbox" name="type2" checked={typeTwo.isShortDrink} onClick={() => setTypeTwo({ ...typeTwo, isShortDrink: !typeTwo.isShortDrink })} />숏드링크
                    <input type="checkbox" name="type2" checked={typeTwo.isShot} onClick={() => setTypeTwo({ ...typeTwo, isShot: !typeTwo.isShot })} />샷
                </div>
            </div>
            <div className="navfilter__wrap">
                <div className={"navfilter__title"}>도수 </div>
                <div className={"navfilter__content"}>
                    <input type="checkbox" name="type3" checked={typeThree.weak} onClick={() => setTypeThree({ ...typeThree_init, weak: !typeThree.weak })} />15도 이하
                    <input type="checkbox" name="type3" checked={typeThree.medium} onClick={() => setTypeThree({ ...typeThree_init, medium: !typeThree.medium })} />15 ~ 30도
                    <input type="checkbox" name="type3" checked={typeThree.strong} onClick={() => setTypeThree({ ...typeThree_init, strong: !typeThree.strong })} />30 ~ 40도
                    <input type="checkbox" name="type3" checked={typeThree.extreme} onClick={() => setTypeThree({ ...typeThree_init, extreme: !typeThree.extreme })} />40도 이상
                </div>
            </div>
        </div>
    )
}

export default NavFilter