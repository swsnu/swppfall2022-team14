import { Dispatch, SetStateAction, useEffect, useState } from "react"
import styles from "./Filter.module.scss"
import React from 'react';
import { Filterparam } from "../InitPage";

interface ParamList {
    name: string;
    label: string;
}

interface FilterType {
    type: "typeOne"|"typeTwo"|"typeThree";
    name: string;
}

interface ThemeList {
    label: string,
    filters: FilterType[]
}

export interface Iprops {
    setUrlParams: Dispatch<SetStateAction<Filterparam>>
}



const Filter = (prop: Iprops) => {

    const themeList: ThemeList[] = [
        {label: "Theme1", filters: [{type: "typeOne", name:"CL"}, {type:"typeThree", name:"weak"}]}, 
        {label: "Theme2", filters: [{type: "typeOne", name:"TP"}, {type:"typeThree", name:"medium"}, {type:"typeTwo", name:"LONG"}]}
    ]
    const typeOneList: ParamList[] = [{ name: "CL", label: "클래식" }, { name: "TP", label: "트로피컬" }]
    const typeTwoList: ParamList[] = [{ name: "LONG", label: "롱드링크" }, { name: "SHORT", label: "숏드링크" }, { name: "SHOT", label: "샷" }]
    const typeThreeList: ParamList[] = [{ name: "weak", label: "15도 이하" }, { name: "medium", label: "15 ~ 30도" }, { name: "strong", label: "30 ~ 40도" }, { name: "extreme", label: "40도 이상" }]
    const [typeParam, setTypeParam] = useState<
    {
        typeOne: string[],
        typeTwo: string[],
        typeThree: string[],
    }>({
        typeOne: [],
        typeTwo: [],
        typeThree: [],
    })
    const [availableOnly, setAvailableOnly] = useState<boolean>(false)
    const url_params = {
        type_one: typeParam.typeOne,
        type_two: typeParam.typeTwo,
        type_three: typeParam.typeThree,
        available_only: availableOnly
    }
    const onTypeClick = (param_type: "typeOne"|"typeTwo"|"typeThree", type_name: string) => {
        console.log(typeParam)
        if(param_type === "typeOne"){
            console.log("?")
            const param = typeParam.typeOne
            if (!param.includes(type_name)){
                setTypeParam({...typeParam, typeOne:param.concat(type_name)})
            }
            else
                setTypeParam({...typeParam, typeOne:param.filter(value => value != type_name)})
        }else if(param_type === "typeTwo"){
            const param = typeParam.typeTwo
            if (!param.includes(type_name))
                setTypeParam({...typeParam, typeTwo:param.concat(type_name)})
            else
                setTypeParam({...typeParam, typeTwo:param.filter(value => value != type_name)})
        }else{
            const param = typeParam.typeThree
            if (param.includes(type_name))
                setTypeParam({...typeParam, typeThree:[]})
            else
                setTypeParam({...typeParam, typeThree:[type_name]})
        }
    }

    const onThemeClick = (filters: ThemeList) => {
        const typeOne = [];
        const typeTwo = [];
        let typeThree = "";
        for(const filter of filters.filters){
            if(filter.type === "typeOne"){
                typeOne.push(filter.name)
            }else if(filter.type === "typeTwo"){
                typeTwo.push(filter.name)
            }else{
                typeThree = filter.name
            }
        }
        setTypeParam({
            typeOne: typeOne,
            typeTwo: typeTwo,
            typeThree: [typeThree],
        })
    }

    useEffect(() => prop.setUrlParams(url_params), [typeParam, availableOnly])

    console.log(typeParam)

    return <div className={styles.filter}>
        <div className={styles.filter__line}>
                    <div className={styles.filter__title}>Theme</div>
                    <div className={styles.filter__content}>
                        {themeList.map((type) => {
                            return (
                                <React.Fragment key={type.label}>
                                    <label>
                                        <button 
                                            key={type.label} 
                                            name="theme"
                                            onChange={() => prop.setUrlParams(url_params)} 
                                            onClick={() => onThemeClick(type)} 
                                        />
                                        {type.label} 
                                    </label>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
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
                                    checked={typeParam.typeOne.includes(type.name)} 
                                    onChange={() => prop.setUrlParams(url_params)} 
                                    onClick={() => onTypeClick("typeOne", type.name)} 
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
                                checked={typeParam.typeTwo.includes(type.name)} 
                                onChange={() => prop.setUrlParams(url_params)} 
                                onClick={() => onTypeClick("typeTwo", type.name)} 
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
                                    type="checkbox" name="type3"
                                    checked={typeParam.typeThree.includes(type.name)} 
                                    onChange={() => prop.setUrlParams(url_params)} 
                                    onClick={() => onTypeClick("typeThree", type.name)} 
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
                        checked={availableOnly}
                        onClick={() => setAvailableOnly(!availableOnly)}
                    />
                    만들 수 있는 칵테일만
                </label>
            </div>
        </div>
    </div >
}


export default Filter