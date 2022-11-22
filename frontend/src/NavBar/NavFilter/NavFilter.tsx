import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Filterparam } from '../../InitPage/InitPage';
import { selectIngredient } from '../../store/slices/ingredient/ingredient';
import './NavFilter.scss'

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
    type: string
}

const NavFilter = (prop: Iprops) => {
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
    const [input, setInput] = useState('')
    const [availableOnly, setAvailableOnly] = useState<boolean>(false)

    const url_params = {
        type_one: typeParam.typeOne,
        type_two: typeParam.typeTwo,
        type_three: typeParam.typeThree,
        available_only: availableOnly
    }
    
    const request_param = { filter_param: url_params, name_param: input }
    const navigate = useNavigate()
    const onClickSearch = () => {
        // TODO : give params with filter information
        if (prop.type === 'ST') navigate(`/standard`,
            { state: request_param }
        )
        else if (prop.type === 'CS') navigate(`/custom`, { state: request_param })
        else if (prop.type === 'IG') navigate(`/ingredient`)
    }

    const onTypeClick = (param_type: "typeOne"|"typeTwo"|"typeThree", type_name: string) => {
        console.log(typeParam)
        if(param_type === "typeOne"){
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

    if (prop.type === 'IG') {
        return (
            <div className="navfilter">
                <div className="navfilter__wrap">
                    <div className={"navfilter__title"}>Text 검색 </div>
                    <div className={"navfilter__content"}>
                        <input className="navfilter__search-text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="     검색어를 입력하세요" />
                    </div>
                </div>
                <button className="navfilter__btn" onClick={onClickSearch}>검색하기</button>
            </div>
        )
    }
    else {
        return (
            <div className="navfilter">
                <div className="navfilter__wrap">
                    <div className={"navfilter__title"}>Theme</div>
                    <div className={"navfilter__content"}>
                        {themeList.map((type) => {
                            return (
                                <React.Fragment key={type.label}>
                                    <label>
                                        <button 
                                            key={type.label} 
                                            name="theme" 
                                            onClick={() => onThemeClick(type)} 
                                        />
                                        {type.label} 
                                    </label>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
                <div className="navfilter__wrap">
                    <div className={"navfilter__title"}>Type 1</div>
                    <div className={"navfilter__content"}>
                        {typeOneList.map((type) => {
                            return (
                                <React.Fragment key={type.name}>
                                    <label>
                                        <input
                                            key={type.name}
                                            type="checkbox"
                                            name="type1"
                                            checked={typeParam.typeOne.includes(type.name)}
                                            onChange={() => onTypeClick("typeOne", type.name)} 
                                        />
                                        {type.label}
                                    </label>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
                <div className="navfilter__wrap">
                    <div className={"navfilter__title"}>Type 2</div>
                    <div className={"navfilter__content"}>
                        {typeTwoList.map((type) => {
                            return (
                                <React.Fragment key={type.name}>
                                    <label>
                                        <input
                                            key={type.name}
                                            type="checkbox"
                                            name="type2"
                                            checked={typeParam.typeTwo.includes(type.name)}
                                            onChange={() => onTypeClick("typeTwo", type.name)} 
                                        />
                                        {type.label}
                                    </label>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
                <div className="navfilter__wrap">
                    <div className={"navfilter__title"}>도수 </div>
                    <div className={"navfilter__content"}>
                        {typeThreeList.map((type) => {
                            return (
                                <React.Fragment key={type.name}>
                                    <label>
                                        <input
                                            key={type.name}
                                            type="checkbox" name="type3"
                                            checked={typeParam.typeThree.includes(type.name)}
                                            onChange={() => onTypeClick("typeThree", type.name)} 
                                        />
                                        {type.label}
                                    </label>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
                <div className="navfilter__wrap">
                    <div className={"navfilter__title"}>재료 기반 검색</div>
                    <div className={"navfilter__content"}>
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
                <div className="navfilter__wrap">
                    <div className={"navfilter__title"}>Text 검색 </div>
                    <div className={"navfilter__content"}>
                        <input className="navfilter__search-text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="     검색어를 입력하세요" />
                    </div>
                </div>
                <button className="navfilter__btn" onClick={onClickSearch}>검색하기</button>
            </div>
        )
    }
}

export default NavFilter