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

export interface Iprops {
    type: string
}

const NavFilter = (prop: Iprops) => {

    const typeOneList: ParamList[] = [{ name: "CL", label: "클래식" }, { name: "TP", label: "트로피컬" }]
    const typeTwoList: ParamList[] = [{ name: "LONG", label: "롱드링크" }, { name: "SHORT", label: "숏드링크" }, { name: "SHOT", label: "샷" }]
    const typeThreeList: ParamList[] = [{ name: "weak", label: "15도 이하" }, { name: "medium", label: "15 ~ 30도" }, { name: "strong", label: "30 ~ 40도" }, { name: "extreme", label: "40도 이상" }]
    const [input, setInput] = useState('')
    const [typeOneParam, setTypeOneParam] = useState<string[]>([])
    const [typeTwoParam, setTypeTwoParam] = useState<string[]>([])
    const [typeThreeParam, setTypeThreeParam] = useState<string[]>([])
    const [availableOnly, setAvailableOnly] = useState<boolean>(false)
    const url_params = {
        type_one: typeOneParam,
        type_two: typeTwoParam,
        type_three: typeThreeParam,
        available_only: availableOnly
    }
    const ingredientState = useSelector(selectIngredient)
    const my_ingredient_id_list = ingredientState.myIngredientList.map(ingredient => ingredient.id)

    const request_param = { filter_param: url_params, name_param: input, my_ingredient_param: availableOnly ? my_ingredient_id_list : null }

    const navigate = useNavigate()
    const onClickSearch = () => {
        // TODO : give params with filter information
        if (prop.type === 'ST') navigate(`/standard`,
            { state: request_param }
        )
        else if (prop.type === 'CS') navigate(`/custom`, { state: request_param })
        else if (prop.type === 'IG') navigate(`/ingredient`)
    }


    const onTypeClick = (param: string[], setParam: Dispatch<SetStateAction<string[]>>, type_name: string, unique = false) => {
        if (unique) {
            if (param.includes(type_name))
                setParam([])
            else
                setParam([type_name])

        }
        else {// 필터값 중복 가능
            if (param.includes(type_name)) //  배열에서 제거
                setParam(param.filter(value => value != type_name))
            else
                setParam([...param, type_name]) // 배열에 넣기
        }
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
                                            defaultChecked={typeOneParam.includes(type.name)}
                                            onChange={() => onTypeClick(typeOneParam, setTypeOneParam, type.name)}
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
                                            defaultChecked={typeTwoParam.includes(type.name)}
                                            onChange={() => onTypeClick(typeTwoParam, setTypeTwoParam, type.name)}
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
                                            checked={typeThreeParam.includes(type.name)}
                                            onChange={() => onTypeClick(typeThreeParam, setTypeThreeParam, type.name, true)}
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