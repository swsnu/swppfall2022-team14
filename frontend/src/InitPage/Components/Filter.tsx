import { Dispatch, SetStateAction, useEffect, useState } from "react"
import styles from "./Filter.module.scss"
import React from 'react';
import { Filterparam } from "../InitPage";

interface ParamList {
    name: string;
    label: string;
}

export interface Iprops {
    setUrlParams: Dispatch<SetStateAction<Filterparam>>
}



const Filter = (prop: Iprops) => {

    const typeOneList: ParamList[] = [{ name: "CL", label: "클래식" }, { name: "TP", label: "트로피컬" }]
    const typeTwoList: ParamList[] = [{ name: "LONG", label: "롱드링크" }, { name: "SHORT", label: "숏드링크" }, { name: "SHOT", label: "샷" }]
    const typeThreeList: ParamList[] = [{ name: "weak", label: "15도 이하" }, { name: "medium", label: "15 ~ 30도" }, { name: "strong", label: "30 ~ 40도" }, { name: "extreme", label: "40도 이상" }]
    const [typeOneParam, setTypeOneParam] = useState<string[]>([])
    const [typeTwoParam, setTypeTwoParam] = useState<string[]>([])
    const [typeThreeParam, setTypeThreeParam] = useState<string[]>([])
    const [availableOnly, setAvailableOnly] = useState<boolean>(false)
    // const url_params = `?filter_type_one=${typeOneParam}&filter_type_two=${typeTwoParam}&filter_type_three=${typeThreeParam}`
    const url_params = {
        type_one: typeOneParam,
        type_two: typeTwoParam,
        type_three: typeThreeParam,
        available_only: availableOnly
    }

    const onTypeClick = (param: string[], setParam: Dispatch<SetStateAction<string[]>>, type_name: string, unique = false) => {
        if (unique) { // 필터값 중복 불가
            if (param.includes(type_name))
                setParam([])
            else
                setParam([type_name])
        }
        else { // 필터값 중복 가능
            if (param.includes(type_name)) //  배열에서 제거
                setParam(param.filter(value => value != type_name))
            else
                setParam([...param, type_name]) // 배열에 넣기
        }
    }
    useEffect(() => prop.setUrlParams(url_params), [typeOneParam, typeTwoParam, typeThreeParam, availableOnly])

    return <div className={styles.filter}>
        <div className={styles.filter__line}>
            <div className={styles.filter__title}>Type 1</div>
            <div className={styles.filter__content}>
                {typeOneList.map((type) => {
                    return (
                        <React.Fragment key={type.name}>
                            <label>
                                <input
                                    key={type.name}
                                    type="checkbox"
                                    name="type1"
                                    defaultChecked={typeOneParam.includes(type.name)}
                                    onChange={() => prop.setUrlParams(url_params)}
                                    onClick={() => onTypeClick(typeOneParam, setTypeOneParam, type.name)}
                                />
                                {type.label}
                            </label>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
        <div className={styles.filter__line}>
            <div className={styles.filter__title}>Type 2</div>
            <div className={styles.filter__content}>
                {typeTwoList.map((type) => {
                    return (
                        <React.Fragment key={type.name}>
                            <label>
                                <input
                                    key={type.name}
                                    type="checkbox"
                                    name="type2"
                                    defaultChecked={typeTwoParam.includes(type.name)}
                                    onChange={() => prop.setUrlParams(url_params)}
                                    onClick={() => onTypeClick(typeTwoParam, setTypeTwoParam, type.name)}
                                />
                                {type.label}
                            </label>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
        <div className={styles.filter__line}>
            <div className={styles.filter__title}>도수 </div>
            <div className={styles.filter__content}>
                {typeThreeList.map((type) => {
                    return (
                        <React.Fragment key={type.name}>
                            <label>
                                <input
                                    key={type.name}
                                    type="checkbox"
                                    name="type3"
                                    defaultChecked={typeThreeParam.includes(type.name)}
                                    onChange={() => prop.setUrlParams(url_params)}
                                    onClick={() => onTypeClick(typeThreeParam, setTypeThreeParam, type.name, true)}
                                />
                                {type.label}
                            </label>
                        </React.Fragment>
                    )
                })}
            </div>

        </div>
        <div className={styles.filter__line}>
            <div className={styles.filter__title}>재료 기반 검색</div>
            <div className={styles.filter__content}>
                <label>
                    <input
                        type="checkbox"
                        name="available_only"
                        defaultChecked={availableOnly}
                        onClick={() => setAvailableOnly(!availableOnly)}
                    />
                    만들 수 있는 칵테일만
                </label>
            </div>
        </div>
    </div >
}


export default Filter