import { Dispatch, SetStateAction, useState } from "react"
import styles from "./Filter.module.scss"
import React from 'react';

interface ParamList {
    name: string;
    label: string;
}

interface Iprops {
    setUrlParams: Dispatch<SetStateAction<string>>
}

const Filter = (prop: Iprops) => {

    const typeOneList: ParamList[] = [{ name: "_CL", label: "클래식" }, { name: "_TP", label: "트로피컬" }]
    const typeTwoList: ParamList[] = [{ name: "_LONG", label: "롱드링크" }, { name: "_SHORT", label: "숏드링크" }, { name: "_SHOT", label: "샷" }]
    const typeThreeList: ParamList[] = [{ name: "weak", label: "15도 이하" }, { name: "medium", label: "15 ~ 30도" }, { name: "strong", label: "30 ~ 40도" }, { name: "extreme", label: "40도 이상" }]
    const [typeOneParam, setTypeOneParam] = useState<string>("")
    const [typeTwoParam, setTypeTwoParam] = useState<string>("")
    const [typeThreeParam, setTypeThreeParam] = useState<string>("")
    const url_params = `&filter_type_one=${typeOneParam}&filter_type_two=${typeTwoParam}&filter_type_three=${typeThreeParam}`

    const onTypeClick = (param: string, setParam: Dispatch<SetStateAction<string>>, type_name: string, unique = false) => {
        if (unique) {
            if (param === type_name)
                setParam("")
            else
                setParam(type_name)
        }
        else {
            if (!param.includes(type_name))
                setParam(param + type_name)
            else
                setParam(param.replace(type_name, ""))
        }
    }

    return <div className={styles.filter}>
        <div className={styles.filter__line}>
            <div className={styles.filter__title}>Type 1</div>
            <div className={styles.filter__content}>
                {typeOneList.map((type) => {
                    return <React.Fragment key={type.name}><input key={type.name} type="checkbox" name="type1"
                        checked={typeOneParam.includes(type.name)} onChange={() => prop.setUrlParams(url_params)} onClick={() => onTypeClick(typeOneParam, setTypeOneParam, type.name)} />{type.label} </React.Fragment>
                })}
            </div>
        </div>
        <div className={styles.filter__line}>
            <div className={styles.filter__title}>Type 2</div>
            <div className={styles.filter__content}>
                {typeTwoList.map((type) => {
                    return <React.Fragment key={type.name}><input key={type.name} type="checkbox" name="type2"
                        checked={typeTwoParam.includes(type.name)} onChange={() => prop.setUrlParams(url_params)} onClick={() => onTypeClick(typeTwoParam, setTypeTwoParam, type.name)} />{type.label} </React.Fragment>
                })}
            </div>
        </div>
        <div className={styles.filter__line}>
            <div className={styles.filter__title}>도수 </div>
            <div className={styles.filter__content}>
                {typeThreeList.map((type) => {
                    return <React.Fragment key={type.name}><input key={type.name} type="checkbox" name="type3"
                        checked={typeThreeParam.includes(type.name)} onChange={() => prop.setUrlParams(url_params)} onClick={() => onTypeClick(typeThreeParam, setTypeThreeParam, type.name, true)} />{type.label}</React.Fragment>
                })}
            </div>

        </div>
    </div >
}


export default Filter